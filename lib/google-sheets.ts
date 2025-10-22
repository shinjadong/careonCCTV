import { google } from 'googleapis'

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