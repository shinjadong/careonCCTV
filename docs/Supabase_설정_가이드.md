# Supabase 데이터베이스 설정 가이드

## 개요
Google Sheets와 함께 Supabase 데이터베이스에도 데이터를 저장하여 더 강력한 데이터 분석과 관리를 제공합니다.

## 1. Supabase 프로젝트 설정

### 1단계: Supabase 프로젝트 접속
1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 기존 프로젝트 선택 또는 새 프로젝트 생성

### 2단계: SQL 에디터에서 마이그레이션 실행
1. 좌측 메뉴에서 **SQL Editor** 선택
2. **New Query** 클릭
3. `migrations/20251022_create_kt_cctv_tables.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 3단계: 테이블 생성 확인
1. 좌측 메뉴에서 **Table Editor** 선택
2. 다음 테이블들이 생성되었는지 확인:
   - `kt_cctv_pageviews` - 페이지 방문 추적
   - `kt_cctv_consultations` - 견적 신청 데이터

---

## 2. 생성된 테이블 구조

### A. kt_cctv_pageviews (페이지 방문 추적)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | UUID | 고유 ID | auto-generated |
| timestamp | TIMESTAMPTZ | 접속 시간 | 2025-10-22 22:30:15+09 |
| current_url | TEXT | 현재 페이지 URL | https://example.com/?utm_source=google |
| referrer | TEXT | 이전 페이지 URL | https://google.com/search |
| landing_page | TEXT | 최초 방문 페이지 | https://example.com/ |
| utm_source | TEXT | 트래픽 소스 | google, naver, facebook |
| utm_medium | TEXT | 매체 | cpc, social, email |
| utm_campaign | TEXT | 캠페인명 | cctv_summer_sale |
| utm_term | TEXT | 검색 키워드 | cctv 설치 |
| utm_content | TEXT | 광고 콘텐츠 | banner_a |
| device_type | TEXT | 디바이스 | Mobile, Desktop, Tablet |
| screen_size | TEXT | 화면 크기 | 1920x1080 |
| viewport_size | TEXT | 뷰포트 크기 | 1920x937 |
| browser_language | TEXT | 브라우저 언어 | ko-KR |
| user_agent | TEXT | User Agent 문자열 | Mozilla/5.0... |
| is_touch_device | BOOLEAN | 터치 디바이스 여부 | true, false |
| session_id | TEXT | 세션 ID | session_1730304015123_abc |
| created_at | TIMESTAMPTZ | 레코드 생성 시간 | auto-generated |

**인덱스:**
- timestamp (DESC) - 시간순 조회 최적화
- session_id - 세션별 조회 최적화
- utm_source - 트래픽 소스별 분석
- utm_campaign - 캠페인별 분석
- device_type - 디바이스별 분석

---

### B. kt_cctv_consultations (견적 신청)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | UUID | 고유 ID | auto-generated |
| name | TEXT | 이름 | 홍길동 |
| phone | TEXT | 전화번호 | 010-1234-5678 |
| address | TEXT | 설치 지역 | 서울특별시 강남구 |
| place | TEXT | 설치 장소 | 가정집, 상가, 학원, 공장, 기타 |
| camera_count | TEXT | CCTV 대수 | 1대, 2대, 3대, 4대, 5대 이상 |
| contact_time | TEXT | 연락 가능 시간 | 언제든 가능 |
| installation_date | TEXT | 설치 희망 날짜 | 2025-10-25 |
| installation_time | TEXT | 설치 희망 시간 | 오후 |
| memo | TEXT | 추가 메모 | - |
| privacy_consent | BOOLEAN | 개인정보 동의 | true, false |
| referrer | TEXT | 이전 페이지 URL | https://google.com |
| utm_source | TEXT | 트래픽 소스 | google |
| utm_medium | TEXT | 매체 | cpc |
| utm_campaign | TEXT | 캠페인명 | cctv_ad |
| session_id | TEXT | 세션 ID | session_xxx (페이지뷰와 연결) |
| status | TEXT | 상태 | pending, contacted, completed, cancelled |
| created_at | TIMESTAMPTZ | 신청 시간 | auto-generated |
| updated_at | TIMESTAMPTZ | 수정 시간 | auto-updated |

**인덱스:**
- created_at (DESC) - 최신순 조회
- status - 상태별 필터링
- phone - 전화번호 검색
- session_id - 페이지뷰와 연결

---

## 3. 데이터 저장 흐름

### 페이지 방문 시
```
사용자 페이지 접속
    ↓
PageViewTracker 실행
    ↓
데이터 수집 (UTM, 디바이스 등)
    ↓
병렬 저장:
├─ Google Sheets → 페이지뷰 시트
└─ Supabase → kt_cctv_pageviews 테이블
```

### 견적 신청 시
```
사용자 폼 제출
    ↓
submitConsultation 실행
    ↓
병렬 저장:
├─ Google Sheets → 견적신청 시트
└─ Supabase → kt_cctv_consultations 테이블
```

---

## 4. 데이터 분석 활용

### A. 기본 쿼리 예시

**최근 100개 페이지뷰 조회:**
```sql
SELECT *
FROM kt_cctv_pageviews
ORDER BY timestamp DESC
LIMIT 100;
```

**UTM 소스별 방문자 수:**
```sql
SELECT
  utm_source,
  COUNT(*) as visit_count,
  COUNT(DISTINCT session_id) as unique_visitors
FROM kt_cctv_pageviews
WHERE utm_source IS NOT NULL AND utm_source != ''
GROUP BY utm_source
ORDER BY visit_count DESC;
```

**디바이스 타입별 분포:**
```sql
SELECT
  device_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM kt_cctv_pageviews
GROUP BY device_type
ORDER BY count DESC;
```

**최근 7일 일별 방문자 추이:**
```sql
SELECT
  DATE(timestamp) as date,
  COUNT(*) as visits,
  COUNT(DISTINCT session_id) as unique_visitors
FROM kt_cctv_pageviews
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

---

### B. 마케팅 분석 뷰 활용

**견적 신청과 페이지뷰 연결 분석:**
```sql
SELECT * FROM kt_cctv_marketing_analysis
WHERE consultation_date >= NOW() - INTERVAL '30 days'
ORDER BY consultation_date DESC;
```

**캠페인별 전환율:**
```sql
SELECT
  utm_campaign,
  COUNT(DISTINCT pv.session_id) as total_visitors,
  COUNT(DISTINCT c.session_id) as conversions,
  ROUND(COUNT(DISTINCT c.session_id) * 100.0 /
    NULLIF(COUNT(DISTINCT pv.session_id), 0), 2) as conversion_rate
FROM kt_cctv_pageviews pv
LEFT JOIN kt_cctv_consultations c ON pv.session_id = c.session_id
WHERE pv.utm_campaign IS NOT NULL AND pv.utm_campaign != ''
GROUP BY utm_campaign
ORDER BY conversion_rate DESC;
```

**전환까지 걸린 평균 시간:**
```sql
SELECT
  AVG(time_to_conversion_minutes) as avg_minutes,
  MIN(time_to_conversion_minutes) as min_minutes,
  MAX(time_to_conversion_minutes) as max_minutes
FROM kt_cctv_marketing_analysis
WHERE time_to_conversion_minutes IS NOT NULL;
```

---

## 5. RLS (Row Level Security) 정책

### 현재 정책
- **INSERT**: 모든 사용자(anon, authenticated) 허용
- **SELECT**: 인증된 사용자만 허용
- **UPDATE**: 인증된 사용자만 허용 (kt_cctv_consultations만)

### 정책 수정이 필요한 경우
관리자 대시보드를 만들 때 적절한 RLS 정책을 추가하세요:

```sql
-- 예: 특정 역할만 조회 가능
CREATE POLICY "Admin only select" ON kt_cctv_pageviews
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 6. 백업 및 유지보수

### 자동 백업 설정
Supabase 프로젝트 설정에서 자동 백업을 활성화하세요:
1. Project Settings → Database
2. Enable Point-in-Time Recovery (PITR)

### 데이터 보관 정책
개인정보보호를 위해 오래된 데이터를 정기적으로 삭제하세요:

```sql
-- 1년 이상 된 페이지뷰 데이터 삭제
DELETE FROM kt_cctv_pageviews
WHERE created_at < NOW() - INTERVAL '1 year';

-- 완료된 견적 신청 중 1년 이상 된 데이터 아카이브
-- (실제 삭제 전에 백업 권장)
```

---

## 7. 모니터링

### Supabase Dashboard에서 모니터링
1. **Database** → **Table Editor**: 실시간 데이터 확인
2. **Database** → **Logs**: 쿼리 로그 및 오류 확인
3. **API** → **Logs**: API 호출 로그 확인

### 알림 설정
중요한 이벤트에 대한 알림을 설정하세요:
- 데이터베이스 용량 80% 도달
- 비정상적인 트래픽 증가
- API 오류율 증가

---

## 8. 문제 해결

### 데이터가 저장되지 않을 때
1. Supabase 프로젝트 URL과 API 키 확인 (.env.local)
2. RLS 정책 확인 (anon 역할에 INSERT 권한이 있는지)
3. 브라우저 콘솔에서 오류 메시지 확인

### RLS 정책 오류
```
"new row violates row-level security policy"
```
→ RLS 정책에서 anon 역할에 INSERT 권한 추가 필요

### 네트워크 오류
```
"Failed to fetch"
```
→ Supabase URL이 올바른지 확인
→ 네트워크 연결 상태 확인

---

## 9. 추가 기능 (선택사항)

### Realtime 구독
실시간으로 새로운 견적 신청을 받고 싶다면:

```typescript
const channel = supabase
  .channel('consultations')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'kt_cctv_consultations'
    },
    (payload) => {
      console.log('새 견적 신청!', payload)
      // 알림 표시 등
    }
  )
  .subscribe()
```

### Edge Functions
복잡한 데이터 처리나 외부 API 연동이 필요하다면 Supabase Edge Functions 활용을 고려하세요.

---

## 참고 자료
- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
