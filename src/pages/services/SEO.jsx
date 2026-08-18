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

import Hero from '../../services/seo/sections/Hero'
import InteractiveVisual from '../../services/seo/sections/InteractiveVisual'
import { meta, seo, introduction, whatWeDo, process, technology, useCases, metrics, whyUs, faq, cta } from '../../services/seo/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function SEO() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'SEO', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'SEO', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="seo-intro" {...introduction} accent={meta.accent} />
        <WhatWeDo id="seo-whatwedo" {...whatWeDo} accent={meta.accent} />
        <InteractiveVisual />
        <ProcessRail id="seo-process" eyebrow="How We Work" title="A system, not a one-time audit." steps={process} accent={meta.accent} />
        <TechEcosystem id="seo-tech" {...technology} accent={meta.accent} />
        <UseCases id="seo-usecases" {...useCases} accent={meta.accent} />
        <MetricsDashboard id="seo-metrics" {...metrics} accent={meta.accent} />
        <WhyUs id="seo-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="seo-cta" {...cta} color={meta.accent} shape="icosahedron" />
      </main>
    </>
  )
}
