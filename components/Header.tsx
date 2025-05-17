import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* KT 텔레캅 로고 */}
          <div className="flex items-center">
            <div className="relative h-8 md:h-10 w-32 md:w-40">
              <Image 
                src="/kt-telecop-logo.png" 
                alt="KT 텔레캅 로고" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
          </div>
          
          {/* 데스크톱 메뉴 & 모바일 버튼 */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-[#E60012] font-medium transition-colors">서비스</a>
              <a href="#" className="text-gray-700 hover:text-[#E60012] font-medium transition-colors">제품안내</a>
              <a href="#" className="text-gray-700 hover:text-[#E60012] font-medium transition-colors">고객지원</a>
            </div>
            
            <Button 
              variant="outline" 
              className="hidden md:inline-flex text-sm md:text-base px-4 py-2 border-[#E60012] text-[#E60012] hover:bg-[#E60012] hover:text-white transition-colors"
            >
              무료 견적 받기
            </Button>
            
            {/* 모바일 메뉴 아이콘 */}
            <button className="md:hidden text-gray-700 hover:text-[#E60012] transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

