import Image from "next/image"

interface Review {
  name: string
  content: string
  imageSrc: string
}

const reviews: Review[] = [
  {
    name: "@ca****님",
    content:
      "여러 업체 알아보다 시간만 날렸어요. KT는 첫 상담에서 바로 결정했습니다!<br><br>" +
      "<strong class='text-blue'>3만원대에 정부지원금까지 챙겨주셔서 최신형 설치했네요.<br>" +
      "사장 입장에서 정직하게 딱 필요한 만큼만 추천해주는 유일한 업체였습니다.</strong>",
    imageSrc: "https://cdn.ajd.kr/images/platform/landing/cctv/review1.webp?w=120&h=120",
  },
  {
    name: "@st****님",
    content:
      "<strong class='text-blue'>새벽에 급한 문제가 생겼는데도 즉시 응대해주셨어요!<br>" +
      "다른 업체들은 설치 후 연락이 안 되던데,</strong><br><br>" +
      "케이티는 1년 넘게 계속 관리해주시니 진짜 가게 지킴이 같아요.<br>" +
      "역시 입소문 날 만한 이유가 있었습니다.",
    imageSrc: "https://cdn.ajd.kr/images/platform/landing/cctv/review2.webp?w=120&h=120",
  },
  {
    name: "@ma****님",
    content:
      "전에 쓰던 CCTV로는 도난 사건이 있어도 증거가 안 됐어요.<br><br>" +
      "<strong class='text-blue'>KT 테레캅으로 바꾸고 야간에도 얼굴 특징까지 선명하게 보여서 경찰서에서도 놀라더라고요!<br><br>" +
      "360도 회전 기능은 사각지대까지 완벽하게 커버해줘서 가게 비울 때도 걱정이 없습니다.</strong>",
    imageSrc: "https://cdn.ajd.kr/images/platform/landing/cctv/review3.webp?w=120&h=120",
  },
]

export default function ReviewSection() {
  return (
    <section id="cctv-review" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="title text-center mb-12">
          <Image
            src="https://cdn.ajd.kr/images/platform/landing/moving/workman/star.webp"
            alt="별 다섯개"
            width={532}
            height={170}
            className="mx-auto mb-6"
          />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            가짜 리뷰를 조심하세요.
            <br />
            <strong className="text-blue">100% 리얼 후기</strong>
          </h3>
          <p className="text-lg flex items-center justify-center">
            먼저 경험해본, '실제 후기'를 확인하세요.
            <Image
              src="https://cdn.ajd.kr/images/platform/landing/cctv/ddabong.webp"
              alt="따봉"
              width={37}
              height={37}
              className="ml-2"
            />
          </p>
        </div>
        <div className="content space-y-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review-item bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center hover:shadow-lg transition-shadow"
            >
              <div className="cont-box flex-grow mb-4 md:mb-0 md:mr-6">
                <div className="user-name text-lg font-semibold mb-3">{review.name}</div>
                <p 
                  className="description text-lg leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: review.content }}
                ></p>
              </div>
              <div className="img-box flex-shrink-0">
                <Image
                  src={review.imageSrc || "/placeholder.svg"}
                  alt="cctv 사용 모습"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

