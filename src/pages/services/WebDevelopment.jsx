import SEOHead from '../../components/layout/SEOHead'
import ServicesNav from '../../services/shared/components/ServicesNav'
import Introduction from '../../services/shared/components/Introduction'
import TechEcosystem from '../../services/shared/components/TechEcosystem'
import UseCases from '../../services/shared/components/UseCases'
import WhyUs from '../../services/shared/components/WhyUs'
import FAQAccordion from '../../services/shared/components/FAQAccordion'
import ClosingCTA from '../../services/shared/components/ClosingCTA'

import Hero from '../../services/web-development/sections/Hero'
import BuildTypes from '../../services/web-development/sections/BuildTypes'
import EngineeringStandard from '../../services/web-development/sections/EngineeringStandard'
import Process from '../../services/web-development/sections/Process'
import Performance from '../../services/web-development/sections/Performance'
import { meta, seo, introduction, technology, useCases, whyUs, faq, cta } from '../../services/web-development/data'
import { buildServiceSchema, buildBreadcrumbSchema } from '../../lib/seo'

export default function WebDevelopment() {
  return (
    <>
      <SEOHead
        path={meta.path}
        title={seo.title}
        description={seo.description}
        jsonLd={[
          buildServiceSchema({ name: 'Website Development', description: seo.description, path: meta.path }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Website Development', path: meta.path },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <Hero />
        <Introduction id="wd-intro" {...introduction} accent={meta.accent} />
        <BuildTypes />
        <EngineeringStandard />
        <TechEcosystem id="wd-tech" {...technology} accent={meta.accent} />
        <Process />
        <UseCases id="wd-usecases" {...useCases} accent={meta.accent} />
        <Performance />
        <WhyUs id="wd-why" {...whyUs} accent={meta.accent} />
        <FAQAccordion id="faq" eyebrow="FAQ" title="Common questions." items={faq} accent={meta.accent} />
        <ClosingCTA id="wd-cta" {...cta} color={meta.accent} shape="octahedron" />
      </main>
    </>
  )
}
