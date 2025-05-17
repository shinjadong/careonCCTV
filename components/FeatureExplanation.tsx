import Image from "next/image"

interface FeatureItemProps {
  title: string
  description: string
  imageSrc: string
}

const FeatureItem = ({ title, description, imageSrc }: FeatureItemProps) => (
  <div className="flex flex-col items-center text-center mb-12 last:mb-0">
    <div className="w-full mb-6">
      <h4 className="font-bold text-xl md:text-2xl mb-3">{title}</h4>
      <p className="text-base md:text-lg text-gray-600 whitespace-pre-line w-4/5 mx-auto">
        {description}
      </p>
    </div>
    <div className="w-4/5">
      <Image
        src={imageSrc}
        alt={title}
        width={716}
        height={318}
        className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      />
    </div>
  </div>
)

export default function FeatureExplanation() {
  const features = [
    {
      title: "실시간 고화질 영상 확인",
      description: "200만 Full HD로 생생하게\n세밀한 부분까지 볼 수 있어요",
      imageSrc: "/feature-explanation/feature-1.webp"
    },
    {
      title: "실시간 대화 가능",
      description: "비상시 급하게 연락해야 할 때\n전화처럼 쉽게 연락할 수 있습니다",
      imageSrc: "/feature-explanation/feature-2.webp"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          CCTV의 핵심 기능
        </h2>
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 