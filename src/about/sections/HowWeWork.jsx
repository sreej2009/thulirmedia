import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import SceneErrorBoundary from '../../components/canvas/SceneErrorBoundary'
import ProcessPathScene from '../../components/canvas/ProcessPathScene'
import { howWeWork } from '../data'

export default function HowWeWork() {
  const wrapRef = useRef(null)
  const activeIndexRef = useRef(0)
  const [activeStep, setActiveStep] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const idx = Math.min(howWeWork.steps.length - 1, Math.floor(self.progress * howWeWork.steps.length))
          activeIndexRef.current = idx
          setActiveStep((prev) => (prev !== idx ? idx : prev))
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [])

  const current = howWeWork.steps[activeStep]

  return (
    <section id="about-how-we-work" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={howWeWork.eyebrow} title={howWeWork.title} description={howWeWork.description} align="center" />
      </div>

      <div ref={wrapRef} className="relative mt-8" style={{ height: `${howWeWork.steps.length * 65}vh` }}>
        <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden">
          <SceneErrorBoundary>
            <ProcessPathScene steps={howWeWork.steps} activeIndexRef={activeIndexRef} accent="#a78bfa" reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />

          <div className="container-px relative z-10 w-full text-center">
            <span className="font-mono text-xs text-accent-soft">{current.step}</span>
            <h3 className="mt-3 font-display text-3xl text-ink md:text-5xl">{current.title}</h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist md:text-base">{current.description}</p>

            <div className="mt-8 flex items-center justify-center gap-2">
              {howWeWork.steps.map((s, i) => (
                <span
                  key={s.step}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === activeStep ? '1.5rem' : '0.375rem',
                    background: i === activeStep ? '#a78bfa' : 'var(--color-line)',
                    opacity: i === activeStep ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
