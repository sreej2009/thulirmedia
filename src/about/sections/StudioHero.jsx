import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks/useIsMobile'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import MagneticButton from '../../components/ui/MagneticButton'
import StudioCoreScene from '../canvas/StudioCoreScene'
import { hero } from '../data'

const PHASES = ['Idea', 'Strategy', 'Creative', 'Technology', 'Experience', 'Thulir Media']

export default function StudioHero() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const phaseLabelRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } })
      tl.from('[data-sh-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-sh-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.6')
        .from('[data-sh-tag]', { y: 16, opacity: 0, duration: 0.7 }, '-=0.55')
        .from('[data-sh-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.55')
        .from('[data-sh-cta]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) {
        if (!reducedMotion) {
          gsap.to(progressRef, { current: 1, duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true })
        } else {
          progressRef.current = 0.6
        }
        return
      }
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=280%',
        pin: pinRef.current,
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const idx = Math.min(PHASES.length - 1, Math.floor(self.progress * PHASES.length))
          if (phaseLabelRef.current && phaseLabelRef.current.textContent !== PHASES[idx]) {
            phaseLabelRef.current.textContent = PHASES[idx]
          }
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [isMobile, reducedMotion])

  return (
    <section id="about-hero" ref={rootRef} className="relative bg-void">
      <div ref={pinRef} className="relative flex min-h-svh w-full items-center overflow-hidden">
        <SceneErrorBoundary>
          <StudioCoreScene progressRef={progressRef} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void/75 via-void/20 to-transparent" />

        <div className="container-px relative z-10 w-full pt-20">
          <span data-sh-eyebrow className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
            <span className="h-px w-8 bg-accent-soft" />
            {hero.eyebrow}
          </span>

          <h1 className="max-w-2xl font-display text-[13vw] leading-[0.96] sm:text-[9vw] md:text-[6.5vw] lg:text-[5rem]">
            {hero.lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span data-sh-line className={`block ${i === hero.lines.length - 1 ? 'text-gradient' : ''}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p data-sh-tag className="mt-5 text-sm font-medium uppercase tracking-[0.15em] text-mist/80">
            {hero.tag}
          </p>

          <p data-sh-sub className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg">
            {hero.sub}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              as={Link}
              to={hero.primaryCta.href}
              data-sh-cta
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void"
            >
              {hero.primaryCta.label}
            </MagneticButton>
            <MagneticButton
              as={Link}
              to={hero.secondaryCta.href}
              data-sh-cta
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
            >
              {hero.secondaryCta.label}
            </MagneticButton>
          </div>

          {!isMobile && (
            <div className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-mist">
              <span className="h-px w-6 bg-line" />
              The Studio Core
              <span ref={phaseLabelRef} className="text-accent-soft">
                Idea
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
