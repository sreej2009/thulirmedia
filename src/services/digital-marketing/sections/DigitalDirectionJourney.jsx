import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import { revealLines } from '../../../lib/textReveal'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'
import DigitalDirectionScene from '../canvas/DigitalDirectionScene'
import { digitalDirection, digitalSystem } from '../data'

// The studio's own introduction to Digital Marketing, told as one
// continuous narrative rather than two boxed heading+paragraph blocks. A
// single "Digital Direction" system (channels -> Audience -> Brand ->
// Growth) grows across both sections, driven by one shared scroll
// progress — small and elegant in section 01, fuller by section 02, then
// gently expanding to lead into the existing 3D Services section below.

function DataDivider() {
  const dotRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dotRef.current,
        { yPercent: 0, opacity: 0 },
        { yPercent: 900, opacity: 1, duration: 1.8, repeat: -1, repeatDelay: 0.5, ease: 'power1.inOut' }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative mx-auto h-14 w-px overflow-hidden bg-line" aria-hidden="true">
      <span ref={dotRef} className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-soft opacity-0" />
    </div>
  )
}

export default function DigitalDirectionJourney() {
  const wrapRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split1 = revealLines('[data-dd-headline]', { start: 'top 80%' })
      gsap.from('[data-dd-eyebrow]', {
        opacity: 0,
        x: -16,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#dm-direction', start: 'top 78%', once: true },
      })
      gsap.from('[data-dd-body] > p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-dd-body]', start: 'top 82%', once: true },
      })
      gsap.from('[data-dd-visual]', {
        opacity: 0,
        scale: 0.94,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-dd-visual]', start: 'top 85%', once: true },
      })

      const split2 = revealLines('[data-ds-headline]', { start: 'top 80%' })
      gsap.from('[data-ds-eyebrow]', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#dm-system', start: 'top 78%', once: true },
      })
      gsap.from('[data-ds-pillar]', {
        opacity: 0,
        y: 12,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-ds-pillars]', start: 'top 85%', once: true },
      })
      gsap.from('[data-ds-body] > p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-ds-body]', start: 'top 85%', once: true },
      })

      return () => {
        split1?.revert()
        split2?.revert()
      }
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative bg-void">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#c4b5fd 1px, transparent 1px), linear-gradient(90deg, #c4b5fd 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* SECTION 01 — Digital Direction */}
      <section id="dm-direction" className="relative overflow-hidden py-24 md:py-32">
        <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-[45%_55%] lg:items-start lg:gap-16">
          <div>
            <span data-dd-eyebrow className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
              <span className="h-px w-8 bg-accent-soft" />
              {digitalDirection.eyebrow}
            </span>
            <h2 data-dd-headline className="font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {digitalDirection.lines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="block">
                    {line === digitalDirection.highlight ? <span className="text-gradient">{line}</span> : line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="flex flex-col">
            <div data-dd-visual className="relative order-1 h-64 w-full max-w-xl overflow-hidden rounded-2xl border border-line lg:order-2 lg:mt-10 lg:h-80">
              <SceneErrorBoundary>
                <DigitalDirectionScene progressRef={progressRef} reducedMotion={reducedMotion} compact />
              </SceneErrorBoundary>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
            </div>

            <div data-dd-body className="order-2 mt-10 max-w-xl space-y-5 text-base leading-relaxed text-mist md:text-lg lg:order-1 lg:mt-0">
              {digitalDirection.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DataDivider />

      {/* SECTION 02 — Digital Marketing System */}
      <section id="dm-system" className="relative overflow-hidden py-24 md:py-32">
        <div className="container-px">
          <div className="mx-auto max-w-3xl text-center">
            <span data-ds-eyebrow className="mb-6 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
              <span className="h-px w-8 bg-accent-soft" />
              {digitalSystem.eyebrow}
              <span className="h-px w-8 bg-accent-soft" />
            </span>
            <h2 data-ds-headline className="font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {digitalSystem.lines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="block">{line}</span>
                </span>
              ))}
            </h2>
          </div>

          <div className="relative mx-auto mt-14 h-[52vh] w-full max-w-5xl overflow-hidden rounded-2xl md:h-[62vh]">
            <SceneErrorBoundary>
              <DigitalDirectionScene progressRef={progressRef} reducedMotion={reducedMotion} />
            </SceneErrorBoundary>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/25" />
          </div>

          <div data-ds-pillars className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-2">
            {digitalSystem.pillars.map((p) => (
              <span key={p} data-ds-pillar className="text-xs font-medium uppercase tracking-[0.25em] text-ink">
                {p}
              </span>
            ))}
          </div>

          <div data-ds-body className="mx-auto mt-10 max-w-2xl space-y-5 text-center text-base leading-relaxed text-mist md:text-lg">
            {digitalSystem.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
