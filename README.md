# KT CCTV 랜딩페이지

CCTV 설치 무료 견적 및 상담 신청을 위한 랜딩페이지입니다.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- ShadcnUI
- Supabase

## 주요 기능

- 실시간 상담 신청 폼
- Supabase 데이터베이스 연동
- 반응형 디자인
- 모션 애니메이션
- 자동 스크롤

## 데이터 저장 기능

- 사용자의 상담 신청 정보를 Supabase kt-cctv-legacy 테이블에 저장합니다.
- 저장된 데이터는 추후 분석 및 활용을 위해 사용됩니다.

## 환경 변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 데이터베이스 구조

### kt-cctv-legacy 테이블
- `id`: 자동 증가 ID
- `name`: 고객 이름
- `phone`: 연락처
- `contact_time`: 연락 가능 시간
- `installation_location`: 설치 장소
- `address`: 주소
- `installation_date`: 설치 희망 날짜
- `installation_time`: 설치 희망 시간
- `camera_count`: 카메라 설치 대수
- `memo`: 추가 메모
- `privacy_consent`: 개인정보 동의 여부
- `created_at`: 생성 시간
- `updated_at`: 수정 시간 