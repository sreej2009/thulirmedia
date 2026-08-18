import SEOHead from '../../components/layout/SEOHead'
import ServicesNav from '../../services/shared/components/ServicesNav'
import Introduction from '../../services/shared/components/Introduction'
import WhatWeDo from '../../services/shared/components/WhatWeDo'
import ProcessRail from '../../services/shared/components/ProcessRail'
import TechEcosystem from '../../services/shared/components/TechEcosystem'
import UseCases from '../../services/shared/components/UseCases'
import MetricsDashboard from '../../services/shared/components/MetricsDashboard'
import WhyUs from '../../services/shared/components/WhyUs'
import FAQAccordion from '../../services/shared/components/FAQAccordion'
import ClosingCTA from '../../services/shared/components/ClosingCTA'

import Hero from '../../services/social-media/sections/Hero'
import InteractiveVisual from '../../services/social-media/sections/InteractiveVisual'
import { meta, seo, introduction, whatWeDo, process, technology, useCases, metrics, whyUs, faq, cta } from '../../services/social-media/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function SocialMedia() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'Social Media & Content', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Social Media & Content', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="sm-intro" {...introduction} accent={meta.accent} />
        <WhatWeDo id="sm-whatwedo" {...whatWeDo} accent={meta.accent} />
        <InteractiveVisual />
        <ProcessRail id="sm-process" eyebrow="How We Work" title="A content system, not a scramble." steps={process} accent={meta.accent} />
        <TechEcosystem id="sm-tech" {...technology} accent={meta.accent} />
        <UseCases id="sm-usecases" {...useCases} accent={meta.accent} />
        <MetricsDashboard id="sm-metrics" {...metrics} accent={meta.accent} />
        <WhyUs id="sm-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="sm-cta" {...cta} color={meta.accent} shape="octahedron" />
      </main>
    </>
  )
}
