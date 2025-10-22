-- KT CCTV 데이터 저장을 위한 테이블 생성
-- 2025-10-22: 페이지뷰 추적 및 견적 신청 데이터 저장

-- ============================================================
-- 1. 페이지뷰 추적 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS kt_cctv_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 시간 정보
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- URL 정보
  current_url TEXT NOT NULL,
  referrer TEXT,
  landing_page TEXT,

  -- UTM 파라미터 (마케팅 추적)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- 디바이스 정보
  device_type TEXT, -- Mobile, Desktop, Tablet
  screen_size TEXT, -- 예: 1920x1080
  viewport_size TEXT, -- 예: 1920x937

  -- 브라우저 정보
  browser_language TEXT,
  user_agent TEXT,

  -- 기타
  is_touch_device BOOLEAN DEFAULT false,
  session_id TEXT,

  -- 메타 정보
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON kt_cctv_pageviews(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON kt_cctv_pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_source ON kt_cctv_pageviews(utm_source);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_campaign ON kt_cctv_pageviews(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_pageviews_device_type ON kt_cctv_pageviews(device_type);

-- RLS 정책 활성화
ALTER TABLE kt_cctv_pageviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자 삽입 허용
CREATE POLICY "Enable insert for all users" ON kt_cctv_pageviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RLS 정책: 인증된 사용자 조회 허용
CREATE POLICY "Enable select for authenticated users" ON kt_cctv_pageviews
FOR SELECT
TO authenticated
USING (true);

-- 테이블 설명 추가
COMMENT ON TABLE kt_cctv_pageviews IS '페이지 방문 추적 데이터 (마케팅 분석용)';
COMMENT ON COLUMN kt_cctv_pageviews.utm_source IS '트래픽 소스 (예: google, naver, facebook)';
COMMENT ON COLUMN kt_cctv_pageviews.utm_medium IS '매체 (예: cpc, social, email)';
COMMENT ON COLUMN kt_cctv_pageviews.utm_campaign IS '캠페인명';
COMMENT ON COLUMN kt_cctv_pageviews.device_type IS '디바이스 타입 (Mobile, Desktop, Tablet)';
COMMENT ON COLUMN kt_cctv_pageviews.session_id IS '세션 ID (30분 유지)';


-- ============================================================
-- 2. 견적 신청 데이터 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS kt_cctv_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 고객 정보
  name TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- 설치 정보
  address TEXT NOT NULL, -- 설치 지역
  place TEXT NOT NULL, -- 설치 장소 (가정집, 상가, 학원, 공장, 기타)
  camera_count TEXT NOT NULL, -- CCTV 대수

  -- 상담 정보
  contact_time TEXT, -- 연락 가능 시간
  installation_date TEXT, -- 설치 희망 날짜
  installation_time TEXT, -- 설치 희망 시간
  memo TEXT, -- 추가 메모

  -- 개인정보 동의
  privacy_consent BOOLEAN DEFAULT false,

  -- 추적 정보 (마케팅 분석)
  referrer TEXT, -- 이전 페이지 URL
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  session_id TEXT, -- 페이지뷰와 연결

  -- 상태 관리
  status TEXT DEFAULT 'pending', -- pending, contacted, completed, cancelled

  -- 메타 정보
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON kt_cctv_consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON kt_cctv_consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_phone ON kt_cctv_consultations(phone);
CREATE INDEX IF NOT EXISTS idx_consultations_session_id ON kt_cctv_consultations(session_id);

-- RLS 정책 활성화
ALTER TABLE kt_cctv_consultations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자 삽입 허용 (견적 신청)
CREATE POLICY "Enable insert for all users" ON kt_cctv_consultations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RLS 정책: 인증된 사용자 조회 허용
CREATE POLICY "Enable select for authenticated users" ON kt_cctv_consultations
FOR SELECT
TO authenticated
USING (true);

-- RLS 정책: 인증된 사용자 수정 허용 (상태 변경용)
CREATE POLICY "Enable update for authenticated users" ON kt_cctv_consultations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 테이블 설명 추가
COMMENT ON TABLE kt_cctv_consultations IS 'CCTV 설치 견적 신청 데이터';
COMMENT ON COLUMN kt_cctv_consultations.place IS '설치 장소: 가정집, 상가, 학원, 공장, 기타';
COMMENT ON COLUMN kt_cctv_consultations.status IS '상태: pending, contacted, completed, cancelled';
COMMENT ON COLUMN kt_cctv_consultations.session_id IS '페이지뷰 세션 ID (분석 연결용)';


-- ============================================================
-- 3. 트리거: updated_at 자동 갱신
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kt_cctv_consultations_updated_at
BEFORE UPDATE ON kt_cctv_consultations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 4. 뷰: 마케팅 분석용 통합 뷰 (선택사항)
-- ============================================================
CREATE OR REPLACE VIEW kt_cctv_marketing_analysis AS
SELECT
  c.id AS consultation_id,
  c.name,
  c.phone,
  c.address,
  c.place,
  c.camera_count,
  c.status,
  c.created_at AS consultation_date,

  -- 페이지뷰 데이터 (최초 방문)
  pv.timestamp AS first_visit,
  pv.referrer,
  pv.landing_page,
  pv.utm_source,
  pv.utm_medium,
  pv.utm_campaign,
  pv.device_type,
  pv.screen_size,

  -- 분석 지표
  EXTRACT(EPOCH FROM (c.created_at - pv.timestamp))/60 AS time_to_conversion_minutes
FROM
  kt_cctv_consultations c
LEFT JOIN
  kt_cctv_pageviews pv ON c.session_id = pv.session_id
WHERE
  pv.timestamp = (
    SELECT MIN(timestamp)
    FROM kt_cctv_pageviews
    WHERE session_id = c.session_id
  );

COMMENT ON VIEW kt_cctv_marketing_analysis IS '견적 신청과 페이지뷰를 연결한 마케팅 분석 뷰';
