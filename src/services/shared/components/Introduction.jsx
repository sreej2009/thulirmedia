import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { revealWords } from '../../../lib/textReveal'
import SectionHeading from '../../../components/ui/SectionHeading'

export default function Introduction({ id, eyebrow, title, description, problem, approach, highlights = [], accent = '#a78bfa' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splits = ['[data-intro-problem]', '[data-intro-approach]']
        .map((sel) => rootRef.current.querySelector(sel))
        .filter(Boolean)
        .map((el) => revealWords(el))

      gsap.from('[data-intro-highlight]', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })

      return () => splits.forEach((s) => s?.revert())
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {problem && (
            <p data-intro-problem className="text-base leading-relaxed text-mist md:text-lg">
              {problem}
            </p>
          )}
          {approach && (
            <p data-intro-approach className="text-base leading-relaxed text-mist md:text-lg">
              {approach}
            </p>
          )}
        </div>

        {highlights.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-3">
            {highlights.map((h) => (
              <span
                key={h}
                data-intro-highlight
                className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] text-ink"
                style={{ borderColor: `${accent}40` }}
              >
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
