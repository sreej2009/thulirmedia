import { useParams, Navigate } from 'react-router-dom'
import SEOHead from '../../components/layout/SEOHead'
import ServicesNav from '../../services/shared/components/ServicesNav'
import ProcessRail from '../../services/shared/components/ProcessRail'
import WhatWeDo from '../../services/shared/components/WhatWeDo'
import TechEcosystem from '../../services/shared/components/TechEcosystem'
import ClosingCTA from '../../services/shared/components/ClosingCTA'

import CaseStudyHero from '../../work/components/CaseStudyHero'
import Overview from '../../work/components/Overview'
import Challenge from '../../work/components/Challenge'
import Gallery from '../../work/components/Gallery'
import ImpactGrid from '../../work/components/ImpactGrid'
import Testimonial from '../../work/components/Testimonial'
import NextProject from '../../work/components/NextProject'
import { getProjectBySlug, getAdjacentProject } from '../../work/data'
import { buildBreadcrumbSchema, buildCreativeWorkSchema } from '../../lib/seo'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return <Navigate to="/work" replace />
  }

  const next = getAdjacentProject(slug)

  return (
    <>
      <SEOHead
        path={`/work/${project.slug}`}
        title={`${project.title} — Case Study — Thulir Media`}
        description={project.description}
        jsonLd={[
          buildCreativeWorkSchema({
            name: project.title,
            description: project.description,
            path: `/work/${project.slug}`,
            category: project.category,
          }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        ]}
      />
      <ServicesNav />
      <main className="relative bg-void">
        <CaseStudyHero project={project} />
        <Overview project={project} />
        <Challenge project={project} />
        <ProcessRail
          id="cs-approach"
          eyebrow="The Approach"
          title="How we got there."
          steps={project.approach}
          accent={project.accent}
        />
        <WhatWeDo
          id="cs-built"
          eyebrow="What We Built"
          title="Inside the project."
          categories={project.deliverables}
          accent={project.accent}
        />
        <Gallery project={project} />
        <TechEcosystem
          id="cs-tech"
          eyebrow="Technology"
          title="What it's built on."
          items={project.technologies}
          accent={project.accent}
        />
        <ImpactGrid project={project} />
        <Testimonial project={project} />
        <ClosingCTA
          id="cs-cta"
          eyebrow="Let's Talk"
          titleLines={['Have a Project', 'in Mind?']}
          sub="Let's turn your next idea into something people remember."
          primaryLabel="Start a Project"
          subject={`Starting a project like "${project.title}" with Thulir Media`}
          secondaryLabel="See All Work"
          secondaryHref="/work"
          color={project.accent}
          shape="icosahedron"
        />
        <NextProject project={next} />
      </main>
    </>
  )
}
