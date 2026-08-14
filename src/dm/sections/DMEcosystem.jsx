import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import EcosystemDiagramCanvas from '../canvas/EcosystemDiagramScene'

export default function DMEcosystem() {
  const wrapRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="dm-ecosystem" className="relative bg-void">
      <div className="container-px pt-28 md:pt-40">
        <SectionHeading
          eyebrow="Digital Growth Ecosystem"
          title="Every channel feeds one system."
          description="SEO, social, content and paid media all point to one place — your website — where visitors become leads, leads become sales, and sales compound into growth."
        />
      </div>

      <div ref={wrapRef} className="relative mt-12 h-[240vh] md:h-[260vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <EcosystemDiagramCanvas progressRef={progressRef} reducedMotion={reducedMotion} />

          <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
            <span className="rounded-full border border-line bg-void/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-mist backdrop-blur-sm">
              Scroll to follow the flow
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
            <span className="font-mono text-[11px] text-mist">
              Sources <span className="text-accent-soft">→</span> Website <span className="text-accent-soft">→</span> Leads <span className="text-accent-soft">→</span> Sales <span className="text-accent-soft">→</span> Growth
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
