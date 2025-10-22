"use client"

import { useEffect, useRef } from "react"
import { collectPageViewData, saveCurrentPageAsPrevious } from "@/lib/tracking"
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

    // 최초 방문 시 referrer를 즉시 localStorage에 저장 (보존)
    if (typeof window !== 'undefined' && document.referrer) {
      const INITIAL_REFERRER_KEY = 'initial_referrer'
      const existingReferrer = localStorage.getItem(INITIAL_REFERRER_KEY)

      if (!existingReferrer) {
        localStorage.setItem(INITIAL_REFERRER_KEY, document.referrer)
        console.log('💾 Initial referrer saved:', document.referrer)
      }
    }

    // 페이지뷰 데이터 수집 및 전송
    const trackView = async () => {
      try {
        const data = collectPageViewData()
        console.log('📊 페이지뷰 데이터 수집:', data)

        const result = await trackPageView(data)

        if (result.success) {
          console.log('✅ 페이지뷰 추적 성공')

          // 추적 성공 후 현재 페이지를 이전 페이지로 저장
          // 다음 페이지 이동 시 사용됨
          saveCurrentPageAsPrevious()
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
