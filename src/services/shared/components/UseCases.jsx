import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'

export default function UseCases({ id, eyebrow, title, description, items, accent = '#a78bfa' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-usecase-card]', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={item.title} data-usecase-card className="rounded-2xl border border-line bg-charcoal/60 p-6">
              <span className="font-display text-2xl" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-base font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
