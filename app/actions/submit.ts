"use server"

import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Google Sheets 설정
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
]

// 환경변수에서 Google Sheets 정보 로드
const PRIMARY_SHEET_ID = process.env.PRIMARY_SHEET_ID
const PRIMARY_SHEET_NAME = process.env.PRIMARY_SHEET_NAME
const PRIMARY_CLIENT_EMAIL = process.env.PRIMARY_CLIENT_EMAIL
const PRIMARY_PRIVATE_KEY = process.env.PRIMARY_PRIVATE_KEY

const SECONDARY_SHEET_ID = process.env.SECONDARY_SHEET_ID
const SECONDARY_SHEET_NAME = process.env.SECONDARY_SHEET_NAME
const SECONDARY_CLIENT_EMAIL = process.env.SECONDARY_CLIENT_EMAIL
const SECONDARY_PRIVATE_KEY = process.env.SECONDARY_PRIVATE_KEY

const TERTIARY_SHEET_ID = process.env.TERTIARY_SHEET_ID
const TERTIARY_SHEET_NAME = process.env.TERTIARY_SHEET_NAME
const TERTIARY_CLIENT_EMAIL = process.env.TERTIARY_CLIENT_EMAIL
const TERTIARY_PRIVATE_KEY = process.env.TERTIARY_PRIVATE_KEY

// 값이 없을 경우 예외처리
function requireEnv(key: string, value: any) {
  if (!value) {
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다.`)
  }
  return value
}

// 헤더 설정 (간소화)
const HEADERS = [
  "신청일시",
  "이름",
  "연락처",
  "설치장소",
  "주소",
  "설치대수",
  "개인정보동의"
]


// JWT 설정 - 기본 서비스 계정
async function getPrimaryJWTClient() {
  try {
    const email = requireEnv('PRIMARY_CLIENT_EMAIL', PRIMARY_CLIENT_EMAIL)
    const key = requireEnv('PRIMARY_PRIVATE_KEY', PRIMARY_PRIVATE_KEY)
    const sheetId = requireEnv('PRIMARY_SHEET_ID', PRIMARY_SHEET_ID)
    const sheetName = requireEnv('PRIMARY_SHEET_NAME', PRIMARY_SHEET_NAME)

    console.log('Primary Email:', email)
    console.log('Primary Sheet ID:', sheetId)
    
    const jwt = new JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    })
    await jwt.authorize()
    return jwt
  } catch (error) {
    console.error('Primary JWT Error:', error)
    throw error
  }
}

// JWT 설정 - 두 번째 서비스 계정
async function getSecondaryJWTClient() {
  try {
    if (!SECONDARY_CLIENT_EMAIL || !SECONDARY_PRIVATE_KEY) {
      console.log('Secondary service account not configured')
      return null
    }
    
    console.log('Secondary Email:', SECONDARY_CLIENT_EMAIL)
    console.log('Secondary Sheet ID:', SECONDARY_SHEET_ID)
    
    const jwt = new JWT({
      email: SECONDARY_CLIENT_EMAIL,
      key: SECONDARY_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    })

    await jwt.authorize()
    return jwt
  } catch (error) {
    console.error('Secondary JWT Error:', error)
    return null // 오류가 발생해도 주 시트에는 저장 시도
  }
}

// JWT 설정 - 세 번째 서비스 계정
async function getTertiaryJWTClient() {
  try {
    if (!TERTIARY_CLIENT_EMAIL || !TERTIARY_PRIVATE_KEY) {
      console.log('Tertiary service account not configured')
      return null
    }
    
    console.log('Tertiary Email:', TERTIARY_CLIENT_EMAIL)
    console.log('Tertiary Sheet ID:', TERTIARY_SHEET_ID)
    
    const jwt = new JWT({
      email: TERTIARY_CLIENT_EMAIL,
      key: TERTIARY_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    })

    await jwt.authorize()
    return jwt
  } catch (error) {
    console.error('Tertiary JWT Error:', error)
    return null // 오류가 발생해도 다른 시트에는 저장 시도
  }
}

// 시트 가져오기 또는 생성
async function getOrCreateSheet(doc: GoogleSpreadsheet, sheetName: string) {
  try {
    await doc.loadInfo()
    
    // 기존 시트 찾기
    let sheet = doc.sheetsByTitle[sheetName]
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: sheetName,
        headerValues: HEADERS
      })
      console.log('New sheet created:', sheetName)
    }
    
    return sheet
  } catch (error) {
    console.error('Error getting/creating sheet:', error)
    throw error
  }
}

// 시트 초기화 함수
async function initializeSheet(sheet: any) {
  try {
    // 시트 크기 설정
    await sheet.resize({ rowCount: 1000, columnCount: HEADERS.length })
    console.log('Sheet resized')

    // 첫 번째 행에 헤더 설정
    const range = `A1:${String.fromCharCode(65 + HEADERS.length - 1)}1`
    await sheet.loadCells(range)
    
    HEADERS.forEach((header, index) => {
      const cell = sheet.getCell(0, index)
      cell.value = header
    })
    
    await sheet.saveUpdatedCells()
    console.log('Headers set successfully')

    // 헤더 스타일 설정
    await sheet.loadCells(range)
    HEADERS.forEach((_, index) => {
      const cell = sheet.getCell(0, index)
      cell.textFormat = { bold: true }
      cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 }
    })
    await sheet.saveUpdatedCells()
    console.log('Header styles applied')

    // 헤더 행 고정
    await sheet.updateProperties({
      gridProperties: {
        frozenRowCount: 1
      }
    })
    console.log('Header row frozen')

    return true
  } catch (error) {
    console.error('Error initializing sheet:', error)
    throw error
  }
}

// 새 행 추가 함수
async function addNewRow(sheet: any, data: any[]) {
  try {
    const range = `A1:${String.fromCharCode(65 + HEADERS.length - 1)}1000`
    await sheet.loadCells(range)
    
    let lastRow = 0
    for (let i = 0; i < 1000; i++) {
      if (sheet.getCell(i, 0).value === null) {
        lastRow = i
        break
      }
    }

    // 배열 형태의 데이터를 처리
    data.forEach((value, index) => {
      if (index < HEADERS.length) { // 헤더 개수를 초과하지 않도록 확인
        const cell = sheet.getCell(lastRow, index)
        cell.value = value
      }
    })
    
    await sheet.saveUpdatedCells()
    console.log('New row added at position:', lastRow + 1)
    
    return true
  } catch (error) {
    console.error('Error adding new row:', error)
    throw error
  }
}

// 상담 신청 제출 함수
export async function submitConsultation(data: {
  name: string
  phone: string
  contactTime: string
  place: string
  address: string
  installationDate: string
  installationTime: string
  cameraCount: string
  memo?: string
  privacy: boolean
}) {
  try {
    // 디버깅 로그
    console.log('상담 신청 데이터 수신:', data)
    
    // 환경변수 확인
    console.log('환경변수 확인:')
    console.log('PRIMARY_SHEET_ID:', process.env.PRIMARY_SHEET_ID ? '설정됨' : '미설정')
    console.log('PRIMARY_CLIENT_EMAIL:', process.env.PRIMARY_CLIENT_EMAIL ? '설정됨' : '미설정')
    console.log('PRIMARY_PRIVATE_KEY:', process.env.PRIMARY_PRIVATE_KEY ? '(값 있음)' : '미설정')
    
    // 현재 날짜와 시간 가져오기
    const now = new Date()
    const timestamp = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    
    // 신청 데이터 준비
    const rowData = [
      timestamp,           // 신청일시
      data.name,           // 이름
      data.phone,          // 연락처
      data.place,          // 설치장소
      data.address,        // 주소
      data.cameraCount,    // 설치대수
      data.privacy ? '동의' : '미동의'  // 개인정보동의
    ]
    
    try {
      // 스프레드시트 저장 시도
      // 환경 변수가 제대로 설정되었는지 확인
      if (!process.env.PRIMARY_SHEET_ID || !process.env.PRIMARY_CLIENT_EMAIL || !process.env.PRIMARY_PRIVATE_KEY) {
        console.error('환경 변수가 설정되지 않았습니다.')
        // 개발 환경에서는 계속 진행 (테스트 목적)
        if (process.env.NODE_ENV === 'development') {
          console.log('개발 환경: 환경 변수가 없어도 성공 처리합니다.')
          return { 
            success: true,
            message: "개발 환경: 상담 신청이 완료된 것으로 처리됩니다."
          }
        } else {
          throw new Error('환경 변수가 설정되지 않았습니다.')
        }
      }
      
      // 주 스프레드시트에 저장
      const primaryResult = await saveToPrimarySheet(rowData)
      console.log('Primary 시트 저장 결과:', primaryResult)
      
      // 보조 스프레드시트에 저장
      const secondaryResult = await saveToSecondarySheet(rowData)
      console.log('Secondary 시트 저장 결과:', secondaryResult)
      
      // 세 번째 스프레드시트에 저장
      const tertiaryResult = await saveToTertiarySheet(rowData)
      console.log('Tertiary 시트 저장 결과:', tertiaryResult)
      
      // 성공적으로 처리됨
      return { 
        success: true,
        message: "상담 신청이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다."
      }
    } catch (saveError) {
      console.error('시트 저장 중 오류:', saveError)
      
      // 개발 환경에서는 항상 성공 응답 (테스트 목적)
      if (process.env.NODE_ENV === 'development') {
        console.log('개발 환경에서는 저장 오류를 무시하고 성공 응답합니다')
        return { 
          success: true,
          message: "개발 환경: 상담 신청이 완료된 것으로 처리됩니다."
        }
      }
      
      throw saveError
    }
  } catch (error) {
    console.error("Error submitting consultation:", error)
    return {
      success: false,
      error: "상담 신청 중 오류가 발생했습니다. 다시 시도해주세요."
    }
  }
}

// 주 스프레드시트에 데이터 저장
async function saveToPrimarySheet(rowData: any[]) {
  try {
    // JWT 클라이언트 생성
    const jwt = await getPrimaryJWTClient()
    
    // 스프레드시트 연결
    const doc = new GoogleSpreadsheet(PRIMARY_SHEET_ID, jwt)
    
    // 시트 가져오기 또는 생성
    const sheet = await getOrCreateSheet(doc, PRIMARY_SHEET_NAME)
    
    // 시트 초기화
    await initializeSheet(sheet)
    
    // 데이터 저장
    await addNewRow(sheet, rowData)
    
    return true
  } catch (error) {
    console.error("Error saving to primary sheet:", error)
    return false
  }
}

// 보조 스프레드시트에 데이터 저장
async function saveToSecondarySheet(rowData: any[]) {
  try {
    // JWT 클라이언트 생성
    const jwt = await getSecondaryJWTClient()
    if (!jwt) {
      console.log('Could not initialize secondary JWT client')
      return false
    }
    
    // 스프레드시트 연결
    const doc = new GoogleSpreadsheet(SECONDARY_SHEET_ID, jwt)
    
    // 시트 가져오기 또는 생성
    const sheet = await getOrCreateSheet(doc, SECONDARY_SHEET_NAME)
    
    // 시트 초기화
    await initializeSheet(sheet)
    
    // 데이터 저장
    await addNewRow(sheet, rowData)
    
    return true
  } catch (error) {
    console.error("Error saving to secondary sheet:", error)
    return false
  }
}

// 세 번째 스프레드시트에 데이터 저장
async function saveToTertiarySheet(rowData: any[]) {
  try {
    // JWT 클라이언트 생성
    const jwt = await getTertiaryJWTClient()
    if (!jwt) {
      console.log('Could not initialize tertiary JWT client')
      return false
    }
    
    // 스프레드시트 연결
    const doc = new GoogleSpreadsheet(TERTIARY_SHEET_ID, jwt)
    
    // 시트 가져오기 또는 생성
    const sheet = await getOrCreateSheet(doc, TERTIARY_SHEET_NAME)
    
    // 시트 초기화
    await initializeSheet(sheet)
    
    // 데이터 저장
    await addNewRow(sheet, rowData)
    
    return true
  } catch (error) {
    console.error("Error saving to tertiary sheet:", error)
    return false
  }
}
