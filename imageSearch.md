# 요소

정수기

    https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.skmagic.com%2Fgoods%2FindexGoodsDetail%3FgoodsId%3DG000068487&psig=AOvVaw1El3mk2Wy02FSigyWYhj5l&ust=1740514571638000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMixzpuQ3YsDFQAAAAAdAAAAABAE



인터넷

https://miso-strapi-production.s3.ap-northeast-2.amazonaws.com/Group_3850_fc3aade228.png




48인지 tv

https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XXb18guHhpkxs04E6_qfJiVhoy3LadqKZg&s



키오스크

https://www.lguplus.com/static/pc-contents/images/uhdc/shec/pp/sngl/20240523-091256-119-7X3Z47is.png


포스기

https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPQlLCoKKnWRPZeRCj0WLk3XBxP8GO1NSv7Q&s


테이블오더

https://www.expos.co.kr/images/restaurant/table_order/sld/sld-dk-lg%201.png



# 컴포넌트별 이미지 교체 목록

## 공통 가이드라인

- 모든 이미지는 WebP 포맷 사용
- 이미지 최적화를 위해 Next.js Image 컴포넌트의 quality 속성은 기본값(75) 사용
- 반응형 이미지의 경우 sizes 속성 추가
- 모든 이미지는 alt 텍스트 필수 포함
- 이미지 최적화를 위해 Next.js Image 컴포넌트의 priority 속성은 중요한 이미지에만 사용

## 아이콘 대체 계획 (Lucide Icons)

### KTGigaEyesBrand

- [X] 추천 아이콘 1 (매장)

- 현재: https://cdn.ajd.kr/images/platform/landing/cctv/kt_recomm_1.webp
- 대체: `<Store className="w-14 h-14 text-primary mr-3" />`
- 용도: 매장 추천 아이콘

- [X] 추천 아이콘 2 (보안)

  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/kt_recomm_2.webp
  - 대체: `<Shield className="w-14 h-14 text-primary mr-3" />`
  - 용도: 보안 추천 아이콘

### CheckList

- [ ] 손 이모지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/hand_emoji.webp
  - 대체: `<HandMetal className="w-24 h-24 text-primary mx-auto mb-4" />`
  - 용도: 섹션 상단 아이콘

### Diffrents

- [X] 고민 이모지

  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/emoji.webp
  - 대체: `<HelpCircle className="w-24 h-24 text-primary mx-auto mb-4" />`
  - 용도: 섹션 상단 아이콘
- [X] 어려움 아이콘 1-4

  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/difficult_[1-4].webp
  - 대체:
    - [X] 1번 (화질): `<Camera className="w-28 h-20 mx-auto" />`
    - [X] 2번 (기능): `<Wrench className="w-24 h-[90px] mx-auto" />`
    - [X] 3번 (설치): `<Hammer className="w-20 h-20 mx-auto" />`
    - [X] 4번 (서비스): `<Headphones className="w-[90px] h-[82px] mx-auto" />`

### Essential

- 아이콘 1,2,3
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/essential_[1-3].webp
  - 대체:
    - 1번 (홈): `<Home className="w-[75px] h-[75px] text-primary icon mr-4" />`
    - 2번 (매장): `<Store className="w-[75px] h-[75px] text-primary icon mr-4" />`
    - 3번 (사무실): `<Building2 className="w-[75px] h-[75px] text-primary icon mr-4" />`

### PackageSection

- 시계 아이콘
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/clock.webp
  - 대체: `<Clock className="w-56 h-32 text-primary mx-auto mb-4" />`
  - 용도: 섹션 상단 아이콘

### ReviewSection

- 따봉 이모지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/ddabong.webp
  - 대체: `<ThumbsUp className="w-9 h-9 text-primary ml-2" />`
  - 용도: 리뷰 섹션 아이콘

## AlarmSection.tsx

- [X] 경고등 이미지 (이미 로컬 이미지로 교체됨)

- 위치: /public/AlarmSection/siren.gif
- 크기: 323x166px
- 용도: 경고등 애니메이션

- [X] 공식 인증 배너

- 현재: https://cdn.ajd.kr/images/platform/landing/cctv/offical_certi_mo_241213.webp
- 교체: /public/AlarmSection/CCTV렌탈은케어온.png
- 크기: 780x174px
- 용도: 하단 인증 배너
- 반응형: true (w-full max-w-[780px])

## BrandSection.tsx

### SKShieldsBrand

- 브랜드 로고
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/brand_logo_1.webp
  - 크기: 80x80px
  - 용도: SK 쉴더스 로고
  - 반응형: true (w-20 h-20)
- 기능 설명 이미지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/brand_cont_1_mo_241213.webp
  - 크기: 80x80px (2번 사용됨)
  - 용도: 기능 설명 섹션의 우측 이미지
  - 반응형: true (rounded-lg object-cover)

### KTGigaEyesBrand

- 브랜드 로고
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/giga_eyes_logo.webp
  - 교체 : https://e7.pngegg.com/pngimages/143/428/png-clipart-kt-corporation-wibro-service-business-seoul-financial-technology-angle-text-thumbnail.png
  - 크기: 158x166px
  - 용도: KT 기가아이즈 로고
  - 반응형: true (w-32 md:w-40)
- 추천 아이콘 1
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/kt_recomm_1.webp
  - 크기: 55x55px
  - 용도: 추천 대상 아이콘
- 추천 아이콘 2
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/kt_recomm_2.webp
  - 크기: 54x59px
  - 용도: 추천 대상 아이콘
- 서비스 설명
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/brand_cont_3_mo.webp
  - 크기: 716x672px
  - 용도: 서비스 상세 설명 이미지
  - 반응형: true (w-full rounded-lg shadow-md)

### LGIntelligentBrand

- 브랜드 로고
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/lg_main_icon.webp
  - 크기: 158x166px
  - 용도: LG 지능형 로고
  - 반응형: true (w-32 md:w-40)
- 추천 아이콘 1, 2
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/lg_icon1.webp
  - 크기: 55x55px
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/lg_icon2.webp
  - 크기: 54x59px
- 기능 설명 이미지 1,2,3
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents[1-3].webp
  - 크기: 400x300px
  - 용도: 기능 설명 섹션의 이미지
  - 반응형: true (w-full h-auto)

## CharmingOffer.tsx

- 타이틀 이미지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/professional_title.webp
  - 크기: 569x130px
  - 용도: 섹션 타이틀
  - 반응형: true (mx-auto)

- [X] 전문가 이미지 1,2,3
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/professional_[1-3]_mo.webp
  - 대체:
    - 1번: `<FileCheck className="w-20 h-20 text-primary mb-4" />`
    - 2번: `<UserCheck className="w-20 h-20 text-primary mb-4" />`
    - 3번: `<ClipboardCheck className="w-20 h-20 text-primary mb-4" />`
  - 용도: 전문가 설명 섹션
  - 반응형: true (bg-gray-50 p-8 rounded-2xl hover:shadow-xl)
  - 애니메이션: framer-motion 적용

## CheckList.tsx

- 체크리스트 이미지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/check_list_mo.webp
  - 크기: 716x606px
  - 용도: 메인 체크리스트
  - 반응형: true (mx-auto mb-8 rounded-lg shadow-md)

## Confidence.tsx

- 가격표 이미지
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/charge_table_mo.webp
  - 크기: 780x400px
  - 용도: 가격 비교표
  - 반응형: true (w-full rounded-lg shadow-lg mx-auto)
  - 애니메이션: framer-motion 적용

## Diffrents.tsx

- 어려움 아이콘 1-4
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/difficult_[1-4].webp
  - 크기:
    - 1번: 112x80px (화질)
    - 2번: 96x90px (기능)
    - 3번: 80x80px (설치)
    - 4번: 90x82px (서비스)
  - 반응형: true (mx-auto)

## Essential.tsx

- 아이콘 1,2,3
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/essential_[1-3].webp
  - 크기: 75x75px
  - 용도: 각 섹션 아이콘
  - 반응형: true (icon mr-4)

## PackageSection.tsx

- 패키지 설명
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/package_mo.webp
  - 크기: 716x2492px
  - 용도: 패키지 상세 설명
  - 반응형: true (w-full)

## ReviewSection.tsx

- 별점 이미지
  - 현재: https://cdn.ajd.kr/images/platform/landing/moving/workman/star.webp
  - 크기: 532x170px
  - 용도: 상단 별점 표시
  - 반응형: true (mx-auto mb-6)
- 리뷰 이미지 1,2,3
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/review[1-3].webp
  - 크기: 120x120px
  - 용도: 리뷰어 프로필 이미지
  - 반응형: true (rounded-full)
  - 특이사항: URL에 w=120&h=120 파라미터 포함

## Service.tsx

- 서비스 이미지 1-4
  - 현재: https://cdn.ajd.kr/images/platform/landing/cctv/service_[1-4]_mo.webp
  - 크기: 716x318px
  - 용도: 서비스 설명 이미지
  - 반응형: true (rounded-lg shadow-md)

## 이미지 교체 필요 없는 컴포넌트

- Banner.tsx (이미 로컬 이미지 사용 중)
- ContactForm.tsx
- EssentialBanner.tsx
- FAQSection.tsx
- FloatingButton.tsx
- Footer.tsx
- Header.tsx (이미 로컬 로고 사용 중)
- theme-provider.tsx

## 특이사항

1. SKShieldsBrand에서 brand_cont_1_mo_241213.webp 이미지가 두 번 사용됨
2. ReviewSection의 이미지들은 URL에 w=120&h=120 파라미터가 포함되어 있음
3. 모든 이미지는 public 폴더 내 각 컴포넌트명의 하위 폴더에 저장
4. 이미지 파일명은 현재 파일명의 마지막 부분을 사용 (예: professional_1_mo.webp -> professional-1.webp)
5. 반응형 이미지의 경우 -mobile, -tablet, -desktop 접미사 추가
6. 모든 이미지에 대해 alt 텍스트가 의미있게 작성되어 있는지 확인 필요
7. Next.js Image 컴포넌트의 legacy props (layout, objectFit) 제거 필요
