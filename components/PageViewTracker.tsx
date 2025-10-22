"use client"

import { useEffect, useRef } from "react"
import { collectPageViewData, saveCurrentPageAsPrevious, EngagementTracker, getBatteryInfo } from "@/lib/tracking"
import { trackPageView } from "@/app/actions/submit"

/**
 * 페이지 방문 즉시 모든 데이터를 수집하여 Google Sheets + Supabase에 저장
 * 추가 기능:
 * - 체류 시간 측정
 * - 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
 * - 클릭 및 폼 인터랙션 추적
 * - 페이지 이탈 시 최종 데이터 업데이트
 */
export default function PageViewTracker() {
  const hasTracked = useRef(false)
  const engagementTracker = useRef<EngagementTracker | null>(null)
  const pageViewId = useRef<string>('')

  useEffect(() => {
    // 중복 실행 방지 (React Strict Mode 대응)
    if (hasTracked.current) return
    hasTracked.current = true

    // 최초 방문 시 referrer를 즉시 localStorage에 저장 (보존)
    if (typeof window !== 'undefined' && document.referrer) {
      const INITIAL_REFERRER_KEY = 'initial_referrer'
      const existingReferrer = localStorage.getItem(INITIAL_REFERRER_KEY)

      if (!existingReferrer) {
        localStorage.setItem(INITIAL_REFERRER_KEY, document.referrer)
        console.log('💾 Initial referrer saved:', document.referrer)
      }
    }

    // 참여도 추적 시작
    engagementTracker.current = new EngagementTracker()

    // 초기 페이지뷰 데이터 수집 및 전송
    const trackInitialView = async () => {
      try {
        const data = collectPageViewData()

        // 배터리 정보 비동기 수집
        const batteryInfo = await getBatteryInfo()
        data.battery_level = batteryInfo.batteryLevel
        data.is_charging = batteryInfo.isCharging

        console.log('📊 페이지뷰 데이터 수집:', data)

        const result = await trackPageView(data)

        if (result.success) {
          console.log('✅ 페이지뷰 추적 성공')

          // 추적 성공 후 현재 페이지를 이전 페이지로 저장
          saveCurrentPageAsPrevious()

          // TODO: 서버에서 반환된 페이지뷰 ID 저장 (업데이트용)
          // pageViewId.current = result.id
        } else {
          console.warn('⚠️ 페이지뷰 추적 실패 (silent fail)')
        }
      } catch (error) {
        console.error('❌ 페이지뷰 추적 오류:', error)
      }
    }

    // 페이지뷰 업데이트 함수 (참여도 데이터 포함)
    const updatePageView = async () => {
      if (!engagementTracker.current) return

      try {
        const engagementData = engagementTracker.current.getEngagementData()
        const data = {
          ...collectPageViewData(),
          ...engagementData
        }

        // 배터리 정보 재수집
        const batteryInfo = await getBatteryInfo()
        data.battery_level = batteryInfo.batteryLevel
        data.is_charging = batteryInfo.isCharging

        console.log('🔄 페이지뷰 업데이트:', {
          time_on_page: engagementData.time_on_page,
          max_scroll_depth: engagementData.max_scroll_depth,
          clicks: engagementData.clicks_count
        })

        // 서버로 업데이트 전송 (새로운 레코드로 저장 또는 기존 레코드 업데이트)
        await trackPageView(data)
      } catch (error) {
        console.error('❌ 페이지뷰 업데이트 오류:', error)
      }
    }

    // 주기적 업데이트 (30초마다)
    const updateInterval = setInterval(updatePageView, 30000)

    // 페이지 이탈 시 최종 업데이트
    const handleBeforeUnload = () => {
      updatePageView()
    }

    // 페이지 숨김 시 최종 업데이트 (모바일 브라우저 대응)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePageView()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 약간의 딜레이 후 초기 추적 실행 (페이지 렌더링 우선)
    const timer = setTimeout(trackInitialView, 100)

    // Cleanup
    return () => {
      clearTimeout(timer)
      clearInterval(updateInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      engagementTracker.current?.cleanup()
    }
  }, [])

  // UI를 렌더링하지 않음 (추적만 수행)
  return null
}
