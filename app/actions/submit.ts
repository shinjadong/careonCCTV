"use server"

import { appendToGoogleSheet, appendPageViewToGoogleSheet } from "@/lib/google-sheets"
import { insertPageView, insertKTCCTVConsultation } from "@/lib/supabase"
import { PageViewData } from "@/lib/tracking"
import { getUTMParams } from "@/lib/tracking"

// 견적 신청 제출 함수 (구글 시트 + Supabase)
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
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  session_id?: string
}) {
  try {
    // 디버깅 로그
    console.log('견적 신청 데이터 수신:', data)

    // UTM 파라미터 추출 (서버에서는 불가하므로 클라이언트에서 전달받아야 함)
    // 여기서는 data에 이미 포함되어 있다고 가정

    // 1. 구글 시트에 데이터 추가
    const googleSheetPromise = appendToGoogleSheet({
      ...data,
      referrer: data.referrer || '직접 접속'
    })

    // 2. Supabase에 데이터 추가
    const supabasePromise = insertKTCCTVConsultation({
      name: data.name,
      phone: data.phone,
      address: data.address,
      place: data.place,
      camera_count: data.cameraCount,
      contact_time: data.contactTime,
      installation_date: data.installationDate,
      installation_time: data.installationTime,
      memo: data.memo,
      privacy_consent: data.privacy,
      referrer: data.referrer || '직접 접속',
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      session_id: data.session_id,
      status: 'pending'
    })

    // 병렬로 두 작업 실행
    await Promise.all([googleSheetPromise, supabasePromise])

    console.log('구글 시트 및 Supabase 저장 성공')

    // SMS 발송 (비동기, 실패해도 견적 신청은 성공)
    try {
      const smsServerUrl = process.env.SMS_SERVER_URL || 'http://13.125.251.6:8000'

      const smsResponse = await fetch(`${smsServerUrl}/send-consultation-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          address: data.address,
          camera_count: data.cameraCount,
          place: data.place,
          referrer: data.referrer || '직접 접속',
          utm_source: data.utm_source,
          utm_campaign: data.utm_campaign
        })
      })

      if (smsResponse.ok) {
        const smsResult = await smsResponse.json()
        console.log('✅ 직원 알림 SMS 발송 성공:', smsResult)
      } else {
        console.warn('⚠️ 직원 알림 SMS 발송 실패 (silent fail)')
      }
    } catch (smsError) {
      // SMS 발송 실패는 견적 신청을 막지 않음
      console.error('SMS 발송 오류 (silent fail):', smsError)
    }

    // 성공적으로 처리됨
    return {
      success: true,
      message: "견적 신청이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다."
    }

  } catch (error) {
    console.error("Error submitting consultation:", error)
    return {
      success: false,
      error: "견적 신청 중 오류가 발생했습니다. 다시 시도해주세요."
    }
  }
}

// 페이지 방문 추적 함수 (구글 시트 + Supabase)
export async function trackPageView(data: PageViewData) {
  try {
    console.log('페이지뷰 데이터 수신:', data)

    // 1. 구글 시트에 페이지뷰 데이터 추가
    const googleSheetPromise = appendPageViewToGoogleSheet(data)

    // 2. Supabase에 페이지뷰 데이터 추가
    const supabasePromise = insertPageView({
      timestamp: data.timestamp,
      current_url: data.current_url,
      referrer: data.referrer,
      landing_page: data.landing_page,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_term: data.utm_term,
      utm_content: data.utm_content,
      device_type: data.device_type,
      screen_size: data.screen_size,
      viewport_size: data.viewport_size,
      browser_language: data.browser_language,
      user_agent: data.user_agent,
      is_touch_device: data.is_touch_device,
      session_id: data.session_id
    })

    // 병렬로 두 작업 실행
    await Promise.all([googleSheetPromise, supabasePromise])

    console.log('페이지뷰 데이터 저장 성공 (구글 시트 + Supabase)')

    return {
      success: true
    }
  } catch (error) {
    console.error("Error tracking page view:", error)
    // 페이지뷰 추적 실패는 사용자 경험에 영향 없음 (silent fail)
    return {
      success: false
    }
  }
}
