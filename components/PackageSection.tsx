"use client"

import { Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface PackageItem {
  label: string
  icon: string
}

interface PackageProps {
  subtitle: string
  title: string
  items: PackageItem[]
  highlight: string
}

const Package = ({ subtitle, title, items, highlight }: PackageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300"
  >
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
      <p className="text-sm font-bold text-blue-100 mb-2">{subtitle}</p>
      <h3 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h3>
    </div>
    <div className="p-8 space-y-8 text-center">
      <ul className="grid grid-cols-2 gap-6">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex flex-col items-center p-8 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <div className="w-40 h-40 mb-4 relative">
              <Image
                src={item.icon}
                alt={item.label}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 160px"
              />
            </div>
            <span className="text-blue-700 font-medium text-center text-lg">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="pt-6 border-t border-gray-100">
        <p className="text-blue-600 font-extrabold text-2xl">{highlight}</p>
      </div>
    </div>
  </motion.div>
)

export default function PackageSection() {
  const packages: PackageProps[] = [
    {
      subtitle: "필요한 것만 딱!",
      title: "가성비 패키지",
      items: [
        {
          label: "인터넷 500M",
          icon: "https://miso-strapi-production.s3.ap-northeast-2.amazonaws.com/Group_3850_fc3aade228.png",
        },
        {
          label: "정수기",
          icon: "https://www.skmagic.com/content/images/products/water/water_purifier_all_in_one_01.png",
        },
        {
          label: "CCTV 2대",
          icon: "/AlarmSection/siren.gif",
        },
        {
          label: "인터넷 TV 48인치",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XXb18guHhpkxs04E6_qfJiVhoy3LadqKZg&s",
        },
      ],
      highlight: "현금 사은품 최대 78만원",
    },
    {
      subtitle: "필요한 것만 딱!",
      title: "테이블 오더 패키지",
      items: [
        {
          label: "인터넷 500M",
          icon: "https://miso-strapi-production.s3.ap-northeast-2.amazonaws.com/Group_3850_fc3aade228.png",
        },
        {
          label: "인터넷 TV 48인치",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XXb18guHhpkxs04E6_qfJiVhoy3LadqKZg&s",
        },
        {
          label: "정수기",
          icon: "https://www.skmagic.com/content/images/products/water/water_purifier_all_in_one_01.png",
        },
        {
          label: "CCTV 2대",
          icon: "/AlarmSection/siren.gif",
        },
        {
          label: "테이블오더",
          icon: "https://www.expos.co.kr/images/restaurant/table_order/sld/sld-dk-lg%201.png",
        },
      ],
      highlight: "현금 사은품 최대 83만원",
    },
    {
      subtitle: "오픈 준비 이제 끝!",
      title: "최대 혜택 패키지",
      items: [
        {
          label: "인터넷 500M",
          icon: "https://miso-strapi-production.s3.ap-northeast-2.amazonaws.com/Group_3850_fc3aade228.png",
        },
        {
          label: "인터넷 TV 48인치",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XXb18guHhpkxs04E6_qfJiVhoy3LadqKZg&s",
        },
        {
          label: "정수기",
          icon: "https://www.skmagic.com/content/images/products/water/water_purifier_all_in_one_01.png",
        },
        {
          label: "CCTV 2대",
          icon: "/AlarmSection/siren.gif",
        },
        {
          label: "포스기",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPQlLCoKKnWRPZeRCj0WLk3XBxP8GO1NSv7Q&s",
        },
        {
          label: "키오스크",
          icon: "https://www.lguplus.com/static/pc-contents/images/uhdc/shec/pp/sngl/20240523-091256-119-7X3Z47is.png",
        },
      ],
      highlight: "최대 혜택 합계 최대 93만원",
    },
  ]

  return (
    <section id="cctv-package" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="not-end text-center mb-8">
          <p className="text-xl font-bold text-blue-600">여기서 끝? 아니죠!</p>
        </div>
        <div className="title text-center mb-16">
          <div className="flex justify-center mb-6">
            <Clock className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-lg text-gray-600 mb-3">바쁜 사장님들 Pick!</p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            인터넷부터 포스까지
            <br />
            한 번에 해결해 드려요!
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          {packages.map((pkg, idx) => (
            <Package key={idx} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}

