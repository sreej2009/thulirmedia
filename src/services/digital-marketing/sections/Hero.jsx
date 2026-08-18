import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import MagneticButton from '../../../components/ui/MagneticButton'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'
import GrowthEngineHeroScene from '../canvas/GrowthEngineHeroScene'
import { hero } from '../data'

export default function Hero() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } })
      tl.from('[data-h-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-h-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.6')
        .from('[data-h-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('[data-h-cta]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('[data-h-marquee]', { opacity: 0, duration: 1 }, '-=0.4')

      if (!reducedMotion) {
        const exitScrollTrigger = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(contentRef.current, { yPercent: -28, opacity: 0, ease: 'none', scrollTrigger: exitScrollTrigger })
        gsap.to(bgRef.current, { scale: 1.15, opacity: 0.25, ease: 'none', scrollTrigger: exitScrollTrigger })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="dm-hero" ref={rootRef} className="relative flex min-h-svh items-center overflow-hidden bg-void">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <SceneErrorBoundary>
          <GrowthEngineHeroScene reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/40" />
      </div>

      <div ref={contentRef} className="container-px relative z-10 w-full pt-20 will-change-transform">
        <span data-h-eyebrow className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          <span className="h-px w-8 bg-accent-soft" />
          {hero.eyebrow}
        </span>

        <h1 className="max-w-4xl font-display text-[13vw] leading-[0.95] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.2rem]">
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span data-h-line className={`block ${i === hero.lines.length - 1 ? 'text-gradient' : ''}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p data-h-sub className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg">
          {hero.sub}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton as="a" href={hero.primaryCta.href} data-h-cta className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void">
            {hero.primaryCta.label}
          </MagneticButton>
          <MagneticButton as="a" href={hero.secondaryCta.href} data-h-cta className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60">
            {hero.secondaryCta.label}
          </MagneticButton>
        </div>
      </div>

      <div data-h-marquee className="absolute inset-x-0 bottom-10 z-10 overflow-hidden border-y border-line/60 bg-void/40 py-3 backdrop-blur-sm">
        <div className={`flex w-max gap-8 whitespace-nowrap ${reducedMotion ? '' : 'animate-marquee'}`}>
          {[...hero.tags, ...hero.tags].map((tag, i) => (
            <span key={i} className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-mist">
              {tag}
              <span className="h-1 w-1 rounded-full bg-accent-soft/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
