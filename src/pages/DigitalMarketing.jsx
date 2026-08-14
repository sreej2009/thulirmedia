import SEOHead from '../components/layout/SEOHead'
import DMNavbar from '../dm/components/DMNavbar'
import DMHero from '../dm/sections/DMHero'
import DMServices from '../dm/sections/DMServices'
import DMEcosystem from '../dm/sections/DMEcosystem'
import DMAnalytics from '../dm/sections/DMAnalytics'
import DMProcess from '../dm/sections/DMProcess'
import DMFinalCTA from '../dm/sections/DMFinalCTA'

export default function DigitalMarketing() {
  return (
    <>
      <SEOHead
        path="/digital-marketing"
        title="Digital Marketing Services — Thulir Media"
        description="Thulir Media builds digital experiences, campaigns and growth strategies across Google Ads, Meta Ads, SEO, content, social, websites and apps — engineered to turn attention into growth."
      />
      <DMNavbar />
      <main className="relative bg-void">
        <DMHero />
        <DMServices />
        <DMEcosystem />
        <DMAnalytics />
        <DMProcess />
        <DMFinalCTA />
      </main>
    </>
  )
}
