import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'
import MagneticButton from '../../components/ui/MagneticButton'
import { MediaFrame } from './PlaceholderVisual'

export default function CaseStudyHero({ project }) {
  const rootRef = useRef(null)
  const visualRef = useRef(null)
  const isTouch = useIsTouch()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } })
      tl.from('[data-csh-eyebrow]', { y: 20, opacity: 0, duration: 0.8 })
        .from('[data-csh-line]', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.5')
        .from('[data-csh-meta]', { y: 16, opacity: 0, duration: 0.7 }, '-=0.4')
        .from('[data-csh-visual]', { y: 30, opacity: 0, scale: 0.96, duration: 1 }, '-=0.6')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleMove = (e) => {
    if (isTouch || !visualRef.current) return
    const rect = visualRef.current.parentElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    gsap.to(visualRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      transformPerspective: 1000,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    if (isTouch || !visualRef.current) return
    gsap.to(visualRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' })
  }

  const titleWords = project.title.split(' ')

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-void pb-16 pt-32 md:pt-40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-30 blur-3xl"
        style={{ background: `radial-gradient(60% 50% at 50% 0%, ${project.accent}, transparent 70%)` }}
      />

      <div className="container-px relative">
        <span data-csh-eyebrow className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em]" style={{ color: project.accent }}>
          <span className="h-px w-8" style={{ background: project.accent }} />
          {project.category}
        </span>

        <h1 className="max-w-4xl font-display text-[11vw] leading-[0.95] sm:text-[7.5vw] md:text-[5vw] lg:text-[4.2rem]">
          {titleWords.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-top">
              <span data-csh-line className="inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <div data-csh-meta className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mist">
          <span>{project.client}</span>
          <span aria-hidden="true">·</span>
          <span>{project.industry}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
        </div>
      </div>

      <div className="container-px relative mt-14">
        <div
          data-csh-visual
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative h-[50vh] w-full overflow-hidden rounded-2xl sm:h-[60vh] md:h-[70vh]"
          style={{ perspective: 1200 }}
        >
          <div ref={visualRef} className="h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
            <MediaFrame src={project.heroImage} accent={project.accent} frame={project.frame} alt={project.title} className="h-full" />
          </div>
        </div>
      </div>

      <div className="container-px mt-10 flex justify-end">
        <MagneticButton
          as="a"
          href="#cs-cta"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
        >
          Start a Similar Project
        </MagneticButton>
      </div>
    </section>
  )
}
