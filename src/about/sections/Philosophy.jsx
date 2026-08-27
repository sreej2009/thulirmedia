import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../lib/textReveal'
import { philosophy } from '../data'

const ACCENTS = {
  Creativity: '#a78bfa',
  Strategy: '#60a5fa',
}

function renderLine(text, highlight) {
  if (!highlight) return text
  const idx = text.indexOf(highlight)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: ACCENTS[highlight] || 'var(--color-accent-soft)' }}>{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  )
}

export default function Philosophy() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealLines('[data-ph-headline]', { start: 'top 80%', stagger: 0.12 })
      gsap.from('[data-ph-desc]', {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 65%', once: true },
      })
      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about-philosophy" ref={rootRef} className="relative bg-void py-28 md:py-40">
      <div className="container-px mx-auto max-w-4xl text-center">
        <span className="mb-8 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          <span className="h-px w-8 bg-accent-soft" />
          {philosophy.eyebrow}
          <span className="h-px w-8 bg-accent-soft" />
        </span>

        <h2 data-ph-headline className="font-display text-4xl leading-[1.1] text-ink sm:text-5xl md:text-6xl">
          {philosophy.lines.map((line) => (
            <span key={line.text} className="block overflow-hidden">
              <span className="block">{renderLine(line.text, line.highlight)}</span>
            </span>
          ))}
        </h2>

        <p data-ph-desc className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
          {philosophy.description}
        </p>
      </div>
    </section>
  )
}
