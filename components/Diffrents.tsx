import { HelpCircle, Camera, Wrench, Hammer, Headphones } from "lucide-react"

const difficulties = [
  {
    icon: <Camera className="w-28 h-20 mx-auto" />,
    text: "화질",
  },
  {
    icon: <Wrench className="w-24 h-[90px] mx-auto" />,
    text: "기능",
  },
  {
    icon: <Hammer className="w-20 h-20 mx-auto" />,
    text: "설치",
  },
  {
    icon: <Headphones className="w-[90px] h-[82px] mx-auto" />,
    text: "서비스",
  },
]

export default function Diffrents() {
  return (
    <section id="cctv-difficult" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <HelpCircle className="w-24 h-24 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-8">
            그동안 CCTV 선택이
            <br />
            어려웠던 이유
          </h2>
        </div>
        <div className="list-wrap grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {difficulties.map((item, index) => (
            <div key={index} className="list text-center">
              <div className="img mb-4">
                {item.icon}
              </div>
              <p className="text-xl font-semibold">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="solution-wrap text-center">
          <p className="text-2xl mb-4">
            그리고...
            <br />
            <strong className="text-red-600">가격!</strong>
          </p>
          <div className="point-text text-3xl font-bold">
            이 모든 고민
            <br />
            <strong className="text-red-600">전부 해결해 드리겠습니다!</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

