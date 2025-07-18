import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface CCTVLegacyData {
  id?: number
  name: string
  phone: string
  contact_time?: string
  installation_location?: string
  address?: string
  installation_date?: string
  installation_time?: string
  camera_count?: string
  memo?: string
  privacy_consent?: boolean
  created_at?: string
  updated_at?: string
}

export type CCTVLegacyInsert = Omit<CCTVLegacyData, 'id' | 'created_at' | 'updated_at'> 