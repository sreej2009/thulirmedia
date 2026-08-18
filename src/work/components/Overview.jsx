import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealWords } from '../../lib/textReveal'

const FIELDS = [
  { key: 'client', label: 'Client' },
  { key: 'industry', label: 'Industry' },
  { key: 'servicesLabel', label: 'Services' },
  { key: 'year', label: 'Year' },
]

export default function Overview({ project }) {
  const rootRef = useRef(null)
  const summaryRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealWords(summaryRef.current)

      gsap.from('[data-ov-field]', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      })

      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const data = { ...project, servicesLabel: project.services.join(', ') }

  return (
    <section id="cs-overview" ref={rootRef} className="relative bg-void py-20 md:py-28">
      <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <dl className="grid grid-cols-2 gap-8 self-start sm:grid-cols-4 lg:grid-cols-1">
          {FIELDS.map((f) => (
            <div key={f.key} data-ov-field>
              <dt className="text-xs uppercase tracking-[0.15em] text-mist">{f.label}</dt>
              <dd className="mt-1.5 text-sm text-ink">{data[f.key]}</dd>
            </div>
          ))}
        </dl>

        <p ref={summaryRef} className="text-lg leading-relaxed text-mist md:text-xl">
          {project.description}
        </p>
      </div>
    </section>
  )
}
