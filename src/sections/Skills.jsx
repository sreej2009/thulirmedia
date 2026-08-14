import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import SectionHeading from '../components/ui/SectionHeading'
import { skillGroups } from '../data/content'

const marqueeWords = ['React Three Fiber', 'GSAP', 'WebGL', 'Shaders', 'Next.js', 'Design Systems']

export default function Skills() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-skill-card]').forEach((el, i) => {
        gsap.from(el, {
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 24,
          opacity: 0,
          duration: 0.9,
          delay: (i % 4) * 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        })
      })

      // base infinite loop
      const marqueeTween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 34,
        repeat: -1,
      })

      // scroll velocity nudges the marquee's speed + direction — it visibly
      // reacts to how the user scrolls, a signature agency-site touch.
      const velocityTracker = ScrollTrigger.create({ trigger: rootRef.current })
      const onTick = () => {
        const v = velocityTracker.getVelocity()
        const boost = gsap.utils.clamp(-3.5, 3.5, v / 700)
        marqueeTween.timeScale(1 + boost)
      }
      gsap.ticker.add(onTick)

      return () => {
        gsap.ticker.remove(onTick)
        velocityTracker.kill()
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={rootRef} className="relative bg-void py-28 md:py-40">
      <div className="container-px">
        <SectionHeading
          eyebrow="Skills"
          title="A toolkit built for cinematic web experiences."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              data-skill-card
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-accent-soft/40"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-dim/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <h3 className="text-base font-medium text-ink">{group.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2.5 text-sm text-mist"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent-soft" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y border-line py-6">
        <div ref={trackRef} className="flex w-max gap-10 whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={i}
              className="font-display text-2xl text-mist/40 md:text-3xl"
            >
              {word} <span className="text-accent-dim/60">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
