import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import SectionHeading from '../../components/ui/SectionHeading'
import CountUp from '../../components/ui/CountUp'
import { analyticsMetrics, trendSeries } from '../data'

function TrendChart() {
  const pathRef = useRef(null)
  const max = Math.max(...trendSeries)
  const min = Math.min(...trendSeries)
  const points = trendSeries
    .map((v, i) => {
      const x = (i / (trendSeries.length - 1)) * 100
      const y = 34 - ((v - min) / (max - min)) * 30
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
      <polyline
        ref={pathRef}
        points={points}
        fill="none"
        stroke="url(#trendGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="trendGradient" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function DMAnalytics() {
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
    <section id="dm-analytics" ref={rootRef} className="relative bg-void py-28 md:py-40">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Analytics & Results"
            title="What growth looks like on a dashboard."
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-mist">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-soft" />
            </span>
            Illustrative demo data — not client results
          </span>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-line bg-charcoal/60">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-mist">Campaign performance — last 12 weeks</span>
            <span className="font-mono text-xs text-accent-soft">+186%</span>
          </div>
          <div className="p-6 pb-2">
            <TrendChart />
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {analyticsMetrics.map((metric) => (
              <div key={metric.label} data-metric-tile className="bg-charcoal/60 p-6">
                <span className="block h-0.5 w-8 rounded-full" style={{ background: metric.color }} />
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
