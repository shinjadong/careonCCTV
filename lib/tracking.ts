// 페이지 방문 추적 데이터 수집 유틸리티

export interface PageViewData {
  // 시간 정보
  timestamp: string

  // URL 정보
  current_url: string
  referrer: string
  landing_page: string

  // UTM 파라미터 (마케팅 추적)
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string

  // 디바이스 정보
  device_type: string // Mobile, Desktop, Tablet
  screen_size: string // 예: 1920x1080
  viewport_size: string // 예: 1920x937

  // 브라우저 정보
  browser_language: string
  user_agent: string

  // 기타
  is_touch_device: boolean
  session_id: string
}

// URL에서 UTM 파라미터 추출
export function getUTMParams(): {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
} {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: ''
    }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || ''
  }
}

// User Agent에서 디바이스 타입 판별
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const ua = navigator.userAgent.toLowerCase()

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile'
  }
  return 'Desktop'
}

// 화면 크기 정보
export function getScreenSize(): string {
  if (typeof window === 'undefined') return ''
  return `${screen.width}x${screen.height}`
}

// 뷰포트 크기 정보
export function getViewportSize(): string {
  if (typeof window === 'undefined') return ''
  return `${window.innerWidth}x${window.innerHeight}`
}

// 터치 디바이스 여부
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 세션 ID 생성 또는 가져오기 (localStorage 활용)
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  const SESSION_KEY = 'pageview_session_id'
  const SESSION_DURATION = 30 * 60 * 1000 // 30분

  try {
    const stored = localStorage.getItem(SESSION_KEY)
    const storedTime = localStorage.getItem(`${SESSION_KEY}_time`)

    if (stored && storedTime) {
      const elapsed = Date.now() - parseInt(storedTime, 10)
      if (elapsed < SESSION_DURATION) {
        // 세션이 유효하면 시간 갱신
        localStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString())
        return stored
      }
    }

    // 새 세션 생성
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem(SESSION_KEY, newSessionId)
    localStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString())
    return newSessionId
  } catch (error) {
    // localStorage 사용 불가 시 임시 세션 ID
    return `temp_${Date.now()}`
  }
}

// 랜딩 페이지 URL 저장/가져오기
export function getLandingPage(): string {
  if (typeof window === 'undefined') return ''

  const LANDING_KEY = 'landing_page'

  try {
    const stored = localStorage.getItem(LANDING_KEY)
    if (!stored) {
      const currentUrl = window.location.href
      localStorage.setItem(LANDING_KEY, currentUrl)
      return currentUrl
    }
    return stored
  } catch (error) {
    return window.location.href
  }
}

// 이전 페이지 URL 저장/가져오기 (내부 페이지 이동 추적)
export function getPreviousPage(): string {
  if (typeof window === 'undefined') return ''

  const PREVIOUS_KEY = 'previous_page'
  const INITIAL_REFERRER_KEY = 'initial_referrer'

  try {
    // 현재 URL
    const currentUrl = window.location.href

    // 1순위: localStorage에 저장된 이전 페이지 (사이트 내부 이동)
    const storedPrevious = localStorage.getItem(PREVIOUS_KEY)

    // 2순위: 최초 방문 시 저장한 referrer
    const initialReferrer = localStorage.getItem(INITIAL_REFERRER_KEY)

    // 3순위: document.referrer (실시간)
    const documentReferrer = document.referrer

    console.log('🔍 Referrer 추적:', {
      storedPrevious,
      initialReferrer,
      documentReferrer,
      currentUrl
    })

    // 로직: localStorage의 이전 페이지가 있고, 현재 페이지와 다르면 사용
    if (storedPrevious && storedPrevious !== currentUrl) {
      console.log('✅ Using stored previous:', storedPrevious)
      return storedPrevious
    }

    // 최초 방문 시 저장한 referrer 사용
    if (initialReferrer && initialReferrer !== '직접 접속') {
      console.log('✅ Using initial referrer:', initialReferrer)
      return initialReferrer
    }

    // document.referrer 사용
    if (documentReferrer) {
      console.log('✅ Using document.referrer:', documentReferrer)
      // 최초 referrer로 저장 (다음에 사용)
      localStorage.setItem(INITIAL_REFERRER_KEY, documentReferrer)
      return documentReferrer
    }

    console.log('⚠️ No referrer found - 직접 접속')
    return '직접 접속'
  } catch (error) {
    console.error('getPreviousPage 오류:', error)
    return document.referrer || '직접 접속'
  }
}

// 현재 페이지를 이전 페이지로 저장 (다음 페이지 이동을 위해)
export function saveCurrentPageAsPrevious(): void {
  if (typeof window === 'undefined') return

  const PREVIOUS_KEY = 'previous_page'
  const currentUrl = window.location.href

  try {
    localStorage.setItem(PREVIOUS_KEY, currentUrl)
  } catch (error) {
    console.error('이전 페이지 저장 실패:', error)
  }
}

// 모든 페이지뷰 데이터 수집
export function collectPageViewData(): PageViewData {
  const utmParams = getUTMParams()

  return {
    timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    current_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: getPreviousPage(), // 개선: localStorage 우선, document.referrer 후순위
    landing_page: getLandingPage(),
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    utm_term: utmParams.utm_term,
    utm_content: utmParams.utm_content,
    device_type: getDeviceType(),
    screen_size: getScreenSize(),
    viewport_size: getViewportSize(),
    browser_language: typeof window !== 'undefined' ? navigator.language : '',
    user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
    is_touch_device: isTouchDevice(),
    session_id: getOrCreateSessionId()
  }
}
