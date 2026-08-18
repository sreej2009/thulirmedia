import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import OrbitCluster from '../canvas/OrbitCluster'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'

export default function TechEcosystem({ id, eyebrow, title, description, items, accent = '#a78bfa' }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-tech-frame]', {
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div data-tech-frame className="relative mx-auto mt-14 h-[70vh] w-full max-w-5xl md:h-[80vh]">
        <SceneErrorBoundary>
          <OrbitCluster items={items} accent={accent} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
      </div>
    </section>
  )
}
