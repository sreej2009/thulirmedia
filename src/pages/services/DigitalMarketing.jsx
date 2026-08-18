import SEOHead from '../../components/layout/SEOHead'
import ServicesNav from '../../services/shared/components/ServicesNav'
import Introduction from '../../services/shared/components/Introduction'
import ProcessRail from '../../services/shared/components/ProcessRail'
import TechEcosystem from '../../services/shared/components/TechEcosystem'
import UseCases from '../../services/shared/components/UseCases'
import MetricsDashboard from '../../services/shared/components/MetricsDashboard'
import WhyUs from '../../services/shared/components/WhyUs'
import FAQAccordion from '../../services/shared/components/FAQAccordion'
import ClosingCTA from '../../services/shared/components/ClosingCTA'

import Hero from '../../services/digital-marketing/sections/Hero'
import WhatWeDo from '../../services/digital-marketing/sections/WhatWeDo'
import InteractiveVisual from '../../services/digital-marketing/sections/InteractiveVisual'
import { meta, seo, introduction, process, technology, useCases, metrics, whyUs, faq, cta } from '../../services/digital-marketing/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function DigitalMarketing() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'Digital Marketing', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Digital Marketing', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="dm-intro" {...introduction} accent={meta.accent} />
        <WhatWeDo />
        <InteractiveVisual />
        <ProcessRail id="dm-process" eyebrow="How We Work" title="A process built for momentum, not meetings." steps={process} accent={meta.accent} />
        <TechEcosystem id="dm-tech" {...technology} accent={meta.accent} />
        <UseCases id="dm-usecases" {...useCases} accent={meta.accent} />
        <MetricsDashboard id="dm-metrics" {...metrics} accent={meta.accent} />
        <WhyUs id="dm-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="dm-cta" {...cta} color={meta.accent} shape="icosahedron" />
      </main>
    </>
  )
}
