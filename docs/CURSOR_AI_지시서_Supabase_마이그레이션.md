# Cursor AI 에이전트 지시서: Supabase 마이그레이션 실행 및 테스트

## 목표
KT CCTV 프로젝트의 Supabase 데이터베이스에 마이그레이션을 적용하고, 페이지뷰 추적 및 견적 신청 데이터가 정상적으로 저장되는지 테스트합니다.

---

## 📋 필수 읽기 파일 목록

### 1. 마이그레이션 파일 (최우선)
```
✅ migrations/20251022_create_kt_cctv_tables.sql
```
→ **역할**: 실행해야 할 SQL 스크립트 (테이블, 인덱스, RLS 정책, 뷰 생성)

### 2. 설정 및 환경변수
```
✅ .env.local
```
→ **확인 항목**:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- (없으면 Supabase Dashboard에서 확인 필요)

### 3. Supabase 관련 코드
```
✅ lib/supabase.ts
```
→ **확인 사항**: Supabase 클라이언트 설정, 타입 정의, 저장 함수

```
✅ app/actions/submit.ts
```
→ **확인 사항**: trackPageView, submitConsultation 함수의 Supabase 저장 로직

### 4. 데이터 수집 로직
```
✅ lib/tracking.ts
```
→ **확인 사항**: collectPageViewData 함수의 데이터 구조

```
✅ components/PageViewTracker.tsx
```
→ **확인 사항**: 페이지 로드 시 자동 추적 로직

```
✅ components/ContactFormSimple.tsx
```
→ **확인 사항**: 폼 제출 시 데이터 전송 (UTM, session_id 포함)

### 5. 문서
```
✅ docs/Supabase_설정_가이드.md
✅ docs/페이지뷰_추적_가이드.md
```
→ **참고**: 테이블 구조, 분석 쿼리 예시

---

## 🎯 작업 단계

### STEP 1: 환경변수 확인
```bash
# .env.local 파일에 다음 변수가 있는지 확인
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**없는 경우:**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → Settings → API
3. Project URL과 anon public key 복사
4. .env.local에 추가

---

### STEP 2: Supabase에 마이그레이션 적용

#### 방법 A: Supabase Dashboard 사용 (권장)
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 좌측 메뉴: **SQL Editor** 클릭
4. **New Query** 버튼 클릭
5. `migrations/20251022_create_kt_cctv_tables.sql` 파일 내용 전체 복사
6. SQL Editor에 붙여넣기
7. **Run** 버튼 클릭 (또는 Ctrl+Enter)

**예상 결과:**
```
Success. No rows returned
```

#### 방법 B: Node.js 스크립트 사용 (선택)
아래 스크립트를 실행하여 자동으로 마이그레이션 적용:

```typescript
// scripts/run-migration.ts 파일 생성
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Service Role Key가 필요할 수 있음 (RLS 우회)
const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  const sqlPath = path.join(process.cwd(), 'migrations/20251022_create_kt_cctv_tables.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  // SQL을 세미콜론으로 분리하여 순차 실행
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const statement of statements) {
    console.log('Executing:', statement.substring(0, 50) + '...')
    const { error } = await supabase.rpc('exec_sql', { sql: statement })
    if (error) {
      console.error('Error:', error)
      throw error
    }
  }

  console.log('✅ Migration completed successfully')
}

runMigration()
```

**실행:**
```bash
npx tsx scripts/run-migration.ts
```

---

### STEP 3: 테이블 생성 확인

1. Supabase Dashboard → **Table Editor**
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `kt_cctv_pageviews`
   - ✅ `kt_cctv_consultations`

3. 각 테이블 클릭하여 컬럼 구조 확인:

**kt_cctv_pageviews (17개 컬럼):**
```
id, timestamp, current_url, referrer, landing_page,
utm_source, utm_medium, utm_campaign, utm_term, utm_content,
device_type, screen_size, viewport_size,
browser_language, user_agent, is_touch_device,
session_id, created_at
```

**kt_cctv_consultations (18개 컬럼):**
```
id, name, phone, address, place, camera_count,
contact_time, installation_date, installation_time, memo,
privacy_consent, referrer,
utm_source, utm_medium, utm_campaign,
session_id, status,
created_at, updated_at
```

---

### STEP 4: 로컬 개발 서버 실행 및 테스트

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

### STEP 5: 페이지뷰 추적 테스트

#### A. 브라우저 콘솔 확인
1. F12 → Console 탭 열기
2. 페이지 접속 후 다음 로그 확인:
```
📊 페이지뷰 데이터 수집: {...}
✅ 페이지뷰 추적 성공
페이지뷰 데이터 저장 성공 (구글 시트 + Supabase)
```

#### B. Supabase 데이터 확인
1. Supabase Dashboard → Table Editor
2. `kt_cctv_pageviews` 테이블 클릭
3. 새로운 행이 추가되었는지 확인

**확인 항목:**
- ✅ timestamp: 현재 시간
- ✅ current_url: 페이지 URL
- ✅ referrer: '직접 접속' 또는 이전 페이지
- ✅ device_type: Desktop, Mobile, Tablet 중 하나
- ✅ screen_size: 화면 해상도 (예: 1920x1080)
- ✅ session_id: session_으로 시작하는 문자열

---

### STEP 6: 견적 신청 테스트

#### A. 폼 작성 및 제출
1. 페이지에서 견적 신청 폼 찾기
2. 다음 정보 입력:
   - 이름: 테스트
   - 연락처: 010-1234-5678
   - 설치 지역: 서울시 강남구
   - 설치 장소: 가정집
   - 설치 대수: 2대
   - 개인정보 동의: 체크
3. "무료로 견적 받기" 버튼 클릭

#### B. 제출 성공 확인
브라우저 콘솔에서:
```
견적 신청 데이터 수신: {...}
구글 시트 및 Supabase 저장 성공
```

#### C. Supabase 데이터 확인
1. Supabase Dashboard → Table Editor
2. `kt_cctv_consultations` 테이블 클릭
3. 새로운 행이 추가되었는지 확인

**확인 항목:**
- ✅ name: "테스트"
- ✅ phone: "010-1234-5678"
- ✅ address: "서울시 강남구"
- ✅ place: "가정집"
- ✅ camera_count: "2대"
- ✅ status: "pending"
- ✅ session_id: 페이지뷰와 동일한 세션 ID
- ✅ referrer: 이전 페이지 URL
- ✅ utm_source, utm_medium, utm_campaign: URL에 UTM이 있었다면 채워짐

---

### STEP 7: UTM 파라미터 테스트 (선택)

UTM 파라미터가 제대로 수집되는지 테스트:

```
http://localhost:3000/?utm_source=google&utm_medium=cpc&utm_campaign=test_campaign
```

위 URL로 접속 후:
1. 페이지뷰 데이터 확인 → utm_source="google", utm_medium="cpc" 등
2. 견적 신청 후 → 견적 데이터에도 UTM 정보 포함 확인

---

### STEP 8: 세션 연결 테스트

같은 세션에서 페이지뷰와 견적 신청이 연결되는지 확인:

#### SQL 쿼리 실행
Supabase Dashboard → SQL Editor → New Query:

```sql
SELECT
  c.name,
  c.phone,
  c.session_id,
  c.created_at AS consultation_time,
  pv.timestamp AS first_visit,
  pv.utm_source,
  pv.device_type,
  EXTRACT(EPOCH FROM (c.created_at - pv.timestamp))/60 AS minutes_to_conversion
FROM kt_cctv_consultations c
LEFT JOIN kt_cctv_pageviews pv ON c.session_id = pv.session_id
WHERE pv.timestamp = (
  SELECT MIN(timestamp)
  FROM kt_cctv_pageviews
  WHERE session_id = c.session_id
)
ORDER BY c.created_at DESC
LIMIT 5;
```

**예상 결과:**
테스트로 제출한 견적 신청이 페이지뷰와 연결되어 표시됨.

---

## ✅ 성공 기준

### 필수 통과 항목
- [ ] 마이그레이션 실행 성공 (테이블 생성)
- [ ] 페이지 접속 시 kt_cctv_pageviews에 데이터 저장됨
- [ ] 견적 신청 시 kt_cctv_consultations에 데이터 저장됨
- [ ] session_id가 페이지뷰와 견적 신청에 동일하게 기록됨
- [ ] UTM 파라미터가 정상적으로 수집됨
- [ ] 브라우저 콘솔에 오류 없음

### 선택 확인 항목
- [ ] 마케팅 분석 뷰(kt_cctv_marketing_analysis) 조회 가능
- [ ] 인덱스가 정상적으로 생성됨
- [ ] RLS 정책이 적용됨 (anon 삽입 허용)

---

## ⚠️ 문제 해결

### 1. 마이그레이션 실패
**오류**: `permission denied` 또는 `insufficient privileges`
**해결**:
- Supabase Service Role Key 사용 필요
- Dashboard에서 수동 실행 (더 높은 권한)

### 2. 데이터가 저장되지 않음
**확인 사항**:
```bash
# 환경변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**해결**:
- .env.local 파일 확인
- Supabase 프로젝트가 활성 상태인지 확인
- RLS 정책 확인 (anon에 INSERT 권한)

### 3. RLS 정책 오류
**오류**: `new row violates row-level security policy`

**해결**:
Supabase Dashboard → SQL Editor:
```sql
-- RLS 정책 확인
SELECT * FROM pg_policies
WHERE tablename IN ('kt_cctv_pageviews', 'kt_cctv_consultations');

-- 필요시 정책 다시 생성
DROP POLICY IF EXISTS "Enable insert for all users" ON kt_cctv_pageviews;
CREATE POLICY "Enable insert for all users" ON kt_cctv_pageviews
FOR INSERT TO anon, authenticated
WITH CHECK (true);
```

### 4. TypeScript 오류
**오류**: 타입 관련 오류

**해결**:
```bash
npm run build
# 빌드 성공 확인
```

---

## 📊 데이터 확인 쿼리

### 최근 10개 페이지뷰
```sql
SELECT * FROM kt_cctv_pageviews
ORDER BY timestamp DESC
LIMIT 10;
```

### 최근 10개 견적 신청
```sql
SELECT * FROM kt_cctv_consultations
ORDER BY created_at DESC
LIMIT 10;
```

### 세션별 데이터 확인
```sql
SELECT
  session_id,
  COUNT(*) FILTER (WHERE tablename = 'pageviews') as pageview_count,
  COUNT(*) FILTER (WHERE tablename = 'consultations') as consultation_count
FROM (
  SELECT session_id, 'pageviews' as tablename FROM kt_cctv_pageviews
  UNION ALL
  SELECT session_id, 'consultations' FROM kt_cctv_consultations
) combined
GROUP BY session_id
ORDER BY pageview_count DESC;
```

---

## 🎬 최종 단계: 커밋 & 푸시

테스트가 모두 성공하면:

```bash
# 변경사항 확인
git status

# 스테이징
git add .

# 커밋
git commit -m "feat: Supabase 데이터베이스 통합

- kt_cctv_pageviews, kt_cctv_consultations 테이블 생성
- 페이지뷰 추적 및 견적 신청 데이터를 Supabase에 저장
- Google Sheets와 Supabase 병렬 저장 (데이터 이중화)
- 마케팅 분석 뷰 추가 (전환율, 세션 추적)
- RLS 정책 적용 (보안)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 푸시
git push origin main
```

---

## 📝 작업 완료 후 보고 사항

다음 정보를 사용자에게 보고:

1. ✅ 마이그레이션 실행 결과
2. ✅ 테이블 생성 확인 (스크린샷)
3. ✅ 테스트 데이터 확인 (스크린샷)
4. ✅ 브라우저 콘솔 로그 (성공 메시지)
5. ✅ SQL 쿼리 결과 (세션 연결 확인)
6. ⚠️ 발생한 문제 및 해결 방법 (있는 경우)

---

## 🔗 참고 링크
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
