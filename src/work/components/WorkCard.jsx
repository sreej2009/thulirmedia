import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { PlaceholderVisual } from './PlaceholderVisual'

export default function WorkCard({ project, index }) {
  const cardRef = useRef(null)
  const visualRef = useRef(null)
  const glowRef = useRef(null)
  const isTouch = useIsTouch()
  const navigate = useNavigate()

  const handleMove = (e) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y / rect.height) - 0.5) * -10
    const rotateY = ((x / rect.width) - 0.5) * 10

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
    })

    if (visualRef.current) {
      gsap.to(visualRef.current, {
        x: ((x / rect.width) - 0.5) * 18,
        y: ((y / rect.height) - 0.5) * 18,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 1, x, y, duration: 0.4, ease: 'power2.out' })
    }
  }

  const handleEnter = () => {
    if (isTouch || !cardRef.current) return
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.5, ease: 'power2.out' })
    gsap.to(cardRef.current.querySelectorAll('[data-work-reveal]'), {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    if (isTouch || !cardRef.current) return
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
    if (visualRef.current) gsap.to(visualRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' })
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
    gsap.to(cardRef.current.querySelectorAll('[data-work-reveal]'), {
      opacity: 0,
      y: 8,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const handleClick = async (e) => {
    e.preventDefault()
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    await coverTransition(project.accent)
    navigate(`/work/${project.slug}`)
  }

  return (
    <a
      href={`/work/${project.slug}`}
      onClick={handleClick}
      ref={cardRef}
      data-work-card
      data-flip-id={project.slug}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      data-cursor-text="View"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-charcoal/60 transition-colors hover:border-accent-soft/30"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
        style={{ background: project.accent }}
      />

      <div className="relative h-56 overflow-hidden" style={{ transform: 'translateZ(30px)' }}>
        <div ref={visualRef} className="absolute inset-[-10px]">
          <PlaceholderVisual accent={project.accent} frame={project.frame} />
        </div>

        <span
          data-work-reveal
          className={`pointer-events-none absolute bottom-3 right-4 font-display text-5xl text-white/10 transition-all duration-500 ${
            isTouch ? 'opacity-40' : 'translate-y-2 opacity-0'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-6" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-mist">
          <span className="h-1 w-1 rounded-full" style={{ background: project.accent }} />
          {project.category}
          <span className="ml-auto font-mono text-[11px] text-mist">{project.year}</span>
        </div>

        <h3 className="mt-3 text-xl font-medium text-ink transition-transform duration-500 group-hover:-translate-y-0.5">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">{project.description}</p>

        <span
          data-work-reveal
          className={`mt-5 inline-flex w-fit items-center gap-2 text-xs font-medium text-ink transition-all duration-500 ${
            isTouch ? 'opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          View Case Study
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  )
}
