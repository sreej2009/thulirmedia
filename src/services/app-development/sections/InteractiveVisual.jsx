import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import AppArchitectureScene from '../canvas/AppArchitectureScene'
import { interactiveVisual } from '../data'

const STATES = ['Idea', 'UI/UX', 'Development', 'API', 'Testing', 'Deployment', 'Growth']

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
    <section id="ad-visual" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={interactiveVisual.eyebrow} title={interactiveVisual.title} description={interactiveVisual.description} />
      </div>

      <div ref={wrapRef} className="relative mt-12 h-[260vh] md:h-[280vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <AppArchitectureScene progressRef={progressRef} reducedMotion={reducedMotion} />

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-wrap justify-center gap-2 px-6">
            {STATES.map((label) => (
              <span
                key={label}
                className="rounded-full border border-line bg-void/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-mist backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
