import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import MagneticButton from '../../components/ui/MagneticButton'
import ProjectUniverseScene from '../canvas/ProjectUniverseScene'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'

export default function WorkHero() {
  const wrapRef = useRef(null)
  const contentRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } })
      tl.from('[data-wh-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-wh-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.6')
        .from('[data-wh-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('[data-wh-cta]', { y: 16, opacity: 0, duration: 0.8 }, '-=0.6')

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      if (!reducedMotion) {
        gsap.to(contentRef.current, {
          yPercent: -40,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: '35% top',
            scrub: true,
          },
        })
      }

      return () => st.kill()
    }, wrapRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="work-hero" className="relative bg-void">
      <div ref={wrapRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <div className="absolute inset-0">
            <SceneErrorBoundary>
              <ProjectUniverseScene progressRef={progressRef} reducedMotion={reducedMotion} />
            </SceneErrorBoundary>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void" />
          </div>

          <div ref={contentRef} className="container-px relative z-10 flex h-full w-full flex-col justify-center pt-20 will-change-transform">
            <span data-wh-eyebrow className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
              <span className="h-px w-8 bg-accent-soft" />
              Selected Work
            </span>

            <h1 className="max-w-4xl font-display text-[12vw] leading-[0.95] sm:text-[8vw] md:text-[5.5vw] lg:text-[4.6rem]">
              <span className="block overflow-hidden">
                <span data-wh-line className="block">Work That Moves</span>
              </span>
              <span className="block overflow-hidden">
                <span data-wh-line className="block text-gradient">Brands Forward.</span>
              </span>
            </h1>

            <p data-wh-sub className="mt-8 max-w-lg text-base leading-relaxed text-mist md:text-lg">
              From digital experiences to growth campaigns, we create work designed to
              make brands impossible to ignore.
            </p>

            <div data-wh-cta className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton
                as="a"
                href="#work-grid"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void"
              >
                Explore Projects
              </MagneticButton>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 hidden justify-center sm:flex">
            <span className="text-[10px] uppercase tracking-[0.3em] text-mist">Scroll to fly through the work</span>
          </div>
        </div>
      </div>
    </section>
  )
}
