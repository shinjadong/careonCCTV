import AlarmSection from "@/components/AlarmSection"
import ReviewSection from "@/components/ReviewSection"
import Confidence from "@/components/Confidence"
import Service from "@/components/Service"
import CheckList from "@/components/CheckList"
import CharmingOffer from "@/components/CharmingOffer"
import EssentialBanner from "@/components/EssentialBanner"
import FAQSection from "@/components/FAQSection"
import ContactFormSimple from "@/components/ContactFormSimple"
import Footer from "@/components/Footer"
import FloatingButton from "@/components/FloatingButton"
import PageViewTracker from "@/components/PageViewTracker"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 페이지 로드 즉시 모든 데이터 수집 및 전송 */}
      <PageViewTracker />

      <main className="flex-grow">
        <ContactFormSimple />
        <AlarmSection />
        <EssentialBanner />
        <ReviewSection />
        <CheckList />
        <CharmingOffer />
        <Confidence />
        <Service />
        <FAQSection />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  )
}

