import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion, useIsMobile } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import EcosystemNetworkScene from '../canvas/EcosystemNetworkScene'

const PHASES = [
  'Services appear',
  'Data starts flowing',
  'Audience activates',
  'Experience activates',
  'Conversion activates',
  'Growth takes over',
]

export default function Ecosystem() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) return
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=450%',
        pin: pinRef.current,
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) {
    return <EcosystemMobile reducedMotion={reducedMotion} />
  }

  return (
    <section id="ecosystem" ref={rootRef} className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading
          eyebrow="How It Works Together"
          title={
            <>
              Everything
              <br />
              connects.
            </>
          }
          description="We don't treat services as isolated tasks. Content, SEO, social, ads, website and app all feed one system — audience, into experience, into conversion, into growth."
          align="center"
        />
      </div>

      <div ref={pinRef} className="relative mt-16 h-svh w-full overflow-hidden md:mt-20">
        <SceneErrorBoundary>
          <EcosystemNetworkScene progressRef={progressRef} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/35" />
      </div>
    </section>
  )
}

// Mobile can't pin the whole viewport for a 450%-tall scroll run without
// awkward jumps, so the canvas sits sticky near the top while a compact
// scrub drives the same six-phase progress across the section's height —
// same continuous ecosystem, same progressRef, mobile-appropriate mechanics.
function EcosystemMobile({ reducedMotion }) {
  const rootRef = useRef(null)
  const progressRef = useRef(0)
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 15%',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const idx = Math.min(PHASES.length - 1, Math.floor(self.progress * PHASES.length))
          setPhaseIndex((prev) => (prev !== idx ? idx : prev))
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ecosystem" ref={rootRef} className="relative bg-void py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="How It Works Together"
          title={
            <>
              Everything
              <br />
              connects.
            </>
          }
          description="We don't treat services as isolated tasks. Content, SEO, social, ads, website and app all feed one system — audience, into experience, into conversion, into growth."
          align="center"
        />
      </div>

      <div className="sticky top-20 z-10 mt-10 bg-void pb-2">
        <div className="relative mx-4 h-[62vh] overflow-hidden rounded-2xl border border-line sm:mx-6">
          <SceneErrorBoundary>
            <EcosystemNetworkScene progressRef={progressRef} reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/10" />
        </div>
        <p className="container-px mt-3 text-center text-xs uppercase tracking-[0.2em] text-mist">{PHASES[phaseIndex]}</p>
      </div>

      {/* Scroll runway for the sticky canvas above — tall enough to move
          through all six phases at a comfortable pace. */}
      <div style={{ height: '160vh' }} aria-hidden="true" />
    </section>
  )
}
