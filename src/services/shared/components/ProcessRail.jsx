import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'

export default function ProcessRail({ id, eyebrow, title, description, steps, accent = '#a78bfa' }) {
  const wrapRef = useRef(null)
  const numberRef = useRef(null)
  const textRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
          setActiveStep(idx)
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [steps.length])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(numberRef.current, { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'power3.out' })
    tl.fromTo(textRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
  }, [activeStep])

  const current = steps[activeStep]

  return (
    <section id={id} className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div ref={wrapRef} className="relative mt-12" style={{ height: `${steps.length * 85}vh` }}>
        <div className="sticky top-0 flex h-svh w-full items-center overflow-hidden">
          <div className="container-px grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <span
                ref={numberRef}
                className="pointer-events-none block font-display text-[9rem] leading-none text-white/5 sm:text-[13rem]"
              >
                {current.step}
              </span>
              <div ref={textRef} className="mt-[-2.2rem] max-w-lg sm:mt-[-3.6rem]">
                <h3 className="font-display text-3xl text-ink sm:text-4xl md:text-5xl">{current.title}</h3>
                <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">{current.description}</p>
              </div>
            </div>

            <div className="flex flex-row gap-3 lg:flex-col">
              {steps.map((step, i) => (
                <div key={step.step} className="flex items-center gap-3 lg:flex-row-reverse lg:justify-end">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full transition-all duration-500"
                    style={{
                      background: i === activeStep ? accent : 'var(--color-line)',
                      transform: i === activeStep ? 'scale(1.25)' : 'scale(1)',
                    }}
                  />
                  <span
                    className={`hidden text-xs uppercase tracking-[0.15em] transition-colors duration-500 lg:block ${
                      i === activeStep ? 'text-ink' : 'text-mist/50'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
