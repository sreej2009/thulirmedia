import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import MagneticButton from '../../components/ui/MagneticButton'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import DigitalGrowthCoreScene from '../canvas/DigitalGrowthCoreScene'

export default function Hero() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } })
      tl.from('[data-hh-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-hh-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.1 }, '-=0.6')
        .from('[data-hh-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('[data-hh-cta]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')

      if (!reducedMotion) {
        // The hero doesn't just fade — the core grows and moves toward the
        // viewer while the camera dollies forward, so scrolling feels like
        // entering the next environment rather than leaving this one.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        })

        const exitScrollTrigger = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(contentRef.current, { yPercent: -32, opacity: 0, ease: 'none', scrollTrigger: exitScrollTrigger })
        gsap.to(bgRef.current, { scale: 1.35, ease: 'none', scrollTrigger: exitScrollTrigger })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={rootRef} className="relative flex min-h-svh items-center overflow-hidden bg-void">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <SceneErrorBoundary>
          <DigitalGrowthCoreScene reducedMotion={reducedMotion} progressRef={progressRef} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
      </div>

      <div ref={contentRef} className="container-px relative z-10 w-full pt-20 text-center will-change-transform">
        <span data-hh-eyebrow className="mb-6 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          <span className="h-px w-8 bg-accent-soft" />
          Thulir Media
          <span className="h-px w-8 bg-accent-soft" />
        </span>

        <h1 className="relative mx-auto max-w-5xl font-display leading-[0.92]">
          <span className="block overflow-hidden">
            <span data-hh-line className="block text-[15vw] sm:text-[10vw] md:text-[7.5vw] lg:text-[6.4rem]">
              Digital Craft.
            </span>
          </span>
          <span className="-mt-[1.5vw] block overflow-hidden sm:-mt-[1vw] md:-mt-[0.6vw]">
            <span data-hh-line className="block text-[12.5vw] text-gradient sm:text-[8.5vw] md:text-[6.4vw] lg:text-[5.5rem]">
              Measurable Growth.
            </span>
          </span>
        </h1>

        <p data-hh-sub className="mx-auto mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg">
          Six disciplines, six dedicated teams, one standard of craft — marketing, websites, apps,
          SEO, content and brand identity, each built as its own world.
        </p>

        <div data-hh-cta className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          <MagneticButton
            as="a"
            href="#services-showcase"
            className="group inline-flex items-center gap-3 border-b border-ink/70 pb-1 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Explore Services
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-void transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href="/work"
            className="group inline-flex items-center gap-3 border-b border-line pb-1 text-sm font-medium text-mist transition-colors hover:border-ink hover:text-ink"
          >
            View Our Work
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:translate-x-1 group-hover:border-ink">
              →
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
