import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { revealWords } from '../../lib/textReveal'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks/useIsMobile'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import MagneticButton from '../../components/ui/MagneticButton'
import CreativeCoreScene from '../canvas/CreativeCoreScene'

export default function WhyThulir() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const bodyRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  // Headline reveals in three chunks ("Creativity" -> "is only" -> "half
  // the story."), then supporting copy, then the CTA — a one-time entrance
  // independent of the continuous scroll-driven 3D phase system below.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-wt-chunk]', {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: 'expo.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
      const wordSplit = revealWords(bodyRef.current, { start: 'top 68%', end: 'top 38%' })
      gsap.from('[data-wt-cta]', {
        y: 16,
        opacity: 0,
        duration: 0.8,
        delay: 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 65%', once: true },
      })
      return () => wordSplit?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Desktop: pin the section and drive the 3D scene's five phase bands from
  // scroll progress. Mobile never pins (site-wide convention) — instead the
  // same progress value auto-cycles so the recomposed layout still shows the
  // full creativity -> technology -> strategy -> growth arc.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) {
        if (!reducedMotion) {
          gsap.to(progressRef, { current: 1, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true })
        } else {
          progressRef.current = 0.55
        }
        return
      }
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=220%',
        pin: pinRef.current,
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [isMobile, reducedMotion])

  const headline = (
    <h2 className="font-display text-[13vw] leading-[1.03] sm:text-6xl md:text-7xl lg:text-[4.75rem]">
      <span className="mr-[0.28em] inline-block overflow-hidden align-top">
        <span data-wt-chunk className="inline-block">
          Creativity
        </span>
      </span>
      <span className="inline-block overflow-hidden align-top">
        <span data-wt-chunk className="inline-block">
          is only
        </span>
      </span>
      <br />
      <span className="inline-block overflow-hidden align-top">
        <span data-wt-chunk className="inline-block text-gradient">
          half the story.
        </span>
      </span>
    </h2>
  )

  const eyebrow = (
    <span className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
      <span className="h-px w-8 bg-accent-soft" />
      Why Thulir Media
    </span>
  )

  const body = (
    <p ref={bodyRef} className="mt-8 max-w-xl text-lg leading-relaxed text-mist md:text-xl">
      Technology turns ideas into experiences. Strategy turns experiences into growth.
    </p>
  )

  const cta = (
    <div data-wt-cta className="mt-10">
      <MagneticButton
        as={Link}
        to="/about"
        data-cursor="hover"
        data-cursor-text="Explore"
        className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
      >
        <span className="relative">
          Discover Thulir Media
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-400 ease-out group-hover:w-full" />
        </span>
        <span aria-hidden="true" className="transition-transform duration-400 ease-out group-hover:translate-x-1.5">
          →
        </span>
      </MagneticButton>
    </div>
  )

  if (isMobile) {
    return (
      <section id="why-thulir" ref={rootRef} className="relative overflow-hidden bg-void py-24">
        <div className="container-px">
          {eyebrow}
          {headline}
        </div>

        <div className="relative mx-4 mt-10 h-[52vh] overflow-hidden rounded-2xl border border-line sm:mx-6">
          <SceneErrorBoundary>
            <CreativeCoreScene progressRef={progressRef} reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/10" />
        </div>

        <div className="container-px mt-8 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] text-mist">
          <span style={{ color: '#60a5fa' }}>Technology</span>
          <span aria-hidden="true">·</span>
          <span style={{ color: '#f59e0b' }}>Strategy</span>
          <span aria-hidden="true">·</span>
          <span style={{ color: '#e9d5ff' }}>Growth</span>
        </div>

        <div className="container-px">
          {body}
          {cta}
        </div>
      </section>
    )
  }

  return (
    <section id="why-thulir" ref={rootRef} className="relative bg-void">
      <div ref={pinRef} className="relative flex min-h-svh w-full items-center overflow-hidden py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#c4b5fd 1px, transparent 1px), linear-gradient(90deg, #c4b5fd 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="container-px relative grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[52%_48%] lg:gap-8">
          <div className="max-w-xl">
            {eyebrow}
            {headline}
            {body}
            {cta}
          </div>

          <div className="relative h-[48vh] w-full overflow-hidden lg:h-[62vh]">
            <SceneErrorBoundary>
              <CreativeCoreScene progressRef={progressRef} reducedMotion={reducedMotion} />
            </SceneErrorBoundary>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
