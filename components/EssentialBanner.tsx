"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.8
    }
  }
};

export default function EssentialBanner() {
  const scrollToContact = () => {
    const element = document.getElementById('cctv-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="essential-banner relative bg-gradient-to-br from-[#E60012] via-[#E60012] to-[#FF7A00] text-white py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          {/* 38초 카운터 삭제 */}

          {/* 메인 텍스트 */}
          <div className="space-y-4 md:space-y-6">
            <motion.h2 
              variants={textVariants}
              className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
            >
              소중한 내 공간,
              <br className="block md:hidden" />
              <span className="text-white">
                믿을만한 CCTV로 안전하게
              </span>
            </motion.h2>
            <motion.div 
              variants={textVariants}
              className="relative h-24 md:h-32 lg:h-40 xl:h-48 w-80 md:w-96 lg:w-[30rem] xl:w-[36rem] mx-auto"
            >
              <Image
                src="/KTT_w.png"
                alt="KT 텔레캅 로고"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* CTA 버튼 */}
          <motion.div
            variants={buttonVariants}
            className="mt-8 md:mt-12"
          >
            <motion.button
              onClick={scrollToContact}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px 5px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-4 bg-white text-[#E60012] text-sm md:text-base font-bold rounded-full shadow-lg transition-all"
            >
              30초만에 무료로 견적 받기
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* 장식용 그라데이션 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

      {/* 움직이는 장식 요소들 */}
      <motion.div
        animate={{ 
          opacity: [0.2, 0.3, 0.2],
          scale: [0.8, 1, 0.8],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -right-32 top-1/4 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-2xl md:blur-3xl"
      />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute -left-32 bottom-1/4 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-2xl md:blur-3xl"
      />
    </div>
  );
}
