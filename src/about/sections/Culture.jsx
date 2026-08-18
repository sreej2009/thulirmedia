import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import { MediaFrame } from '../../work/components/PlaceholderVisual'
import ClosingOrb from '../../services/shared/canvas/ClosingOrb'
import { culture } from '../data'

export default function Culture() {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-culture-tile]', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about-culture" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={culture.eyebrow} title={culture.title} description={culture.description} />

        <div className="mt-14 grid grid-cols-1 gap-5 md:h-[70vh] md:grid-cols-6 md:grid-rows-[1fr_1fr]">
          <div data-culture-tile className="relative h-[42vh] md:col-span-4 md:row-span-2 md:h-auto">
            <MediaFrame src={culture.image} alt="Thulir Media studio" accent="#a78bfa" frame="card" className="h-full" />
          </div>

          <div data-culture-tile className="relative h-[28vh] md:col-span-2 md:h-auto">
            <MediaFrame video={culture.video} alt="Thulir Media process" accent="#818cf8" frame="card" className="h-full" />
          </div>

          <div
            data-culture-tile
            className="flex h-[28vh] flex-col justify-between rounded-xl border border-line bg-charcoal/60 p-6 md:col-span-1 md:h-auto"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-mist">Typography</span>
            <p className="font-display text-2xl leading-tight text-ink md:text-3xl">
              Craft is a habit, not an event.
            </p>
          </div>

          <div data-culture-tile className="relative h-[28vh] overflow-hidden rounded-xl border border-line bg-charcoal/60 md:col-span-1 md:h-auto">
            <ClosingOrb color="#f97316" shape="dodecahedron" reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  )
}
