import { google } from 'googleapis'
import { PageViewData } from './tracking'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export async function appendToGoogleSheet(data: {
  name: string
  phone: string
  contactTime: string
  place: string
  address: string
  installationDate?: string
  installationTime?: string
  cameraCount: string
  memo?: string
  privacy: boolean
  referrer?: string
}) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'A:L'  // K 컬럼에서 L 컬럼으로 확장

  const values = [[
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.name,
    data.phone,
    data.contactTime,
    data.place,
    data.address,
    data.installationDate || '',
    data.installationTime || '',
    data.cameraCount,
    data.memo || '',
    data.privacy ? 'Y' : 'N',
    data.referrer || '직접 접속'  // 새로운 referrer 컬럼 추가
  ]]

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    })

    return { success: true, response }
  } catch (error) {
    console.error('Error appending to Google Sheet:', error)
    throw error
  }
}

// 페이지뷰 데이터를 Google Sheets에 추가
export async function appendPageViewToGoogleSheet(data: PageViewData) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  // 환경변수로 지정 가능, 기본값은 '페이지뷰!A:O' (별도 시트)
  // 같은 시트에 저장하려면 'A:O' 형식으로 지정
  const range = process.env.GOOGLE_SHEET_PAGEVIEW_RANGE || '페이지뷰!A:O'

  const values = [[
    data.timestamp,
    data.current_url,
    data.referrer,
    data.landing_page,
    data.utm_source,
    data.utm_medium,
    data.utm_campaign,
    data.utm_term,
    data.utm_content,
    data.device_type,
    data.screen_size,
    data.viewport_size,
    data.browser_language,
    data.is_touch_device ? 'Y' : 'N',
    data.session_id
  ]]

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    })

    return { success: true, response }
  } catch (error) {
    console.error('Error appending page view to Google Sheet:', error)
    throw error
  }
}