import Image from "next/image"

interface EssentialBoxProps {
  iconSrc: string
  title: string
  items: string[]
}

const EssentialBox = ({ iconSrc, title, items }: EssentialBoxProps) => (
  <div className="box bg-white rounded-xl shadow-lg p-8 mb-6 flex flex-col items-center border border-gray-200 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
    <div className="img-bx flex flex-col items-center mb-8">
      <Image 
        src={iconSrc || "/placeholder.svg"} 
        alt={`${title} 아이콘`} 
        width={75} 
        height={75} 
        className="icon mb-6" 
      />
      <p className="text-2xl font-bold text-gray-800">{title}</p>
    </div>
    <div className="txt-bx text-center w-full">
      {items.map((item, index) => (
        <div key={index} className="item mb-4 text-lg text-gray-600">
          {item}
        </div>
      ))}
    </div>
  </div>
)

export default function Essential() {
  return (
    <section id="cctv-essential" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="title text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-[#E60012]">KT 기술력으로 완성된 프리미엄 CCTV</h3>
        </div>
        <div className="content grid md:grid-cols-3 gap-8">
          <EssentialBox
            iconSrc="/kt-olleh-cctv-logo.png"
            title="안정적"
            items={["국내 최대 통신사 KT의\n안정적인 네트워크로 끝김 없는 서비스", "언제 어디서나 신뢰할 수 있는\nKT의 통신 기술"]}
          />
          <EssentialBox
            iconSrc="/kt-olleh-cctv-logo.png"
            title="전문적"
            items={["KT 인증 전문 기술진이\n최적의 위치에 설치해 드립니다", "설치부터 유지보수까지\n원스톱 서비스 제공"]}
          />
          <EssentialBox
            iconSrc="/kt-olleh-cctv-logo.png"
            title="경제적"
            items={[
              "초기 설치비 부담 없이\n월 요금제로 부담 없이 이용",
              "KT 통신 요금과 함께 이용하면\n할인 혜택 제공",
            ]}
          />
        </div>
      </div>
    </section>
  )
}

