import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import HeroShell from '../services/shared/components/HeroShell'
import Introduction from '../services/shared/components/Introduction'
import ProcessRail from '../services/shared/components/ProcessRail'
import WhyUs from '../services/shared/components/WhyUs'
import ClosingCTA from '../services/shared/components/ClosingCTA'

import EcosystemHeroScene from '../about/canvas/EcosystemHeroScene'
import Beliefs from '../about/sections/Beliefs'
import CreativeTech from '../about/sections/CreativeTech'
import WhatWeDo from '../about/sections/WhatWeDo'
import Team from '../about/sections/Team'
import Culture from '../about/sections/Culture'

import { seo, hero, story, howWeWork, whyThulir, finalCta } from '../about/data'
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
        <HeroShell id="about-hero" hero={hero} Scene={EcosystemHeroScene} />

        <Introduction id="about-story" {...story} accent="#a78bfa" />

        <Beliefs />

        <CreativeTech />

        <WhatWeDo />

        <ProcessRail id="about-how-we-work" eyebrow={howWeWork.eyebrow} title={howWeWork.title} description={howWeWork.description} steps={howWeWork.steps} accent="#a78bfa" />

        <WhyUs id="about-why" {...whyThulir} accent="#a78bfa" />

        <Team />

        <Culture />

        <ClosingCTA id="about-cta" {...finalCta} color="#a78bfa" shape="icosahedron" />
      </main>
    </>
  )
}
