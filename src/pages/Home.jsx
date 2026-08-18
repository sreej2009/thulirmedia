import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import ClosingCTA from '../services/shared/components/ClosingCTA'
import { buildOrganizationSchema, buildWebSiteSchema } from '../lib/seo'

import Hero from '../home/sections/Hero'
import ServicesJourney from '../home/sections/ServicesJourney'
import Ecosystem from '../home/sections/Ecosystem'
import FeaturedWork from '../home/sections/FeaturedWork'
import WhyThulir from '../home/sections/WhyThulir'

export default function Home() {
  return (
    <>
      <SEOHead
        path="/"
        title="Thulir Media — Digital Marketing, Web, App & Brand Studio"
        description="Thulir Media builds digital marketing, websites, apps, SEO, social content and brand identity — each as its own dedicated, immersive experience."
        jsonLd={[buildOrganizationSchema(), buildWebSiteSchema()]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <ServicesJourney />
        <Ecosystem />
        <FeaturedWork />
        <WhyThulir />
        <ClosingCTA
          id="home-cta"
          eyebrow="Let's Talk"
          titleLines={['Ready to', 'Grow?']}
          sub="Let's build something people can't ignore — pick a service to start, or tell us what you have in mind."
          primaryLabel="Start a Project"
          subject="Starting a project with Thulir Media"
          secondaryLabel="Explore Services"
          secondaryHref="#services-showcase"
          color="#a78bfa"
          shape="icosahedron"
        />
      </main>
    </>
  )
}
