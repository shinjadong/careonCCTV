"use server"

import { supabase } from "@/lib/supabase"
import type { EstimateInsert } from "@/lib/supabase"

// 견적 신청 제출 함수 (완전 통일된 버전)
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
}) {
  try {
    // 디버깅 로그
    console.log('견적 신청 데이터 수신:', data)
    
    // 카메라 수량 파싱 (숫자만 추출)
    const parseCameraCount = (count: string): number => {
      if (count === "미정" || count === "5대 이상") return 0
      const match = count.match(/\d+/)
      return match ? parseInt(match[0]) : 0
    }
    
    // Supabase estimate 테이블에 저장할 데이터 준비 (완전 통일된 매핑)
    const insertData: EstimateInsert = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      place_type: data.place,
      total_camera_count: parseCameraCount(data.cameraCount),
      preferred_contact_time: data.contactTime,
      preferred_installation_date: data.installationDate || undefined,
      preferred_installation_time: data.installationTime || undefined,
      additional_notes: data.memo || undefined,
      privacy_consent: data.privacy,
      // 기본값들
      business_type: undefined,
      estimated_price: undefined,
      status: 'pending',
      source: 'landing_page'
    }
    
    // Supabase에 데이터 저장
    const { data: insertedData, error } = await supabase
      .from('estimate')
      .insert(insertData)
      .select()
    
    if (error) {
      console.error('Supabase 저장 오류:', error)
      throw error
    }
    
    console.log('Supabase 저장 성공:', insertedData)
    
    // 성공적으로 처리됨
    return { 
      success: true,
      message: "견적 신청이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다."
    }
    
  } catch (error) {
    console.error("Error submitting estimate:", error)
    return {
      success: false,
      error: "견적 신청 중 오류가 발생했습니다. 다시 시도해주세요."
    }
  }
}
