import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import SectionHeading from '../../components/ui/SectionHeading'
import { beliefs } from '../data'

export default function Beliefs() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const prevStep = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const idx = Math.min(beliefs.length - 1, Math.floor(self.progress * beliefs.length))
          setActiveStep(idx)
        },
      })
      return () => st.kill()
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!stageRef.current) return
    const cards = stageRef.current.querySelectorAll('[data-belief-card]')
    const outgoing = cards[prevStep.current]
    const incoming = cards[activeStep]

    if (outgoing && outgoing !== incoming) {
      gsap.to(outgoing, { opacity: 0, scale: 0.94, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' })
    }
    if (incoming) {
      gsap.fromTo(
        incoming,
        { opacity: 0, scale: 1.04, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      )
    }
    prevStep.current = activeStep
  }, [activeStep])

  return (
    <section id="about-beliefs" className="relative bg-void">
      <div className="container-px pt-24 md:pt-32">
        <SectionHeading eyebrow="What We Believe" title="Four principles behind every decision." />
      </div>

      <div ref={wrapRef} className="relative mt-8" style={{ height: `${beliefs.length * 90}vh` }}>
        <div ref={stageRef} className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
          {beliefs.map((belief, i) => (
            <div
              key={belief.step}
              data-belief-card
              className="container-px absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <span className="pointer-events-none select-none font-display text-[22vw] leading-none text-white/[0.04] sm:text-[16rem]">
                {belief.step}
              </span>
              <div className="mt-[-8vw] max-w-3xl sm:mt-[-6rem]">
                <h3 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
                  {belief.title}
                </h3>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
                  {belief.description}
                </p>
              </div>
            </div>
          ))}

          <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
            {beliefs.map((belief, i) => (
              <span
                key={belief.step}
                className="h-1.5 rounded-full bg-accent-soft transition-all duration-500"
                style={{ width: i === activeStep ? '1.5rem' : '0.375rem', opacity: i === activeStep ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
