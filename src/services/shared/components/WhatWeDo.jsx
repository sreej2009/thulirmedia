import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'

export default function WhatWeDo({ id, eyebrow, title, description, categories, accent = '#a78bfa' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-wwd-card]', {
        clipPath: 'inset(100% 0% 0% 0%)',
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              data-wwd-card
              className="group relative overflow-hidden rounded-2xl border border-line bg-charcoal/60 p-7 transition-colors hover:border-[var(--card-accent)]/40"
              style={{ '--card-accent': accent, overflow: 'hidden' }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: accent }}
              />
              <span className="font-mono text-xs text-mist">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-lg font-medium text-ink">{cat.title}</h3>
              {cat.tagline && <p className="mt-1 text-sm" style={{ color: accent }}>{cat.tagline}</p>}
              {cat.description && (
                <p className="mt-3 text-sm leading-relaxed text-mist">{cat.description}</p>
              )}
              <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
                {cat.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-mist">
                    <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: accent }} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
