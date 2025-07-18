export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-medium mb-2 text-gray-500">회사 정보</h3>
            <p className="text-[10px] text-gray-500 leading-tight">회사명 : 주식회사 이스케이프</p>
            <p className="text-[10px] text-gray-500 leading-tight">대표 : 신예광</p>
            <p className="text-[10px] text-gray-500 leading-tight">사업자등록번호 : 292-87-03058</p>
            <p className="text-[10px] text-gray-500 leading-tight">주소 : 경상남도 창원시 진해구 여좌로 99번라길 4, 1동 201호실</p>
          </div>
          <div>
            <h3 className="text-xs font-medium mb-2 text-gray-500">고객 지원</h3>
            <p className="text-[10px] text-gray-500 leading-tight">이메일 : support@safetyzone119.com</p>
            <p className="text-[10px] text-gray-500 leading-tight">전화 : 1866-1845</p>
            <p className="text-[10px] text-gray-500 leading-tight">운영시간 : 평일 09:00 - 18:00</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[9px] text-gray-600/50">&copy; 2025 주식회사 이스케이프. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

