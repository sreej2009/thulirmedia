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

import Hero from '../../services/app-development/sections/Hero'
import InteractiveVisual from '../../services/app-development/sections/InteractiveVisual'
import { meta, seo, introduction, whatWeDo, process, technology, useCases, metrics, whyUs, faq, cta } from '../../services/app-development/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function AppDevelopment() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'App Development', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'App Development', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="ad-intro" {...introduction} accent={meta.accent} />
        <WhatWeDo id="ad-whatwedo" {...whatWeDo} accent={meta.accent} />
        <InteractiveVisual />
        <ProcessRail id="ad-process" eyebrow="How We Work" title="From idea to app store, step by step." steps={process} accent={meta.accent} />
        <TechEcosystem id="ad-tech" {...technology} accent={meta.accent} />
        <UseCases id="ad-usecases" {...useCases} accent={meta.accent} />
        <MetricsDashboard id="ad-metrics" {...metrics} accent={meta.accent} />
        <WhyUs id="ad-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="ad-cta" {...cta} color={meta.accent} shape="dodecahedron" />
      </main>
    </>
  )
}
