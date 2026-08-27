import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'
import EngineeringCoreScene from '../canvas/EngineeringCoreScene'
import { engineeringStandard, meta } from '../data'

export default function EngineeringStandard() {
  const wrapRef = useRef(null)
  const activeCountRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          activeCountRef.current = Math.ceil(self.progress * engineeringStandard.nodes.length)
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="wd-engineering" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={engineeringStandard.eyebrow} title={engineeringStandard.title} description={engineeringStandard.description} align="center" />
      </div>

      <div ref={wrapRef} className="relative mt-8" style={{ height: '220vh' }}>
        <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden">
          <SceneErrorBoundary>
            <EngineeringCoreScene activeCountRef={activeCountRef} accent={meta.accent} reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
        </div>
      </div>
    </section>
  )
}
