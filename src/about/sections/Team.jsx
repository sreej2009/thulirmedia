import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import SectionHeading from '../../components/ui/SectionHeading'
import { team } from '../data'

export default function Team() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-team-card]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about-team" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={team.eyebrow} title={team.title} description={team.description} />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.roles.map((r) => (
            <div
              key={r.role}
              data-team-card
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-charcoal/60 p-6 transition-colors hover:border-accent-soft/30"
            >
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center self-start rounded-full border border-dashed border-line text-mist/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-ink">{r.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{r.focus}</p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-mist/70">
                Profile coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
