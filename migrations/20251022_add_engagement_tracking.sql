-- 사용자 참여도 추적을 위한 컬럼 추가
-- 2025-10-22: 체류시간, 스크롤 깊이, 클릭 등 추가

-- kt_cctv_pageviews 테이블에 컬럼 추가
ALTER TABLE kt_cctv_pageviews
ADD COLUMN IF NOT EXISTS time_on_page INTEGER, -- 체류 시간 (초)
ADD COLUMN IF NOT EXISTS max_scroll_depth INTEGER, -- 최대 스크롤 깊이 (%)
ADD COLUMN IF NOT EXISTS scroll_25 BOOLEAN DEFAULT false, -- 25% 도달
ADD COLUMN IF NOT EXISTS scroll_50 BOOLEAN DEFAULT false, -- 50% 도달
ADD COLUMN IF NOT EXISTS scroll_75 BOOLEAN DEFAULT false, -- 75% 도달
ADD COLUMN IF NOT EXISTS scroll_100 BOOLEAN DEFAULT false, -- 100% 도달
ADD COLUMN IF NOT EXISTS clicks_count INTEGER DEFAULT 0, -- 클릭 횟수
ADD COLUMN IF NOT EXISTS form_interactions INTEGER DEFAULT 0, -- 폼 인터랙션 횟수
ADD COLUMN IF NOT EXISTS connection_type TEXT, -- 네트워크 연결 타입 (4g, wifi 등)
ADD COLUMN IF NOT EXISTS connection_speed TEXT, -- 네트워크 속도 (slow-2g, 2g, 3g, 4g)
ADD COLUMN IF NOT EXISTS battery_level INTEGER, -- 배터리 잔량 (%)
ADD COLUMN IF NOT EXISTS is_charging BOOLEAN, -- 충전 중 여부
ADD COLUMN IF NOT EXISTS page_visibility_changes INTEGER DEFAULT 0, -- 페이지 가시성 변경 횟수
ADD COLUMN IF NOT EXISTS was_active BOOLEAN DEFAULT true, -- 활성 상태였는지
ADD COLUMN IF NOT EXISTS exit_intent BOOLEAN DEFAULT false; -- 이탈 의도 감지

-- 인덱스 추가 (분석 성능 향상)
CREATE INDEX IF NOT EXISTS idx_pageviews_time_on_page ON kt_cctv_pageviews(time_on_page);
CREATE INDEX IF NOT EXISTS idx_pageviews_scroll_depth ON kt_cctv_pageviews(max_scroll_depth);
CREATE INDEX IF NOT EXISTS idx_pageviews_was_active ON kt_cctv_pageviews(was_active);

-- 컬럼 설명 추가
COMMENT ON COLUMN kt_cctv_pageviews.time_on_page IS '페이지 체류 시간 (초)';
COMMENT ON COLUMN kt_cctv_pageviews.max_scroll_depth IS '최대 스크롤 깊이 (0-100%)';
COMMENT ON COLUMN kt_cctv_pageviews.scroll_25 IS '25% 스크롤 도달 여부';
COMMENT ON COLUMN kt_cctv_pageviews.scroll_50 IS '50% 스크롤 도달 여부';
COMMENT ON COLUMN kt_cctv_pageviews.scroll_75 IS '75% 스크롤 도달 여부';
COMMENT ON COLUMN kt_cctv_pageviews.scroll_100 IS '100% 스크롤 도달 여부';
COMMENT ON COLUMN kt_cctv_pageviews.clicks_count IS '페이지 내 클릭 횟수';
COMMENT ON COLUMN kt_cctv_pageviews.form_interactions IS '폼 필드 인터랙션 횟수';
COMMENT ON COLUMN kt_cctv_pageviews.connection_type IS '네트워크 연결 타입 (4g, wifi, ethernet 등)';
COMMENT ON COLUMN kt_cctv_pageviews.connection_speed IS '네트워크 속도 (slow-2g, 2g, 3g, 4g)';
COMMENT ON COLUMN kt_cctv_pageviews.battery_level IS '배터리 잔량 (0-100%)';
COMMENT ON COLUMN kt_cctv_pageviews.is_charging IS '충전 중 여부';
COMMENT ON COLUMN kt_cctv_pageviews.page_visibility_changes IS '페이지 가시성 변경 횟수 (탭 전환 등)';
COMMENT ON COLUMN kt_cctv_pageviews.was_active IS '페이지에서 활성 상태였는지 (비활성 이탈 구분)';
COMMENT ON COLUMN kt_cctv_pageviews.exit_intent IS '이탈 의도 감지 (마우스가 브라우저 상단으로 이동)';

-- 참여도 분석 뷰 생성
CREATE OR REPLACE VIEW kt_cctv_engagement_metrics AS
SELECT
  device_type,

  -- 평균 체류 시간
  AVG(time_on_page) FILTER (WHERE time_on_page > 0) as avg_time_on_page,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY time_on_page) FILTER (WHERE time_on_page > 0) as median_time_on_page,

  -- 스크롤 깊이 분석
  AVG(max_scroll_depth) as avg_scroll_depth,
  COUNT(*) FILTER (WHERE scroll_25 = true) * 100.0 / COUNT(*) as scroll_25_rate,
  COUNT(*) FILTER (WHERE scroll_50 = true) * 100.0 / COUNT(*) as scroll_50_rate,
  COUNT(*) FILTER (WHERE scroll_75 = true) * 100.0 / COUNT(*) as scroll_75_rate,
  COUNT(*) FILTER (WHERE scroll_100 = true) * 100.0 / COUNT(*) as scroll_100_rate,

  -- 참여도 지표
  AVG(clicks_count) as avg_clicks,
  AVG(form_interactions) as avg_form_interactions,
  COUNT(*) FILTER (WHERE was_active = true) * 100.0 / COUNT(*) as active_rate,
  COUNT(*) FILTER (WHERE exit_intent = true) * 100.0 / COUNT(*) as exit_intent_rate,

  -- 전체 세션 수
  COUNT(*) as total_sessions
FROM kt_cctv_pageviews
GROUP BY device_type;

COMMENT ON VIEW kt_cctv_engagement_metrics IS '디바이스별 사용자 참여도 지표';

-- 전환율 분석 뷰 (페이지뷰 + 견적 신청)
CREATE OR REPLACE VIEW kt_cctv_conversion_funnel AS
SELECT
  pv.utm_source,
  pv.utm_campaign,
  pv.device_type,

  -- 방문자 수
  COUNT(DISTINCT pv.session_id) as visitors,

  -- 참여도 지표
  AVG(pv.time_on_page) FILTER (WHERE pv.time_on_page > 0) as avg_time_on_page,
  AVG(pv.max_scroll_depth) as avg_scroll_depth,
  COUNT(*) FILTER (WHERE pv.scroll_50 = true) * 100.0 / COUNT(*) as engaged_rate,

  -- 전환 지표
  COUNT(DISTINCT c.session_id) as conversions,
  COUNT(DISTINCT c.session_id) * 100.0 / NULLIF(COUNT(DISTINCT pv.session_id), 0) as conversion_rate,

  -- 전환까지 평균 시간 (분)
  AVG(EXTRACT(EPOCH FROM (c.created_at - pv.timestamp))/60) FILTER (WHERE c.id IS NOT NULL) as avg_time_to_conversion
FROM kt_cctv_pageviews pv
LEFT JOIN kt_cctv_consultations c ON pv.session_id = c.session_id
GROUP BY pv.utm_source, pv.utm_campaign, pv.device_type
HAVING COUNT(DISTINCT pv.session_id) > 0
ORDER BY conversion_rate DESC NULLS LAST;

COMMENT ON VIEW kt_cctv_conversion_funnel IS 'UTM 소스/캠페인/디바이스별 전환 퍼널 분석';
