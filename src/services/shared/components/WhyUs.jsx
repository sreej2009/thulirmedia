import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'

export default function WhyUs({ id, eyebrow, title, description, points, accent = '#a78bfa' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-why-row]', {
        x: -24,
        opacity: 0,
        duration: 0.8,
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

        <div className="mt-14 divide-y divide-line border-y border-line">
          {points.map((point, i) => (
            <div key={point.title} data-why-row className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="shrink-0 font-mono text-xs" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-base font-medium text-ink md:text-lg">{point.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mist">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
