import { useEffect, useRef, useState } from 'react'
import { gsap, Flip } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import { projects } from '../data'
import WorkCard from './WorkCard'
import WorkFilters from './WorkFilters'

export default function WorkGrid({ id, eyebrow, title, description }) {
  const [active, setActive] = useState('all')
  const gridRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const filtered = active === 'all' ? projects : projects.filter((p) => p.filterKeys.includes(active))

  const handleChange = (key) => {
    if (key === active) return

    if (reducedMotion) {
      setActive(key)
      return
    }

    const state = Flip.getState('[data-work-card]')
    setActive(key)
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        scale: true,
        ease: 'power2.inOut',
        stagger: 0.03,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, delay: 0.15, ease: 'power2.out' }
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.in' }),
      })
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-work-card]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
      })
    }, gridRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id={id} ref={gridRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <WorkFilters active={active} onChange={handleChange} />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-20 text-center text-sm text-mist">
            No case studies in this category yet — check back soon.
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <WorkCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
