"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Confidence() {
  const [isImageVisible, setIsImageVisible] = useState(false)

  return (
    <section id="cctv-confidence" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          속지 마세요.
          <br />
          <span className="text-primary">가격? 당연히 투명해야죠.</span>
        </h2>
        <div className="flex flex-col items-center gap-8">
          <Button 
            onClick={() => setIsImageVisible(!isImageVisible)}
            className="bg-primary hover:bg-primary/90 text-white text-xl py-6 px-8 rounded-lg"
          >
            실시간 최저가 조회
          </Button>
          <AnimatePresence>
            {isImageVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Image
                  src="https://cdn.ajd.kr/images/platform/landing/cctv/charge_table_mo.webp"
                  alt="통신사별 가격"
                  width={780}
                  height={400}
                  className="w-full rounded-lg shadow-lg mx-auto"
                />
                <p className="text-base text-gray-600 text-center mt-4">
                  * 현장 담당자 방문 시 설치 장소에 따라 월 요금은 변동 될 수 있습니다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

