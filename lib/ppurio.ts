// 뿌리오 SMS 발송 API

const PPURIO_API_BASE = 'https://message.ppurio.com/v1'
const PPURIO_ACCOUNT = process.env.PPURIO_ACCOUNT!
const PPURIO_ACCESS_KEY = process.env.PPURIO_ACCESS_KEY!
const PPURIO_FROM_NUMBER = process.env.PPURIO_FROM_NUMBER || '1866-1845'

// 토큰 캐시 (24시간 유효)
let cachedToken: string | null = null
let tokenExpiry: number = 0

/**
 * 뿌리오 Access Token 발급 (24시간 유효)
 */
async function getAccessToken(): Promise<string> {
  // 캐시된 토큰이 유효하면 재사용
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const tokenUrl = `${PPURIO_API_BASE}/token`
  const credentials = Buffer.from(`${PPURIO_ACCOUNT}:${PPURIO_ACCESS_KEY}`).toString('base64')

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`뿌리오 토큰 발급 실패: ${response.status}`)
    }

    const data = await response.json()

    if (!data.token) {
      throw new Error('토큰 응답에 token 필드 없음')
    }

    // 토큰 캐시 (23시간 유효로 설정)
    cachedToken = data.token
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000)

    console.log('✅ 뿌리오 토큰 발급 성공')
    return data.token
  } catch (error) {
    console.error('❌ 뿌리오 토큰 발급 오류:', error)
    throw error
  }
}

/**
 * SMS 발송 인터페이스
 */
export interface SMSParams {
  to: string | string[] // 수신 번호 (단일 또는 배열)
  from?: string // 발신 번호 (선택, 기본값 사용)
  content: string // 문자 내용
  subject?: string // LMS 제목 (선택)
  refKey?: string // 참조 키 (선택)
}

/**
 * SMS 발송 (단문/장문 자동 감지)
 */
export async function sendSMS(params: SMSParams): Promise<boolean> {
  try {
    // 토큰 발급
    const token = await getAccessToken()

    // 수신자 번호 배열로 변환
    const recipients = Array.isArray(params.to) ? params.to : [params.to]

    // 문자 타입 자동 감지 (SMS: 90자 이하, LMS: 91자 이상)
    const messageType = params.content.length <= 90 ? 'SMS' : 'LMS'

    // 수신자 목록 구성
    const targets = recipients.map(phoneNumber => ({
      to: phoneNumber.replace(/-/g, ''), // 하이픈 제거
      name: '', // 이름은 선택사항
    }))

    // 발송 데이터 구성
    const sendData = {
      account: PPURIO_ACCOUNT,
      messageType: messageType,
      from: (params.from || PPURIO_FROM_NUMBER).replace(/-/g, ''),
      content: params.content,
      subject: params.subject || '',
      duplicateFlag: 'Y', // 중복 번호 허용
      targetCount: targets.length,
      targets: targets,
      refKey: params.refKey || `sms_${Date.now()}`
    }

    console.log('📤 SMS 발송 요청:', {
      messageType,
      targetCount: targets.length,
      contentLength: params.content.length
    })

    // API 호출
    const response = await fetch(`${PPURIO_API_BASE}/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ SMS 발송 실패:', response.status, errorText)
      throw new Error(`SMS 발송 실패: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ SMS 발송 성공:', result)

    return true
  } catch (error) {
    console.error('❌ SMS 발송 오류:', error)
    // SMS 발송 실패는 견적 신청 자체를 막지 않음 (silent fail)
    return false
  }
}

/**
 * 견적 신청 알림 SMS 발송
 */
export async function sendConsultationNotification(data: {
  name: string
  phone: string
  address: string
  cameraCount: string
  referrer?: string
}) {
  // 직원 전화번호 목록 (환경변수)
  const staffNumbers = process.env.PPURIO_STAFF_NUMBERS?.split(',') || []

  if (staffNumbers.length === 0) {
    console.warn('⚠️ 직원 전화번호 목록이 설정되지 않았습니다 (PPURIO_STAFF_NUMBERS)')
    return false
  }

  // SMS 내용 구성
  const content = `[CCTV 견적 문의]
고객명: ${data.name}
설치 대수: ${data.cameraCount}
지역: ${data.address}
전화번호: ${data.phone}

유입 링크: ${data.referrer || '직접 접속'}`

  // 직원들에게 SMS 발송
  return await sendSMS({
    to: staffNumbers,
    content: content,
    refKey: `consultation_${Date.now()}`
  })
}
