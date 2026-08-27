import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion, useIsTouch } from '../../hooks/useIsMobile'
import { revealLines } from '../../lib/textReveal'
import MagneticButton from '../../components/ui/MagneticButton'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import CreativeArchiveScene from '../canvas/CreativeArchiveScene'
import { MediaFrame } from '../../work/components/PlaceholderVisual'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { projects, filters as workFilters } from '../../work/data'

// Premium single-showcase Work section — one large featured project (not a
// card grid) with a category filter and a right-hand project index driving
// it. Real project data throughout; no invented client results.

const FILTER_LABELS = {
  all: 'All Work',
  digital: 'Digital Marketing',
  web: 'Web Development',
  app: 'App Development',
  seo: 'SEO',
  social: 'Social Media',
  branding: 'Branding',
  media: 'Content & Media',
}

function CategoryFilter({ active, onChange }) {
  const listRef = useRef(null)
  const indicatorRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return
    const btn = list.querySelector(`[data-wf-filter="${active}"]`)
    if (!btn) return
    const listRect = list.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    gsap.to(indicator, {
      x: btnRect.left - listRect.left + list.scrollLeft,
      width: btnRect.width,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [active])

  return (
    <div
      ref={listRef}
      className="relative flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={indicatorRef}
        className="pointer-events-none absolute left-0 top-0 h-full rounded-full border border-accent-soft/50 bg-accent/10"
        style={{ width: 0 }}
      />
      {workFilters.map((f) => (
        <button
          key={f.key}
          type="button"
          data-wf-filter={f.key}
          data-cursor="hover"
          onClick={() => onChange(f.key)}
          className={`relative z-10 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
            active === f.key ? 'border-transparent text-ink' : 'border-line text-mist hover:border-accent-soft/40 hover:text-ink'
          }`}
        >
          {FILTER_LABELS[f.key] || f.label}
        </button>
      ))}
    </div>
  )
}

export default function FeaturedWork() {
  const rootRef = useRef(null)
  const headingWrapRef = useRef(null)
  const titleRef = useRef(null)
  const archiveWrapRef = useRef(null)
  const filterWrapRef = useRef(null)
  const showcaseWrapRef = useRef(null)
  const visualScrollRef = useRef(null)
  const visualWrapRef = useRef(null)
  const visualInnerRef = useRef(null)
  const visualBgRef = useRef(null)
  const progressLineRef = useRef(null)
  const coreProgressRef = useRef(0)
  const tiltRefs = useRef({})

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeIndex, setActiveIndex] = useState(0)

  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useIsTouch()
  const navigate = useNavigate()

  const navItems = useMemo(
    () => (activeFilter === 'all' ? projects : projects.filter((p) => p.filterKeys.includes(activeFilter))),
    [activeFilter]
  )
  const targetProject = navItems[Math.min(activeIndex, Math.max(navItems.length - 1, 0))] ?? null
  const [displayedProject, setDisplayedProject] = useState(targetProject)

  useEffect(() => {
    setActiveIndex(0)
  }, [activeFilter])

  // Entrance choreography: heading reveals, archive object fades in,
  // filter appears, showcase enters with depth, nav index staggers in.
  // The nav items get their own independent reveal (rather than a tween
  // nested inside their ancestor showcaseWrapRef's own opacity tween) so
  // the two opacity animations on parent/child don't compound and stall.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealLines(titleRef.current, { start: 'top 78%' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true } })
      tl.from('[data-wf-eyebrow]', { opacity: 0, x: -16, duration: 0.6, ease: 'power2.out' }, 0)
        .from('[data-wf-desc]', { opacity: 0, y: 14, duration: 0.7, ease: 'power2.out' }, 0.15)
        .from('[data-wf-viewall]', { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' }, 0.2)
        .from(archiveWrapRef.current, { opacity: 0, scale: 0.85, duration: 1, ease: 'power3.out' }, 0.2)
        .from(filterWrapRef.current, { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out' }, 0.4)
        .from(showcaseWrapRef.current, { opacity: 0, y: 34, scale: 0.97, duration: 0.9, ease: 'power3.out' }, 0.5)

      gsap.from('[data-wf-navitem]', {
        opacity: 0,
        x: 16,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 65%', once: true },
      })

      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Continuous scroll movement + carry-through into the next section instead
  // of a flat fade — the visual keeps drifting/scaling for the whole section
  // height, so it's already "moving forward" by the time it scrolls away.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          coreProgressRef.current = self.progress
        },
      })
      if (!reducedMotion) {
        gsap.to(visualScrollRef.current, {
          yPercent: -6,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  // Cinematic project-switch: current visual recedes in depth, content swaps
  // mid-transition, then the new project reveals forward.
  useEffect(() => {
    if (!targetProject || targetProject.slug === displayedProject?.slug) {
      if (targetProject && !displayedProject) setDisplayedProject(targetProject)
      return
    }
    if (reducedMotion) {
      setDisplayedProject(targetProject)
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.to(visualInnerRef.current, { scale: 0.92, z: -60, opacity: 0.25, duration: 0.26, ease: 'power2.in' })
        .to('[data-wf-text]', { y: -10, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' }, '<')
        .add(() => setDisplayedProject(targetProject))
        .set(visualInnerRef.current, { scale: 1.06, z: 40 })
        .to(visualInnerRef.current, { scale: 1, z: 0, opacity: 1, duration: 0.42, ease: 'power3.out' })
        .set('[data-wf-text]', { y: 10 })
        .to('[data-wf-text]', { y: 0, opacity: 1, duration: 0.36, stagger: 0.035, ease: 'power3.out' }, '<0.04')
    })
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProject?.slug])

  // Animate the bottom progress line to the active project's share of the list.
  useEffect(() => {
    if (!progressLineRef.current || navItems.length === 0) return
    gsap.to(progressLineRef.current, {
      width: `${((activeIndex + 1) / navItems.length) * 100}%`,
      duration: 0.5,
      ease: 'power3.out',
    })
  }, [activeIndex, navItems.length])

  useEffect(() => {
    if (!visualInnerRef.current || !visualBgRef.current || !visualWrapRef.current) return
    tiltRefs.current = {
      rotY: gsap.quickTo(visualWrapRef.current, 'rotateY', { duration: 0.6, ease: 'power2.out' }),
      rotX: gsap.quickTo(visualWrapRef.current, 'rotateX', { duration: 0.6, ease: 'power2.out' }),
      fgX: gsap.quickTo(visualInnerRef.current, 'x', { duration: 0.6, ease: 'power2.out' }),
      fgY: gsap.quickTo(visualInnerRef.current, 'y', { duration: 0.6, ease: 'power2.out' }),
      bgX: gsap.quickTo(visualBgRef.current, 'x', { duration: 0.9, ease: 'power2.out' }),
      bgY: gsap.quickTo(visualBgRef.current, 'y', { duration: 0.9, ease: 'power2.out' }),
    }
  }, [])

  const handleVisualMove = (e) => {
    if (isTouch || reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    const r = tiltRefs.current
    r.rotY?.(x * 5)
    r.rotX?.(-y * 5)
    r.fgX?.(x * 14)
    r.fgY?.(y * 10)
    r.bgX?.(x * 6)
    r.bgY?.(y * 4)
  }

  const handleVisualLeave = () => {
    const r = tiltRefs.current
    r.rotY?.(0)
    r.rotX?.(0)
    r.fgX?.(0)
    r.fgY?.(0)
    r.bgX?.(0)
    r.bgY?.(0)
  }

  const step = (dir) => {
    if (navItems.length <= 1) return
    setActiveIndex((i) => (i + dir + navItems.length) % navItems.length)
  }

  const handleCaseStudyClick = async (e) => {
    e.preventDefault()
    if (!displayedProject) return
    const rect = visualInnerRef.current?.getBoundingClientRect()
    if (rect) setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    await coverTransition(displayedProject.accent)
    navigate(`/work/${displayedProject.slug}`)
  }

  const handleViewAllClick = async (e) => {
    e.preventDefault()
    await coverTransition('#a78bfa')
    navigate('/work')
  }

  if (!displayedProject) return null

  return (
    <section id="featured-work" ref={rootRef} className="relative overflow-hidden bg-void py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(55% 60% at 65% 0%, #7c5cd633, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#c4b5fd 1px, transparent 1px), linear-gradient(90deg, #c4b5fd 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div ref={headingWrapRef} className="container-px relative">
        <div ref={archiveWrapRef} className="pointer-events-none absolute -right-4 -top-6 h-56 w-56 sm:h-72 sm:w-72 md:-right-2 md:h-80 md:w-80">
          <SceneErrorBoundary>
            <CreativeArchiveScene progressRef={coreProgressRef} reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
        </div>

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span data-wf-eyebrow className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
              <span className="h-px w-6 bg-accent-soft" />
              Selected Work
            </span>
            <h2 ref={titleRef} className="font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              What we
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(90deg, #e9d5ff, #a78bfa 55%, #7c5cd6)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                create.
              </span>
            </h2>
            <p data-wf-desc className="mt-5 max-w-lg text-base leading-relaxed text-mist md:text-lg">
              A few of the projects behind the craft — filter by discipline or explore the full archive.
            </p>
          </div>
          <MagneticButton
            as="a"
            href="/work"
            onClick={handleViewAllClick}
            data-wf-viewall
            className="mb-1 inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            View All Work <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>

        <div ref={filterWrapRef} className="relative mt-10">
          <CategoryFilter active={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      <div ref={showcaseWrapRef} className="container-px relative mt-10 md:mt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div className="flex flex-col gap-y-5">
            <div data-wf-text className="order-1 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-mist">
              <span className="h-px w-8" style={{ background: displayedProject.accent }} />
              Featured Project
              <span className="font-display text-lg" style={{ color: displayedProject.accent }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="order-4 lg:order-2">
              <div ref={visualScrollRef} className="relative">
                <div
                  ref={visualWrapRef}
                  onMouseMove={handleVisualMove}
                  onMouseLeave={handleVisualLeave}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-lg"
                  style={{ perspective: 1400 }}
                >
                  <div
                    ref={visualBgRef}
                    className="pointer-events-none absolute -inset-10 -z-10 opacity-70 blur-2xl"
                    style={{ background: `radial-gradient(60% 60% at 30% 20%, ${displayedProject.accent}40, transparent 70%)` }}
                  />
                  <div ref={visualInnerRef} className="h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                    <MediaFrame
                      src={displayedProject.heroImage}
                      accent={displayedProject.accent}
                      frame={displayedProject.frame}
                      alt={displayedProject.title}
                      className="h-full"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-white/10" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void/60 to-transparent" />
                </div>
              </div>
            </div>

            <h3 data-wf-text className="order-2 font-display text-3xl leading-[1.05] text-ink sm:text-4xl md:text-5xl lg:order-3">
              {displayedProject.title}
            </h3>

            <div className="order-3 lg:order-4">
              <p data-wf-text className="text-xs uppercase tracking-[0.16em] text-mist">
                {displayedProject.category} · {displayedProject.year}
              </p>
              <p data-wf-text className="mt-3 max-w-lg text-sm leading-relaxed text-mist md:text-base">
                {displayedProject.description}
              </p>
            </div>

            <div data-wf-text className="order-5 flex flex-wrap gap-2">
              {displayedProject.services.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-mist">
                  {s}
                </span>
              ))}
            </div>

            <a
              data-wf-text
              href={`/work/${displayedProject.slug}`}
              onClick={handleCaseStudyClick}
              data-cursor="hover"
              data-cursor-text="View"
              className="group order-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform duration-400 hover:translate-x-0.5"
            >
              <span className="relative">
                View Case Study
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-400 group-hover:w-full" />
              </span>
              <span aria-hidden="true" className="transition-transform duration-400 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </div>

          <div className="lg:border-l lg:border-line lg:pl-10">
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-mist">Project Index</p>
            <div className="flex flex-col">
              {navItems.map((p, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={p.slug}
                    type="button"
                    data-wf-navitem
                    data-cursor="hover"
                    onClick={() => setActiveIndex(i)}
                    className="group flex items-center gap-3 border-t border-line py-3 text-left first:border-t-0"
                  >
                    <span
                      className={`flex flex-1 items-center gap-3 transition-opacity duration-400 ${
                        isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-85'
                      }`}
                    >
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm border border-line">
                        {p.heroImage ? (
                          <img src={p.heroImage} alt="" loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.accent}55, #0a0a0c 85%)` }} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[11px]" style={{ color: isActive ? p.accent : 'var(--color-mist)' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`truncate font-medium transition-all duration-300 ${isActive ? 'text-[15px] text-ink' : 'text-sm text-mist'}`}
                          >
                            {p.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.14em] text-mist">{p.category}</span>
                      </span>
                      <span className="h-full w-px shrink-0 self-stretch transition-colors duration-300" style={{ background: isActive ? p.accent : 'transparent' }} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 lg:mt-12 lg:items-start">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={navItems.length <= 1}
              data-cursor="hover"
              aria-label="Previous project"
              className="text-mist transition-colors duration-300 hover:text-ink disabled:opacity-30"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              {navItems.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  data-cursor="hover"
                  className="font-mono text-xs transition-colors duration-300"
                  style={{ color: i === activeIndex ? p.accent : 'var(--color-mist)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={navItems.length <= 1}
              data-cursor="hover"
              aria-label="Next project"
              className="text-mist transition-colors duration-300 hover:text-ink disabled:opacity-30"
            >
              →
            </button>
          </div>
          <div className="relative h-px w-full max-w-xs overflow-hidden bg-line">
            <div ref={progressLineRef} className="absolute inset-y-0 left-0 bg-accent-soft" style={{ width: 0 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
