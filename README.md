# KT CCTV 랜딩페이지

CCTV 설치 무료 견적 및 상담 신청을 위한 랜딩페이지입니다.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- ShadcnUI
- Google Sheets API

## 주요 기능

- 실시간 상담 신청 폼
- 다중 Google Sheets 연동 (중복 데이터 저장)
- 반응형 디자인
- 모션 애니메이션
- 자동 스크롤

## 데이터 저장 기능

- 사용자의 상담 신청 정보를 Google Sheets에 저장합니다.
- 저장된 데이터는 추후 분석 및 활용을 위해 사용됩니다.

## 환경 변수 설정

```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key
GOOGLE_SHEET_ID=your-sheet-id
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