import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import HeroCanvas from '../components/canvas/HeroCanvas'
import MagneticButton from '../components/ui/MagneticButton'

export default function Hero() {
  const rootRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.9, defaults: { ease: 'power4.out' } })
      tl.from('[data-hero-eyebrow]', { y: 24, opacity: 0, duration: 0.9 })
        .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.6')
        .from('[data-hero-sub]', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
        .from('[data-hero-cta]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('[data-hero-scroll]', { opacity: 0, duration: 0.8 }, '-=0.4')

      // cinematic exit: content parallaxes up + dissolves, scene zooms + fades
      // as the hero scrolls out of view, blending into the next section.
      const exitScrollTrigger = {
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }

      gsap.to(contentRef.current, {
        yPercent: -32,
        opacity: 0,
        ease: 'none',
        scrollTrigger: exitScrollTrigger,
      })

      gsap.to(bgRef.current, {
        scale: 1.18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: exitScrollTrigger,
      })

      gsap.to('[data-hero-scroll]', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '20% top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-void"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <HeroCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/40" />
      </div>

      <div ref={contentRef} className="container-px relative z-10 w-full pt-20 will-change-transform">
        <span
          data-hero-eyebrow
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft"
        >
          <span className="h-px w-8 bg-accent-soft" />
          Creative Developer &amp; 3D Engineer
        </span>

        <h1 className="max-w-4xl font-display text-[13vw] leading-[0.95] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5rem]">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">Crafting digital</span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block text-gradient">experiences that move</span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg"
        >
          I design and build cinematic, high-performance web experiences at the
          intersection of engineering, motion and 3D.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            as="a"
            href="#projects"
            data-hero-cta
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void transition-transform"
          >
            View my work
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#contact"
            data-hero-cta
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
          >
            Get in touch
          </MagneticButton>
        </div>
      </div>

      <div
        data-hero-scroll
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-mist">Scroll</span>
        <div className="h-12 w-px overflow-hidden bg-line">
          <div className="h-1/2 w-full animate-[float_2s_ease-in-out_infinite] bg-accent-soft" />
        </div>
      </div>
    </section>
  )
}
