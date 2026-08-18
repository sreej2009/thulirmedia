import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'
import CountUp from '../../../components/ui/CountUp'

function TrendChart({ trend, accent }) {
  const pathRef = useRef(null)
  const max = Math.max(...trend)
  const min = Math.min(...trend)
  const points = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * 100
      const y = 34 - ((v - min) / (max - min || 1)) * 30
      return `${x},${y}`
    })
    .join(' ')

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const length = el.getTotalLength()
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
    const ctx = gsap.context(() => {
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <svg viewBox="0 0 100 40" className="w-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline ref={pathRef} points={points} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MetricsDashboard({ id, eyebrow, title, items, trend, accent = '#a78bfa' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-metric-tile]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-mist">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
            </span>
            Illustrative demo data — not client results
          </span>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-charcoal/60">
          {trend && (
            <div className="p-6 pb-2">
              <TrendChart trend={trend} accent={accent} />
            </div>
          )}

          <div className={`grid grid-cols-2 gap-px border-line bg-line sm:grid-cols-3 lg:grid-cols-5 ${trend ? 'border-t' : ''}`}>
            {items.map((metric) => (
              <div key={metric.label} data-metric-tile className="bg-charcoal/60 p-6">
                <span className="block h-0.5 w-8 rounded-full" style={{ background: metric.color || accent }} />
                <span className="mt-4 block font-display text-3xl text-ink md:text-4xl">
                  <CountUp
                    value={metric.value}
                    suffix={metric.suffix || ''}
                    prefix={metric.prefix || ''}
                    decimals={metric.decimals || 0}
                  />
                </span>
                <span className="mt-1 block text-sm text-mist">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-mist">
          These figures are illustrative, for demonstration purposes only, and do not represent
          actual Thulir Media client results or guarantees of performance. Real reporting is
          built around your own campaign data from day one.
        </p>
      </div>
    </section>
  )
}
