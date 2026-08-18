import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import BrandTransformScene from '../canvas/BrandTransformScene'
import { interactiveVisual } from '../data'

export default function InteractiveVisual() {
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
    <section id="br-visual" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={interactiveVisual.eyebrow} title={interactiveVisual.title} description={interactiveVisual.description} />
      </div>

      <div ref={wrapRef} className="relative mt-12 h-[220vh] md:h-[240vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <BrandTransformScene progressRef={progressRef} reducedMotion={reducedMotion} />
          <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
            <span className="rounded-full border border-line bg-void/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-mist backdrop-blur-sm">
              Scroll to watch the brand form
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
