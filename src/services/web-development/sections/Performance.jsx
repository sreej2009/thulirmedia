import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'
import { performance as performanceData, meta } from '../data'

export default function Performance() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-perf-row]', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
      gsap.fromTo(
        '[data-perf-fill]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="wd-performance" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={performanceData.eyebrow} title={performanceData.title} description={performanceData.description} />
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-mist">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: meta.accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: meta.accent }} />
            </span>
            Engineering standard, not a measured score
          </span>
        </div>

        <div className="mt-14 flex flex-col gap-8">
          {performanceData.items.map((item) => (
            <div key={item.label} data-perf-row className="grid grid-cols-1 gap-3 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-8">
              <div>
                <h3 className="text-base font-medium text-ink md:text-lg">{item.label}</h3>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-mist">{item.description}</p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  data-perf-fill
                  className="h-full origin-left rounded-full"
                  style={{ width: `${item.fill * 100}%`, background: item.color, transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-mist">
          These bars represent the engineering standard every build is held to — not measured
          results, benchmark scores or a guarantee for any specific site.
        </p>
      </div>
    </section>
  )
}
