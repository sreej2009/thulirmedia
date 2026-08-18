import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { revealLines, revealWords } from '../../lib/textReveal'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import ClosingOrb from '../../services/shared/canvas/ClosingOrb'

export default function WhyThulir() {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealLines('[data-wt-title]', { start: 'top 80%' })
      const wordSplit = revealWords(bodyRef.current, { start: 'top 85%', end: 'top 45%' })

      gsap.from('[data-wt-cta]', {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 60%', once: true },
      })

      return () => {
        split?.revert()
        wordSplit?.revert()
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="why-thulir" ref={rootRef} className="relative overflow-hidden bg-void py-28 md:py-40">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[60vw] opacity-25 md:w-[45vw]">
        <SceneErrorBoundary>
          <ClosingOrb color="#f97316" shape="octahedron" reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-void/40 to-void" />
      </div>

      <div className="container-px relative z-10 max-w-3xl">
        <span className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          <span className="h-px w-8 bg-accent-soft" />
          Why Thulir Media
        </span>

        <h2 data-wt-title className="font-display text-[11vw] leading-[1.02] sm:text-6xl md:text-7xl">
          Creativity is only <span className="text-gradient">half the story.</span>
        </h2>

        <p ref={bodyRef} className="mt-8 max-w-xl text-lg leading-relaxed text-mist md:text-xl">
          Technology turns ideas into experiences. Strategy turns experiences into growth.
        </p>

        <div data-wt-cta className="mt-10">
          <Link
            to="/about"
            data-cursor="hover"
            data-cursor-text="Explore"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            Discover Thulir Media
            <span className="transition-transform duration-300" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
