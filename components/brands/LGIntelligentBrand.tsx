import Image from "next/image"

export default function LGIntelligentBrand() {
  return (
    <div className="wrap max-w-[800px] mx-auto">
      <div className="title brand-4 mb-8">
        <div className="title-bx text-center">
          <span className="text-2xl md:text-3xl font-bold text-primary block mb-2">03</span>
          <p className="text-base md:text-lg text-gray-600 mb-2">AI기반 감지 알람으로 편안하게 관리</p>
          <h3 className="text-xl md:text-2xl font-bold mb-4">지능형 CCTV</h3>
          <div className="brand-bx flex items-center justify-center gap-4">
            <Image
              src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_main_icon.webp"
              alt="LG 지능형"
              width={158}
              height={166}
              className="w-32 md:w-40"
            />
            <h2 className="text-darkblue text-lg md:text-xl font-bold">LG 지능형</h2>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="price-bx text-center mb-8">
          <h5 className="text-2xl md:text-3xl font-bold">
            월 7,700원<span className="text-sm md:text-base font-normal">(VAT 포함)</span>
          </h5>
          <p className="text-gray-600">U+ 인터넷 500M 결합 시</p>
        </div>
        <div className="recommend-bx mb-8">
          <div className="tit text-center mb-6">
            <h6 className="text-lg md:text-xl font-semibold">
              <span className="text-darkblue">이런 분들</span>에게 <span className="text-darkblue">추천</span>드려요!
            </h6>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="flex items-center bg-gray-50 p-4 rounded-lg">
              <strong className="text-darkblue mr-2 text-lg">01.</strong>
              <Image
                src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_icon1.webp"
                alt="이모지"
                width={55}
                height={55}
                className="mr-3"
              />
              <p className="text-base md:text-lg">
                소규모 사업장
                <br />
                <span className="text-darkblue font-bold">사장님</span>
              </p>
            </li>
            <li className="flex items-center bg-gray-50 p-4 rounded-lg">
              <strong className="text-darkblue mr-2 text-lg">02.</strong>
              <Image
                src="https://cdn.ajd.kr/images/platform/landing/cctv/lg_icon2.webp"
                alt="이모지"
                width={54}
                height={59}
                className="mr-3"
              />
              <p className="text-base md:text-lg">
                <span className="text-darkblue font-bold">가정 내 침입자</span>
                <br />
                감지가 필요한 분
              </p>
            </li>
          </ul>
          <p className="point-text mt-6 text-center text-base md:text-lg">
            <span className="text-darkblue font-bold">AI가 이상 상황을 감지</span>하면
            <br />
            긴급 알림으로 문제 해결 시스템
          </p>
        </div>
        <div className="feature-list space-y-8">
          {[
            {
              title: "AI 기반 실시간 이상 감지",
              description: "인공지능이 실시간으로 이상 상황을 감지하여 즉각 알림을 제공합니다",
              image: "https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents1.webp",
            },
            {
              title: "고해상도 영상 촬영 및 저장",
              description: "고해상도의 영상을 대용량 저장 공간을 통해 장기간 보관할 수 있습니다",
              image: "https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents2.webp",
            },
            {
              title: "원격 모니터링 및 제어 기능",
              description: "원격으로 카메라의 방향 조절 및 설정이 변경 가능합니다",
              image: "https://cdn.ajd.kr/images/platform/landing/cctv/lg_contents3.webp",
            },
          ].map((feature, index) => (
            <div key={index} className="feature-item bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-6 md:w-1/2">
                  <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

