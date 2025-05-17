import Image from "next/image"

export default function Banner() {
  return (
    <section 
      id="cctv-banner" 
      className="relative w-full h-[60vh] md:h-[80vh] mt-16"
      aria-label="메인 배너 섹션"
    >
      {/* 도시 야경 배경 이미지 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
      <Image
        src="/banner/banner.png"
        alt="도시 야경"
        fill
        sizes="100vw"
        priority
        quality={90}
        className="object-cover object-center"
        loading="eager"
      />
      
      {/* 콘텐츠 영역 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          {/* KT 텔레캅 로고 - 크게 */}
          <div className="relative h-24 md:h-32 w-64 md:w-80 mx-auto mb-8">
            <Image 
              src="/kt-telecop-logo.png" 
              alt="KT 텔레캅 로고" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          
          {/* 메인 문구 */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            안전과 보안으로 지켜드립니다.
          </h1>
          
          {/* CTA 버튼 */}
          <button className="mt-8 bg-[#E60012] hover:bg-[#c40010] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
            무료 견적 받기
          </button>
        </div>
      </div>
    </section>
  )
}

