import Image from "next/image"

export default function AlarmSection() {
  return (
    <section id="cctv-alarm" className="py-6 md:py-12 lg:py-16 bg-black text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="alarm-news mb-6 md:mb-8 lg:mb-12">
          <div className="tit text-center mb-4 md:mb-6 lg:mb-8">
            <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#E60012]">방심하지 마세요!</h4>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
              상상을 초월하는 보안 범죄,
              <br className="block md:hidden" />
              유일한 해결책은 '예방'입니다.
            </h3>
          </div>
          <div className="cont relative">
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="relative w-full max-w-[280px] md:max-w-[323px] aspect-[323/166] mb-4 md:mb-6">
                <Image
                  src="/AlarmSection/siren.gif"
                  alt="경고등"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="relative w-full aspect-video mb-8 md:mb-12 max-w-[892px] mx-auto">
              <iframe
                src="https://www.youtube.com/embed/GrpbLVUyGsk"
                title="CCTV 보안 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
            <div className="text-center mb-6 md:mb-8">
              <div className="bg-[#E60012] inline-block px-2 py-1 mb-2">
                <span className="text-base md:text-lg lg:text-xl text-white">KT 공식인증 신규 상담센터</span>
              </div>
              <p className="text-base md:text-lg lg:text-xl font-bold text-[#E60012]">자격증 보유한 전문가가 지켜드립니다</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

