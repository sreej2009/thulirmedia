import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import SectionHeading from '../../components/ui/SectionHeading'

export default function ImpactGrid({ project }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-impact-tile]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="cs-impact" ref={rootRef} className="relative bg-void py-20 md:py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Impact"
          title="What this project delivered."
          description="This is a concept project, so we're showing scope and capability rather than invented metrics — real case studies show real results here."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {project.impact.map((item) => (
            <div key={item.label} data-impact-tile className="bg-charcoal/60 p-6">
              <span className="block h-0.5 w-8 rounded-full" style={{ background: project.accent }} />
              <span className="mt-4 block text-xs uppercase tracking-[0.15em] text-mist">{item.label}</span>
              <span className="mt-2 block text-base font-medium leading-snug text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
