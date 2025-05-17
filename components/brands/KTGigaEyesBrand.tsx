import { Store, Shield } from "lucide-react"
import Image from "next/image"

export default function KTGigaEyesBrand() {
  return (
    <div className="wrap mb-16 max-w-[800px] mx-auto">
      <div className="title brand-3 mb-8">
        <div className="title-bx text-center">
          <span className="text-2xl md:text-3xl font-bold text-primary block mb-2">02</span>
          <p className="text-base md:text-lg text-gray-600 mb-2">어떤 비상 상황도 빠르게 해결</p>
          <h3 className="text-xl md:text-2xl font-bold mb-4">24시간 인공지능 CCTV</h3>
          <div className="brand-bx flex items-center justify-center gap-4">
            <Image
              src="https://cdn.ajd.kr/images/platform/landing/cctv/giga_eyes_logo.webp"
              alt="KT 기가아이즈"
              width={158}
              height={166}
              className="w-32 md:w-40"
            />
            <h2 className="text-darkblue text-lg md:text-xl font-bold">KT 기가아이즈</h2>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="price-bx text-center mb-8">
          <h5 className="text-2xl md:text-3xl font-bold">
            월 49,500원<span className="text-sm md:text-base font-normal">(VAT 포함)</span>
          </h5>
          <p className="text-gray-600">KT 인터넷 결합 시</p>
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
              <Store className="w-14 h-14 text-primary mr-3" />
              <p className="text-base md:text-lg">
                대형 매장 운영하는
                <br />
                <span className="text-darkblue font-bold">사장님</span>
              </p>
            </li>
            <li className="flex items-center bg-gray-50 p-4 rounded-lg">
              <strong className="text-darkblue mr-2 text-lg">02.</strong>
              <Shield className="w-14 h-14 text-primary mr-3" />
              <p className="text-base md:text-lg">
                사건 발생시
                <br />
                <span className="text-darkblue font-bold">
                  경찰서ㆍ소방서
                  <br />
                  자동 연락이 필요한 분
                </span>
              </p>
            </li>
          </ul>
          <p className="point-text mt-6 text-center text-base md:text-lg">
            <span className="text-darkblue font-bold">침입 시 실시간 휴대폰 알림과 동시에</span>
            <br />
            자동출동 문제해결 시스템
          </p>
        </div>
        <div className="service-bx">
          <Image
            src="https://cdn.ajd.kr/images/platform/landing/cctv/brand_cont_3_mo.webp"
            alt="서비스 내용"
            width={716}
            height={672}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  )
}

