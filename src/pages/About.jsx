import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import Introduction from '../services/shared/components/Introduction'
import WhyUs from '../services/shared/components/WhyUs'
import ClosingCTA from '../services/shared/components/ClosingCTA'

import StudioHero from '../about/sections/StudioHero'
import Philosophy from '../about/sections/Philosophy'
import Beliefs from '../about/sections/Beliefs'
import CreativeTech from '../about/sections/CreativeTech'
import HowWeWork from '../about/sections/HowWeWork'
import WhatWeDo from '../about/sections/WhatWeDo'
import Team from '../about/sections/Team'
import Culture from '../about/sections/Culture'

import { seo, story, whyThulir, finalCta } from '../about/data'
import { buildBreadcrumbSchema } from '../lib/seo'

export default function About() {
  return (
    <>
      <SEOHead
        path="/about"
        title={seo.title}
        description={seo.description}
        jsonLd={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <StudioHero />

        <Introduction id="about-story" {...story} accent="#a78bfa" />

        <Philosophy />

        <CreativeTech />

        <HowWeWork />

        <WhatWeDo />

        <Beliefs />

        <WhyUs id="about-why" {...whyThulir} accent="#a78bfa" />

        <Team />

        <Culture />

        <ClosingCTA id="about-cta" {...finalCta} color="#a78bfa" shape="icosahedron" />
      </main>
    </>
  )
}
