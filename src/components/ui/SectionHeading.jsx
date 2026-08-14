import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../lib/textReveal'

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const rootRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealLines(titleRef.current, { start: 'top 85%' })

      gsap.from(eyebrowRef.current, {
        opacity: 0,
        x: align === 'center' ? 0 : -16,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      })

      if (descRef.current) {
        gsap.from(descRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.8,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
        })
      }

      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [align])

  const isCenter = align === 'center'

  return (
    <div ref={rootRef} className={`max-w-2xl ${isCenter ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span
          ref={eyebrowRef}
          className={`mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-soft ${isCenter ? 'justify-center' : ''}`}
        >
          <span className="h-px w-6 bg-accent-soft" />
          {eyebrow}
        </span>
      )}
      <h2 ref={titleRef} className="text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p ref={descRef} className="mt-4 text-base leading-relaxed text-mist md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
