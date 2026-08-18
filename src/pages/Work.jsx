import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import ClosingCTA from '../services/shared/components/ClosingCTA'
import WorkHero from '../work/sections/WorkHero'
import WorkGrid from '../work/components/WorkGrid'
import { buildBreadcrumbSchema } from '../lib/seo'

export default function Work() {
  return (
    <>
      <SEOHead
        path="/work"
        title="Our Work & Case Studies | Thulir Media"
        description="Explore Thulir Media's work across website development, digital marketing, apps, SEO, social and brand identity — each project its own case study."
        jsonLd={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ])}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <WorkHero />
        <WorkGrid
          id="work-grid"
          eyebrow="The Work"
          title="Explore the projects."
          description="Filter by discipline, or browse everything we build."
        />
        <ClosingCTA
          id="work-cta"
          eyebrow="Let's Talk"
          titleLines={['Have a Project', 'in Mind?']}
          sub="Let's turn your next idea into something people remember."
          primaryLabel="Start a Project"
          subject="Starting a project with Thulir Media"
          color="#a78bfa"
          shape="icosahedron"
        />
      </main>
    </>
  )
}
