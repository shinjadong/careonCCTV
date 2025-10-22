"use server"

import { appendToGoogleSheet } from "@/lib/google-sheets"

// 견적 신청 제출 함수 (구글 시트 버전)
export async function submitConsultation(data: {
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
  try {
    // 디버깅 로그
    console.log('견적 신청 데이터 수신:', data)

    // 구글 시트에 데이터 추가 (referrer 포함)
    await appendToGoogleSheet({
      ...data,
      referrer: data.referrer || '직접 접속'
    })

    console.log('구글 시트 저장 성공')

    // 성공적으로 처리됨
    return {
      success: true,
      message: "견적 신청이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다."
    }

  } catch (error) {
    console.error("Error submitting to Google Sheet:", error)
    return {
      success: false,
      error: "견적 신청 중 오류가 발생했습니다. 다시 시도해주세요."
    }
  }
}
