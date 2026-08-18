import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

// Only renders when a project carries a real testimonial — no placeholder
// or invented quotes are ever shown here.
export default function Testimonial({ project }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!project.testimonial) return
    const ctx = gsap.context(() => {
      gsap.from('[data-testimonial-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [project.testimonial])

  if (!project.testimonial) return null

  const { quote, author, role } = project.testimonial

  return (
    <section id="cs-testimonial" ref={rootRef} className="relative bg-void py-20 md:py-28">
      <div className="container-px mx-auto max-w-3xl text-center">
        <p data-testimonial-reveal className="font-display text-2xl leading-snug text-ink md:text-3xl">
          &ldquo;{quote}&rdquo;
        </p>
        <p data-testimonial-reveal className="mt-6 text-sm text-mist">
          {author}{role ? `, ${role}` : ''}
        </p>
      </div>
    </section>
  )
}
