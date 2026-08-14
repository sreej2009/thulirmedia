import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import SectionHeading from '../components/ui/SectionHeading'
import { Icon } from '../components/ui/icons'
import { services } from '../data/content'

export default function Services() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-service-row]', {
        clipPath: 'inset(0% 0% 0% 100%)',
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      gsap.utils.toArray('[data-service-index]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.7,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={rootRef} className="relative bg-void py-28 md:py-40">
      <div className="container-px">
        <SectionHeading
          eyebrow="Services"
          title="What I bring to the table."
        />

        <div className="mt-16 divide-y divide-line border-y border-line">
          {services.map((service, i) => (
            <div
              key={service.title}
              data-service-row
              className="group relative grid grid-cols-1 items-center gap-4 overflow-hidden py-8 transition-colors md:grid-cols-[auto_auto_1fr_auto] md:gap-10"
            >
              <span
                data-service-index
                className="hidden font-display text-5xl text-mist/10 transition-colors duration-500 group-hover:text-accent-soft/20 md:block"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line text-accent-soft transition-colors group-hover:border-accent-soft/50 group-hover:bg-accent-dim/10">
                <Icon name={service.icon} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-ink md:text-2xl">{service.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist md:text-base">
                  {service.description}
                </p>
              </div>
              <span className="hidden font-display text-3xl text-mist/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent-soft/40 md:block">
                →
              </span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent-soft to-accent-dim transition-[width] duration-500 ease-out group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
