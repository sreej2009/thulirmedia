import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import CapabilityNetworkScene from '../canvas/CapabilityNetworkScene'
import { whatWeDo } from '../data'

export default function WhatWeDo() {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-wwd-frame]', {
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about-what-we-do" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={whatWeDo.eyebrow} title={whatWeDo.title} description={whatWeDo.description} align="center" />
      </div>

      <div
        data-wwd-frame
        className="relative mx-auto mt-14 h-[75vh] w-full max-w-6xl overflow-hidden rounded-2xl md:h-[85vh]"
        style={{ clipPath: 'inset(0 round 1rem)', contain: 'paint' }}
      >
        <CapabilityNetworkScene reducedMotion={reducedMotion} onNavigate={navigate} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
      </div>

      <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-mist">
        Hover a capability to see how it connects · Click to explore
      </p>
    </section>
  )
}
