import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { revealWords } from '../lib/textReveal'
import SectionHeading from '../components/ui/SectionHeading'
import CountUp from '../components/ui/CountUp'
import { stats } from '../data/content'

export default function About() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splits = gsap.utils.toArray('[data-about-para]').map((el) => revealWords(el))

      gsap.utils.toArray('[data-about-stat]').forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          rotateX: -35,
          transformOrigin: '50% 100%',
          duration: 0.9,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })

      gsap.fromTo(
        '[data-about-rule]',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          ease: 'power2.out',
          duration: 1.1,
          scrollTrigger: {
            trigger: '[data-about-rule]',
            start: 'top 90%',
            once: true,
          },
        }
      )

      return () => splits.forEach((s) => s?.revert())
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={rootRef} className="relative bg-void py-28 md:py-40" style={{ perspective: '1000px' }}>
      <div className="container-px">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <SectionHeading
            eyebrow="About"
            title="I build the web's most memorable interfaces."
          />

          <div className="flex flex-col justify-center gap-6">
            <p data-about-para className="text-base leading-relaxed text-mist md:text-lg">
              For the past seven years I've partnered with startups and global brands to
              design and engineer digital products that feel effortless. My work sits at
              the intersection of front-end engineering, real-time 3D and motion design —
              obsessing over the details most people never consciously notice, but always feel.
            </p>
            <p data-about-para className="text-base leading-relaxed text-mist md:text-lg">
              I care deeply about performance and craft in equal measure: every interaction
              is tuned, every frame accounted for, every pixel considered.
            </p>
          </div>
        </div>

        <div className="relative mt-20 pt-12 md:mt-28">
          <div className="absolute top-0 left-0 h-px w-full bg-line" />
          <div
            data-about-rule
            className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent-soft via-accent-dim to-transparent"
          />
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} data-about-stat className="flex flex-col gap-2">
                <span className="font-display text-4xl text-ink md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-sm text-mist">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
