import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KT CCTV - 세상을 안전하게 만드는 기술',
  description: 'CCTV 설치 무료 견적 및 상담 신청을 위한 랜딩페이지입니다. 인증된 업체와 함께 소중한 공간을 안전하게 지키세요.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
