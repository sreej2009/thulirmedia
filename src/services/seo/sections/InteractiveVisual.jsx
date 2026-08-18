import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import RankingTowerScene from '../canvas/RankingTowerScene'
import { interactiveVisual } from '../data'

const PIPELINE = ['Search', 'Crawl', 'Index', 'Rank', 'Traffic', 'Leads']

export default function InteractiveVisual() {
  const wrapRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          setActiveStage(Math.min(PIPELINE.length - 1, Math.floor(self.progress * PIPELINE.length)))
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="seo-visual" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={interactiveVisual.eyebrow} title={interactiveVisual.title} description={interactiveVisual.description} />
      </div>

      <div ref={wrapRef} className="relative mt-12 h-[240vh] md:h-[260vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <RankingTowerScene progressRef={progressRef} reducedMotion={reducedMotion} />

          <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center gap-2">
            {PIPELINE.map((label, i) => (
              <span
                key={label}
                className="rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] backdrop-blur-sm transition-colors"
                style={{
                  borderColor: i === activeStage ? 'rgba(52,211,153,0.6)' : 'var(--color-line)',
                  color: i === activeStage ? '#34d399' : 'var(--color-mist)',
                  background: 'rgba(10,10,12,0.5)',
                }}
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
