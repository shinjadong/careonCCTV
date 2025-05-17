import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "설치비용은 얼마인가요?",
      answer:
        "기본적으로 설치비는 10만원 내외의 출장비가 소요됩니다. 하지만 특별 프로모션으로 설치비 전액을 지원해드립니다. 지금 신청하시면 설치비 무료 + 현금 지원 혜택을 모두 받으실 수 있습니다.",
    },
    {
      question: "설치 소요 시간은 얼마나 되나요?",
      answer:
        "일반적으로 2-3시간 정도 소요되며, 설치 환경에 따라 다소 차이가 있을 수 있습니다. 전문 설치기사가 방문하여 최적의 위치에 설치해 드립니다.",
    },
    {
      question: "A/S는 어떻게 받을 수 있나요?",
      answer: "24시간 고객센터를 통해 A/S 접수가 가능하며, 전문 기술진이 신속하게 방문하여 무상으로 처리해 드립니다.",
    },
  ]

  return (
    <section id="faq" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">자주 묻는 질문</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

