import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import DMHeroCanvas from '../canvas/DMHeroCanvas'
import MagneticButton from '../../components/ui/MagneticButton'
import { ecosystemTags } from '../data'

export default function DMHero() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } })
      tl.from('[data-dmh-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-dmh-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.6')
        .from('[data-dmh-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('[data-dmh-cta]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('[data-dmh-marquee]', { opacity: 0, duration: 1 }, '-=0.4')
        .from('[data-dmh-scroll]', { opacity: 0, duration: 0.8 }, '-=0.4')

      if (!reducedMotion) {
        const exitScrollTrigger = {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }

        gsap.to(contentRef.current, {
          yPercent: -28,
          opacity: 0,
          ease: 'none',
          scrollTrigger: exitScrollTrigger,
        })

        gsap.to(bgRef.current, {
          scale: 1.15,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: exitScrollTrigger,
        })

        gsap.to('[data-dmh-scroll]', {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '20% top',
            scrub: true,
          },
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id="dm-hero"
      ref={rootRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-void"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <DMHeroCanvas reducedMotion={reducedMotion} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/40" />
      </div>

      <div ref={contentRef} className="container-px relative z-10 w-full pt-20 will-change-transform">
        <span
          data-dmh-eyebrow
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft"
        >
          <span className="h-px w-8 bg-accent-soft" />
          Digital Marketing · Thulir Media
        </span>

        <h1 className="max-w-4xl font-display text-[13vw] leading-[0.95] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.2rem]">
          <span className="block overflow-hidden">
            <span data-dmh-line className="block">Turn Attention</span>
          </span>
          <span className="block overflow-hidden">
            <span data-dmh-line className="block text-gradient">Into Growth.</span>
          </span>
        </h1>

        <p
          data-dmh-sub
          className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg"
        >
          We build digital experiences, campaigns and growth strategies that help
          brands get discovered, remembered and chosen.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            as="a"
            href="#dm-contact"
            data-dmh-cta
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void transition-transform"
          >
            Start a Project
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#dm-services"
            data-dmh-cta
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
          >
            Explore Services
          </MagneticButton>
        </div>
      </div>

      <div
        data-dmh-marquee
        className="absolute inset-x-0 bottom-24 z-10 overflow-hidden border-y border-line/60 bg-void/40 py-3 backdrop-blur-sm sm:bottom-28"
      >
        <div
          className={`flex w-max gap-8 whitespace-nowrap ${reducedMotion ? '' : 'animate-marquee'}`}
        >
          {[...ecosystemTags, ...ecosystemTags].map((tag, i) => (
            <span key={i} className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-mist">
              {tag}
              <span className="h-1 w-1 rounded-full bg-accent-soft/60" />
            </span>
          ))}
        </div>
      </div>

      <div
        data-dmh-scroll
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-mist">Scroll</span>
        <div className="h-10 w-px overflow-hidden bg-line">
          <div
            className={`h-1/2 w-full bg-accent-soft ${reducedMotion ? '' : 'animate-[float_2s_ease-in-out_infinite]'}`}
          />
        </div>
      </div>
    </section>
  )
}
