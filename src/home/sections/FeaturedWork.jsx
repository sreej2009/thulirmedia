import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import SectionHeading from '../../components/ui/SectionHeading'
import MagneticButton from '../../components/ui/MagneticButton'
import { MediaFrame } from '../../work/components/PlaceholderVisual'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { projects } from '../../work/data'

const featured = projects.filter((p) => p.featured).slice(0, 4)
const shown = featured.length >= 3 ? featured : projects.slice(0, 4)

function ProjectTile({ project, large, index }) {
  const cardRef = useRef(null)
  const visualRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(visualRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: cardRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
    }, cardRef)
    return () => ctx.revert()
  }, [])

  const handleClick = async (e) => {
    e.preventDefault()
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    await coverTransition(project.accent)
    navigate(`/work/${project.slug}`)
  }

  return (
    <a
      ref={cardRef}
      href={`/work/${project.slug}`}
      onClick={handleClick}
      data-cursor="hover"
      data-cursor-text="View"
      data-fw-reveal
      className={`group relative block overflow-hidden rounded-2xl border border-line ${large ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]'}`}
    >
      <div ref={visualRef} className="absolute inset-[-6%]">
        <MediaFrame src={project.heroImage} accent={project.accent} frame={project.frame} alt={project.title} className="h-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

      <span className="pointer-events-none absolute right-5 top-5 font-display text-3xl text-white/15">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: project.accent }}>
          {project.category}
        </p>
        <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{project.title}</h3>
        <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-mist sm:block">{project.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-ink opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
          View Case Study <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  )
}

export default function FeaturedWork() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-fw-reveal]', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="featured-work" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Selected Work" title="What we create." description="A few of the projects behind the craft — filter by discipline or explore the full archive." />
        <MagneticButton
          as="a"
          href="/work"
          className="mb-1 inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          View All Work <span aria-hidden="true">→</span>
        </MagneticButton>
      </div>

      <div className="container-px mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {shown.map((project, i) => (
          <div key={project.slug} className={i % 3 === 0 ? 'sm:col-span-2' : ''}>
            <ProjectTile project={project} large={i % 3 === 0} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
