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

import Hero from '../../services/branding/sections/Hero'
import InteractiveVisual from '../../services/branding/sections/InteractiveVisual'
import { meta, seo, introduction, whatWeDo, process, technology, useCases, metrics, whyUs, faq, cta } from '../../services/branding/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function Branding() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'Branding & Creative', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Branding & Creative', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="br-intro" {...introduction} accent={meta.accent} />
        <WhatWeDo id="br-whatwedo" {...whatWeDo} accent={meta.accent} />
        <InteractiveVisual />
        <ProcessRail id="br-process" eyebrow="How We Work" title="A system, built to last." steps={process} accent={meta.accent} />
        <TechEcosystem id="br-tech" {...technology} accent={meta.accent} />
        <UseCases id="br-usecases" {...useCases} accent={meta.accent} />
        <MetricsDashboard id="br-metrics" {...metrics} accent={meta.accent} />
        <WhyUs id="br-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="br-cta" {...cta} color={meta.accent} shape="icosahedron" />
      </main>
    </>
  )
}
