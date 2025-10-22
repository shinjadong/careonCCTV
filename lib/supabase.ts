import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 상담 신청 테이블 타입 정의
export interface ConsultationData {
  id?: string
  name: string
  phone: string
  consultation_type: string
  preferred_date?: string
  preferred_time?: string
  message?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export type ConsultationInsert = Omit<ConsultationData, 'id' | 'created_at' | 'updated_at'>

// 견적 신청 테이블 타입 정의 (최종 estimate 테이블 스키마와 100% 일치)
export interface EstimateData {
  id?: string
  name: string
  phone: string
  address: string
  place_type?: string
  business_type?: string
  total_camera_count?: number
  estimated_price?: number
  preferred_contact_time: string
  preferred_installation_date?: string  // 새로 추가된 컬럼
  preferred_installation_time?: string  // 새로 추가된 컬럼
  additional_notes?: string             // 새로 추가된 컬럼
  privacy_consent?: boolean             // 새로 추가된 컬럼
  status?: string
  source?: string
  created_at?: string
  updated_at?: string
}

export type EstimateInsert = Omit<EstimateData, 'id' | 'created_at' | 'updated_at'>

// KT CCTV 페이지뷰 테이블 타입 정의
export interface PageViewRecord {
  id?: string
  timestamp?: string
  current_url: string
  referrer?: string
  landing_page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  device_type?: string
  screen_size?: string
  viewport_size?: string
  browser_language?: string
  user_agent?: string
  is_touch_device?: boolean
  session_id?: string
  created_at?: string
}

export type PageViewInsert = Omit<PageViewRecord, 'id' | 'created_at'>

// KT CCTV 견적 신청 테이블 타입 정의 (새로운 테이블용)
export interface KTCCTVConsultation {
  id?: string
  name: string
  phone: string
  address: string
  place: string
  camera_count: string
  contact_time?: string
  installation_date?: string
  installation_time?: string
  memo?: string
  privacy_consent?: boolean
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  session_id?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export type KTCCTVConsultationInsert = Omit<KTCCTVConsultation, 'id' | 'created_at' | 'updated_at'>

// Supabase에 페이지뷰 데이터 저장
export async function insertPageView(data: PageViewInsert) {
  const { data: result, error } = await supabase
    .from('kt_cctv_pageviews')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Supabase 페이지뷰 저장 오류:', error)
    throw error
  }

  return result
}

// Supabase에 견적 신청 데이터 저장
export async function insertKTCCTVConsultation(data: KTCCTVConsultationInsert) {
  const { data: result, error } = await supabase
    .from('kt_cctv_consultations')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Supabase 견적 신청 저장 오류:', error)
    throw error
  }

  return result
} 