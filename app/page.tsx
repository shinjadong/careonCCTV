import AlarmSection from "@/components/AlarmSection"
import ReviewSection from "@/components/ReviewSection"
import Diffrents from "@/components/Diffrents"
import Confidence from "@/components/Confidence"
import Service from "@/components/Service"
import CheckList from "@/components/CheckList"
import BrandSection from "@/components/BrandSection"
import CharmingOffer from "@/components/CharmingOffer"
// Essential 컴포넌트 제거
import EssentialBanner from "@/components/EssentialBanner"
import FAQSection from "@/components/FAQSection"
import ContactFormSimple from "@/components/ContactFormSimple"
import Footer from "@/components/Footer"
import FloatingButton from "@/components/FloatingButton"
import FeatureExplanation from "@/components/FeatureExplanation"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

