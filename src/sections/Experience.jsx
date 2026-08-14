import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import SectionHeading from '../components/ui/SectionHeading'
import { experience } from '../data/content'

export default function Experience() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-exp-item]').forEach((el) => {
        const dot = el.querySelector('[data-exp-dot]')

        gsap.from(el, {
          clipPath: 'inset(0% 0% 0% 100%)',
          x: -20,
          opacity: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })

        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.6,
            ease: 'back.out(2.5)',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          })
        }
      })

      gsap.fromTo(
        '[data-exp-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={rootRef} className="relative bg-void py-28 md:py-40">
      <div className="container-px">
        <SectionHeading
          eyebrow="Experience"
          title="A track record of shipping ambitious work."
        />

        <div className="relative mt-16">
          <div className="absolute left-[7px] top-0 h-full w-px bg-line md:left-[7px]">
            <div
              data-exp-line
              className="h-full w-full bg-gradient-to-b from-accent-soft to-accent-dim"
            />
          </div>

          <div className="flex flex-col gap-12">
            {experience.map((item) => (
              <div key={item.role + item.company} data-exp-item className="relative pl-10">
                <span
                  data-exp-dot
                  className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent-soft bg-void"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-medium text-ink md:text-xl">
                    {item.role} <span className="text-mist">— {item.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-mist">{item.period}</span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist md:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
