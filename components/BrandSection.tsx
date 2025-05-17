import SKShieldsBrand from "./brands/SKShieldsBrand"
import KTGigaEyesBrand from "./brands/KTGigaEyesBrand"
import LGIntelligentBrand from "./brands/LGIntelligentBrand"

export default function BrandSection() {
  return (
    <section id="cctv-brand" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SKShieldsBrand />
        <KTGigaEyesBrand />
        <LGIntelligentBrand />
      </div>
    </section>
  )
}

