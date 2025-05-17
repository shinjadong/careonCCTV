import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface FeatureItemProps {
  title: string
  description: string
  imageSrc: string
}

const FeatureItem = ({ title, description, imageSrc }: FeatureItemProps) => (
  <div className="flex flex-col items-center text-center mb-8">
    <div className="w-full mb-4">
      <h4 className="font-bold text-lg md:text-xl mb-2">{title}</h4>
      <p className="text-sm md:text-base text-gray-600 whitespace-pre-line w-4/5 mx-auto mb-4">
        {description}
      </p>
    </div>
    <div className="w-4/5">
      <Image
        src={imageSrc}
        alt={title}
        width={716}
        height={318}
        className="rounded-2xl shadow-md"
      />
    </div>
  </div>
)

export default function SKShieldsBrand() {
  return (
    <div className="wrap mb-16 max-w-[600px] mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <Image
            src="https://cdn.ajd.kr/images/platform/landing/cctv/brand_logo_1.webp"
            alt="캡스"
            width={80}
            height={80}
            className="w-20 h-20"
          />
        </div>
      </div>

      {/* Brand Title */}
      <h2 className="text-[#003087] text-2xl md:text-3xl font-bold text-center mb-8">SK 쉴더스</h2>

      {/* Price Section */}
      <div className="text-center mb-12">
        <h5 className="text-3xl md:text-4xl font-bold mb-2">
          월 9,500원 <span className="text-lg md:text-xl">(VAT 포함)</span>
        </h5>
        <p className="text-gray-600">SK 휴대폰 결합 시 최대 할인 금액</p>
      </div>

      {/* Recommendations Section */}
      <div className="mb-12">
        <h6 className="text-center text-lg md:text-xl font-bold text-[#003087] mb-8">이런 분들에게 추천드려요!</h6>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { emoji: "🐕👶", text: ["아기, 반려동물", "보호자"] },
            { emoji: "👩", text: ["혼자 사는", "여성분"] },
            { emoji: "👵👴", text: ["혼자 사시는", "부모님 걱정되는 분"] },
          ].map((item, index) => (
            <div key={index} className="p-2">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <p className="text-sm md:text-base">
                {item.text[0]}
                <br />
                <span className="text-[#003087] font-bold">{item.text[1]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl md:text-2xl font-bold">택배 도난 침입피해 시 보상</h3>
          <div className="text-base md:text-lg text-gray-700">
            <p>파손 사고 발생 시 최대 500만원</p>
            <p>도난 발생 시 최대 1천만원</p>
          </div>
          <p className="text-xs text-gray-400">* 경비 상황에서 사고 발생 시만 한정 / 캡스 본사에서 서비스 제공</p>
        </div>

        <div className="space-y-8">
          <FeatureItem
            title="실시간 고화질 영상 확인"
            description="200만 Full HD로 생생하게&#13;세밀한 부분까지 볼 수 있어요"
            imageSrc="https://cdn.ajd.kr/images/platform/landing/cctv/brand_cont_1_mo_241213.webp"
          />
          <FeatureItem
            title="실시간 대화 가능"
            description="비상시 급하게 연락하야 할 때 전화처럼&#13;쉽게 연락할 수 있습니다"
            imageSrc="https://cdn.ajd.kr/images/platform/landing/cctv/brand_cont_1_mo_241213.webp"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <Button className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base md:text-lg">
          지금 상담하고 특별 할인 받기
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}

