"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Service() {
  const [isImageVisible, setIsImageVisible] = useState(false)

  const serviceImages = [
    { src: "https://cdn.ajd.kr/images/platform/landing/cctv/service_1_mo.webp", alt: "화질" },
    { src: "https://cdn.ajd.kr/images/platform/landing/cctv/service_2_mo.webp", alt: "기능" },
    { src: "https://cdn.ajd.kr/images/platform/landing/cctv/service_3_mo.webp", alt: "설치" },
    { src: "https://cdn.ajd.kr/images/platform/landing/cctv/service_4_mo.webp", alt: "서비스" },
  ]

  return (
    <section id="cctv-service" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="title text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            놓치지 마세요.
            <br />
            <span className="text-blue-600">품질? 당연히 최고여야죠.</span>
          </h2>
        </div>
        <div className="hidden">
          <Button 
            onClick={() => setIsImageVisible(!isImageVisible)}
            className="bg-primary hover:bg-primary/90 text-white text-xl py-6 px-8 rounded-lg"
          >
            현시점 최고의 품질
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
                <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceImages.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={716}
                        height={318}
                        className="rounded-lg shadow-md"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

