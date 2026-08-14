import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import MagneticButton from '../../components/ui/MagneticButton'
import { SERVICE_VISUALS } from './serviceVisualsMap'

function PointsRows({ points, accent }) {
  return (
    <ol className="flex flex-col divide-y divide-line border-y border-line">
      {points.map((point, i) => (
        <li key={point} className="flex items-center gap-4 py-3">
          <span className="font-mono text-xs text-mist">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-sm text-ink">{point}</span>
          <span className="ml-auto h-1 w-1 rounded-full" style={{ background: accent }} />
        </li>
      ))}
    </ol>
  )
}

function PointsChips({ points, accent }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {points.map((point) => (
        <span
          key={point}
          className="rounded-full border px-3.5 py-1.5 text-xs text-ink transition-colors"
          style={{ borderColor: `${accent}40` }}
        >
          {point}
        </span>
      ))}
    </div>
  )
}

function PointsGrid({ points, accent }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {points.map((point) => (
        <div key={point} className="flex items-center gap-2.5 text-sm text-ink">
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px]"
            style={{ background: `${accent}26`, color: accent }}
          >
            ✓
          </span>
          {point}
        </div>
      ))}
    </div>
  )
}

function PointsTicker({ points, accent, reducedMotion }) {
  return (
    <div className="-mx-6 overflow-hidden border-y border-line py-3 sm:-mx-8">
      <div className={`flex w-max gap-6 whitespace-nowrap px-6 sm:px-8 ${reducedMotion ? '' : 'animate-marquee'}`}>
        {[...points, ...points].map((point, i) => (
          <span key={i} className="flex items-center gap-2 text-xs text-mist">
            <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
            {point}
          </span>
        ))}
      </div>
    </div>
  )
}

const POINTS_COMPONENTS = {
  rows: PointsRows,
  chips: PointsChips,
  grid: PointsGrid,
  ticker: PointsTicker,
}

export default function ServiceBlock({ service, index }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const flipped = index % 2 === 1

  const Visual = SERVICE_VISUALS[service.visual]
  const PointsComponent = POINTS_COMPONENTS[service.pointsLayout] || PointsGrid

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-svc-text]', {
        clipPath: flipped ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
      gsap.from('[data-svc-visual]', {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [flipped])

  return (
    <div
      ref={rootRef}
      id={service.id}
      className="overflow-hidden border-t border-line py-20 first:border-t-0 md:py-28"
    >
      <div className="container-px">
        <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 ${flipped ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div data-svc-text style={{ overflow: 'hidden' }}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: service.accent }}>
                {service.index}
              </span>
              <span className="h-px flex-1 max-w-10 bg-line" />
              <span className="text-xs uppercase tracking-[0.2em] text-mist">{service.eyebrow}</span>
            </div>

            <h3 className="mt-5 font-display text-3xl leading-[1.05] text-ink sm:text-4xl md:text-5xl">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-mist">{service.tagline}</p>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-mist">
              {service.description}
            </p>

            <div className="mt-8 max-w-lg">
              <PointsComponent points={service.points} accent={service.accent} reducedMotion={reducedMotion} />
            </div>

            <MagneticButton
              as="a"
              href="#dm-contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
            >
              {service.cta}
              <span aria-hidden>→</span>
            </MagneticButton>
          </div>

          <div data-svc-visual className="relative">
            <div
              className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-20 blur-3xl"
              style={{ background: service.accent }}
            />
            {Visual && <Visual accent={service.accent} />}
          </div>
        </div>
      </div>
    </div>
  )
}
