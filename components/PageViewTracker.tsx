"use client"

import { useEffect, useRef } from "react"
import { collectPageViewData } from "@/lib/tracking"
import { trackPageView } from "@/app/actions/submit"

/**
 * 페이지 방문 즉시 모든 데이터를 수집하여 Google Sheets에 저장하는 컴포넌트
 * - 페이지 로드 시 1회만 실행
 * - UTM 파라미터, 디바이스 정보, 브라우저 정보 등 수집
 */
export default function PageViewTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    // 중복 실행 방지 (React Strict Mode 대응)
    if (hasTracked.current) return
    hasTracked.current = true

    // 페이지뷰 데이터 수집 및 전송
    const trackView = async () => {
      try {
        const data = collectPageViewData()
        console.log('📊 페이지뷰 데이터 수집:', data)

        const result = await trackPageView(data)

        if (result.success) {
          console.log('✅ 페이지뷰 추적 성공')
        } else {
          console.warn('⚠️ 페이지뷰 추적 실패 (silent fail)')
        }
      } catch (error) {
        // 페이지뷰 추적 실패는 사용자 경험에 영향 없음
        console.error('❌ 페이지뷰 추적 오류:', error)
      }
    }

    // 약간의 딜레이 후 실행 (페이지 렌더링 우선)
    const timer = setTimeout(trackView, 100)

    return () => clearTimeout(timer)
  }, [])

  // UI를 렌더링하지 않음 (추적만 수행)
  return null
}
