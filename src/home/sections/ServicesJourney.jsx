import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks/useIsMobile'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import ServicesJourneyScene from '../canvas/ServicesJourneyScene'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { servicesRegistry } from '../../services/shared/registry'

const WORDS = [
  ['Data', 'Traffic', 'Leads', 'Growth'],
  ['Wireframe', 'Design', 'Code', 'Live'],
  ['Idea', 'UI/UX', 'API', 'App'],
  ['Search', 'Crawl', 'Index', 'Rank'],
  ['Idea', 'Create', 'Publish', 'Grow'],
  ['Idea', 'Identity', 'Design', 'Brand'],
]

const NODES = [
  ['Google Ads', 'Meta Ads', 'SEO', 'Social', 'Content', 'Analytics', 'Leads'],
  ['Wireframes', 'UI Kit', 'React', 'API', 'CMS', 'Hosting', 'Launch'],
  ['iOS', 'Android', 'React Native', 'Auth', 'Push', 'API', 'Store'],
  ['Keywords', 'Crawlers', 'Backlinks', 'Schema', 'Rankings', 'Traffic', 'Leads'],
  ['Reels', 'Stories', 'Posts', 'Comments', 'Shares', 'Calendar', 'Engagement'],
  ['Logo', 'Typography', 'Color', 'Layout', 'Campaign', 'Guidelines', 'Identity'],
]

const CHAPTERS = servicesRegistry.map((s, i) => ({
  ...s,
  number: String(i + 1).padStart(2, '0'),
  words: WORDS[i],
  nodes: NODES[i],
}))

export default function ServicesJourney() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const navRef = useRef(null)
  const progressLineRef = useRef(null)
  const wordsRef = useRef(null)
  const linkRef = useRef(null)
  const progressRef = useRef(0)
  const stRef = useRef(null)

  const [activeChapter, setActiveChapter] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const chapter = CHAPTERS[activeChapter]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) return

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=500%',
        pin: pinRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const idx = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length))
          setActiveChapter((prev) => (prev !== idx ? idx : prev))
          if (progressLineRef.current) progressLineRef.current.style.transform = `scaleY(${self.progress})`
        },
      })
      stRef.current = st
    }, rootRef)
    return () => ctx.revert()
  }, [isMobile])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-sj-copy]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.04 }
      )
      if (wordsRef.current) {
        const words = wordsRef.current.querySelectorAll('[data-sj-word]')
        gsap.fromTo(
          words,
          { opacity: 0.25 },
          { opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
        )
      }
    })
    return () => ctx.revert()
  }, [activeChapter])

  const handleNavClick = (index) => {
    if (isMobile) {
      document.getElementById(`sj-mobile-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const st = stRef.current
    if (!st) return
    const target = st.start + (st.end - st.start) * ((index + 0.02) / CHAPTERS.length)
    window.__lenis?.scrollTo(target)
  }

  const handleExplore = async (e) => {
    e.preventDefault()
    const rect = linkRef.current?.getBoundingClientRect()
    if (rect) setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    await coverTransition(chapter.accent)
    navigate(chapter.path)
  }

  if (isMobile) {
    return <ServicesJourneyMobile chapters={CHAPTERS} reducedMotion={reducedMotion} />
  }

  return (
    <section id="services-showcase" ref={rootRef} className="relative bg-void">
      <div ref={pinRef} className="relative h-svh w-full overflow-hidden">
        <SceneErrorBoundary>
          <ServicesJourneyScene chapters={CHAPTERS} progressRef={progressRef} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50" />

        {/* left navigation */}
        <nav ref={navRef} className="container-px absolute inset-y-0 left-0 z-10 flex w-full max-w-md flex-col justify-center gap-1">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">Services</p>
          {CHAPTERS.map((c, i) => {
            const isActive = i === activeChapter
            return (
              <button
                key={c.path}
                type="button"
                onClick={() => handleNavClick(i)}
                data-cursor="hover"
                className="group flex items-center gap-4 py-2.5 text-left transition-all duration-500"
                style={{ transform: isActive ? 'translateX(6px)' : 'translateX(0)' }}
              >
                <span
                  className="font-mono text-xs transition-colors duration-500"
                  style={{ color: isActive ? c.accent : 'var(--color-mist)' }}
                >
                  {c.number}
                </span>
                <span className="relative">
                  <span
                    className="block font-medium transition-all duration-500"
                    style={{
                      color: isActive ? 'var(--color-ink)' : 'var(--color-mist)',
                      fontSize: isActive ? '1.15rem' : '0.95rem',
                      opacity: isActive ? 1 : 0.55,
                    }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-500"
                    style={{ width: isActive ? '100%' : '0%', background: c.accent }}
                  />
                </span>
              </button>
            )
          })}

          <div className="mt-8 flex items-center gap-3 text-xs text-mist">
            <span className="font-mono">{chapter.number} / {String(CHAPTERS.length).padStart(2, '0')}</span>
            <span className="relative h-16 w-px overflow-hidden bg-line">
              <span
                ref={progressLineRef}
                className="absolute inset-0 origin-top bg-accent-soft"
                style={{ transform: 'scaleY(0)' }}
              />
            </span>
          </div>
        </nav>

        {/* right side content overlay */}
        <div className="container-px absolute inset-y-0 right-0 z-10 flex w-full max-w-lg flex-col justify-end pb-16 text-right md:pb-20">
          <p data-sj-copy className="text-[11px] uppercase tracking-[0.2em]" style={{ color: chapter.accent }}>
            {chapter.world}
          </p>
          <h3 data-sj-copy className="mt-2 font-display text-3xl text-ink md:text-5xl">
            {chapter.label}
          </h3>
          <p data-sj-copy className="mt-4 max-w-md self-end text-sm leading-relaxed text-mist md:text-base">
            {chapter.blurb}
          </p>

          <div ref={wordsRef} data-sj-copy className="mt-5 flex flex-wrap justify-end gap-x-3 gap-y-1">
            {chapter.words.map((w, i) => (
              <span key={w} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-mist" data-sj-word>
                {w}
                {i < chapter.words.length - 1 && <span aria-hidden="true">→</span>}
              </span>
            ))}
          </div>

          <a
            ref={linkRef}
            href={chapter.path}
            onClick={handleExplore}
            data-cursor="hover"
            data-cursor-text="Explore"
            data-sj-copy
            className="mt-6 inline-flex items-center justify-end gap-2 self-end text-sm font-medium text-ink"
          >
            Explore {chapter.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

// Mobile can't pin (per the brief) and must stay to a single canvas (per
// the performance requirement) — so one canvas sits sticky near the top of
// the viewport, and its progress is driven by a normal (non-pinned) scrub
// across the whole stacked section, while six lightweight text chapters
// scroll past underneath it. Same continuous world, mobile-appropriate
// scroll mechanics.
function ServicesJourneyMobile({ chapters, reducedMotion }) {
  const rootRef = useRef(null)
  const progressRef = useRef(0)
  const progressLineRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 20%',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const idx = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length))
          setActiveChapter((prev) => (prev !== idx ? idx : prev))
          if (progressLineRef.current) progressLineRef.current.style.transform = `scaleY(${self.progress})`
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [chapters.length])

  const handleExplore = (chapter) => async (e) => {
    e.preventDefault()
    await coverTransition(chapter.accent)
    navigate(chapter.path)
  }

  const active = chapters[activeChapter]

  return (
    <section id="services-showcase" ref={rootRef} className="relative bg-void py-20">
      <div className="container-px mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">Services</p>
        <h2 className="mt-3 font-display text-3xl text-ink">Six worlds. One standard of craft.</h2>
      </div>

      <div className="sticky top-20 z-10 mb-2 bg-void pb-2">
        <div className="container-px flex items-center gap-3 pb-3 text-xs text-mist">
          <span className="font-mono">{active.number} / {String(chapters.length).padStart(2, '0')}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span ref={progressLineRef} className="absolute inset-0 origin-left bg-accent-soft" style={{ transform: 'scaleY(0)' }} />
          </span>
          <span style={{ color: active.accent }}>{active.label}</span>
        </div>
        <div className="relative mx-4 h-[38vh] overflow-hidden rounded-2xl border border-line sm:mx-6">
          <SceneErrorBoundary>
            <ServicesJourneyScene chapters={chapters} progressRef={progressRef} reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/10" />
        </div>
      </div>

      <div className="mt-10">
        {chapters.map((c) => (
          <div key={c.path} className="container-px border-t border-line py-10 first:border-t-0">
            <p className="text-xs uppercase tracking-[0.15em]" style={{ color: c.accent }}>
              {c.number} · {c.world}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink">{c.label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">{c.blurb}</p>
            <a
              href={c.path}
              onClick={handleExplore(c)}
              data-cursor="hover"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink"
            >
              Explore {c.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
