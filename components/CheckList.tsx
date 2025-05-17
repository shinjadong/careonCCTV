"use client"

import { HandMetal, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const checkItems = [
  {
    title: "자리를 비우기 불안하신가요?",
    description: "사장님이 없어도, AI실시간 감지기능의 KT 텔레캅이 꼼꼼하게 지켜드립니다"
  },
  {
    title: "요즘 보안 문제가 심각한 거, 알고 계셨나요?",
    description: "국내 유일, 'CCTV보안 자격증'을 취득한 전문가가 직접 관리해드려요."
  },
  {
    title: "CCTV, 뭘 골라야 할지 모르겠다고요?",
    description: "번거로운 것은 저희가 다 알아서! 맞춤 설치부터 관리까지 한번에"
  }
]


export default function CheckList() {
  return (
    <section id="cctv-check" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="title text-center mb-12">
          <HandMetal className="w-24 h-24 text-primary mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold">
            KT 텔레캅
            <br />
            <strong className="text-primary">이런 사장님들께 꼭 필요합니다!</strong>
          </h3>
        </div>

        <div className="content">
          <div className="grid gap-6 mb-12">
            {checkItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-start"
              >
                <CheckCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button className="go-btn bg-primary hover:bg-primary-dark text-white text-lg py-6 px-8">
                1분 상담만으로 걱정 뚝! 지금 바로 문의하세요
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

