import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import CreativeTechScene from '../canvas/CreativeTechScene'
import { creativeTech } from '../data'

export default function CreativeTech() {
  const wrapRef = useRef(null)
  const wordsRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordsRef.current.querySelectorAll('[data-ct-word]')

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
          const idx = Math.min(words.length - 1, Math.floor(self.progress * words.length))
          words.forEach((w, i) => {
            w.style.opacity = i === idx ? '1' : '0'
            w.style.transform = i === idx ? 'translateY(0)' : 'translateY(12px)'
          })
        },
      })
      return () => st.kill()
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about-creative-tech" className="relative bg-void">
      <div
        ref={wrapRef}
        className="relative"
        style={{ height: `${creativeTech.progression.length * 70}vh` }}
      >
        <div className="sticky top-0 flex h-svh w-full flex-col items-center justify-center overflow-hidden">
          <CreativeTechScene progressRef={progressRef} reducedMotion={reducedMotion} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />

          <div className="container-px relative z-10 text-center">
            <span className="mb-6 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
              <span className="h-px w-8 bg-accent-soft" />
              {creativeTech.eyebrow}
            </span>
            <h2 className="font-display text-[11vw] leading-none sm:text-[7vw] md:text-6xl lg:text-7xl">
              {creativeTech.title}
            </h2>

            <div ref={wordsRef} className="relative mt-10 h-16 md:h-20">
              {creativeTech.progression.map((word) => (
                <span
                  key={word}
                  data-ct-word
                  className="absolute inset-0 flex items-center justify-center font-display text-3xl text-gradient transition-[opacity,transform] duration-500 ease-out md:text-5xl"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-mist md:text-lg">
              {creativeTech.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
