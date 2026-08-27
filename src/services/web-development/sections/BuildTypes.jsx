import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import SectionHeading from '../../../components/ui/SectionHeading'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'
import BuildTypesScene from '../canvas/BuildTypesScene'
import { whatWeDo, meta } from '../data'

const CONCEPTS = ['Your digital headquarters.', 'Built for one job: convert.', 'From browse to checkout.']

export default function BuildTypes() {
  const rootRef = useRef(null)
  const activeModeRef = useRef(0)
  const [active, setActive] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-bt-content]', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [active])

  const handleSelect = (i) => {
    activeModeRef.current = i
    setActive(i)
  }

  const category = whatWeDo.categories[active]

  return (
    <section id="wd-whatwedo" ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={whatWeDo.eyebrow} title={whatWeDo.title} description={whatWeDo.description} align="center" />

        <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-2">
          {whatWeDo.categories.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => handleSelect(i)}
              data-cursor="hover"
              className="rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-300"
              style={{
                borderColor: active === i ? meta.accent : 'var(--color-line)',
                background: active === i ? `${meta.accent}14` : 'transparent',
                color: active === i ? 'var(--color-ink)' : 'var(--color-mist)',
              }}
            >
              {String(i + 1).padStart(2, '0')} {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-12 h-[60vh] w-full max-w-6xl overflow-hidden rounded-2xl md:h-[70vh]">
        <SceneErrorBoundary>
          <BuildTypesScene activeModeRef={activeModeRef} accent={meta.accent} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/20" />

        <div className="container-px pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-8">
          <div data-bt-content className="mx-auto max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: meta.accent }}>
              {CONCEPTS[active]}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">{category.description}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {category.points.map((p) => (
                <span key={p} className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-mist">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
