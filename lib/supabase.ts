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

// 견적 신청 테이블 타입 정의 (업데이트된 컬럼 구조)
export interface EstimateData {
  id?: string
  name: string
  phone: string
  address?: string
  place_type?: string
  business_type?: string
  total_camera_count?: number
  estimated_price?: number
  preferred_contact_time?: string
  preferred_installation_date?: string
  preferred_installation_time?: string
  additional_notes?: string
  privacy_consent?: boolean
  status?: string
  source?: string
  created_at?: string
  updated_at?: string
}

export type EstimateInsert = Omit<EstimateData, 'id' | 'created_at' | 'updated_at'> 