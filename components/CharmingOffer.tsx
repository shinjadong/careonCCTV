"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const features = [
  {
    keyword: "합리적",
    title: "중간 마진이 없습니다.",
    description: "유통업체, 마케팅 업체를\n일체 사용하지 않습니다."
  },
  {
    keyword: "전문적",
    title: "국내 유일, CCTV보안 자격증",
    description: "국내 유일 'CCTV 전문 자격증을\n소지한 전문가가, 직접 설치합니다."
  },
  {
    keyword: "안정적",
    title: "공식인증센터라 안전합니다.",
    description: "인증된 정품만을 취급합니다"
  }
]

export default function CharmingOffer() {
  return (
    <section className="relative py-24 md:py-32 bg-white">
      {/* Top blend effect 제거 */}
      
      <div className="container mx-auto px-4">
        {/* 로고 및 제목 삭제 */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute -inset-[2px] bg-gradient-to-br from-primary via-primary/50 to-transparent rounded-[24px] z-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="absolute inset-[1px] bg-white rounded-[23px] z-[1]"></div>
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
                <div className="relative">
                  <div className="absolute -inset-[2px] bg-gradient-to-br from-primary to-primary/80 rounded-xl z-0"></div>
                  <div className="relative z-10 bg-primary text-white font-extrabold text-3xl md:text-4xl px-12 py-6 rounded-xl tracking-wider">
                    {feature.keyword}
                  </div>
                </div>
              </div>
              <div className="pt-24 p-8 text-center flex flex-col h-full justify-between relative z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 leading-relaxed">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg md:text-xl whitespace-pre-line leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom blend effect 제거 */}
    </section>
  )
}

