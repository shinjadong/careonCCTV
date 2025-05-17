"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingButton() {
  const scrollToContact = () => {
    const element = document.getElementById('cctv-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="relative inline-block">
        {/* 깜빡이는 pulsating 효과 */}
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          className="absolute inset-0 rounded-full bg-blue-600"
        />
        <Button 
          onClick={scrollToContact}
          className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full"
        >
          <span>무료로 견적 받기</span>
          <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </div>
    </div>
  );
}
