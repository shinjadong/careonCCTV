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