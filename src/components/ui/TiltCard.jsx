import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'

export default function TiltCard({ children, className = '', glowColor = '#7c5cd6', follower }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const followerRef = useRef(null)
  const isTouch = useIsTouch()

  const handleEnter = () => {
    if (isTouch || !cardRef.current) return
    gsap.to(cardRef.current, { scale: 1.015, duration: 0.5, ease: 'power2.out' })
    if (followerRef.current) {
      gsap.to(followerRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' })
    }
  }

  const handleMove = (e) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y / rect.height) - 0.5) * -14
    const rotateY = ((x / rect.width) - 0.5) * 14

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.5,
      ease: 'power2.out',
    })

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 1,
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    if (followerRef.current) {
      gsap.to(followerRef.current, { x, y, duration: 0.5, ease: 'power3.out' })
    }
  }

  const handleLeave = () => {
    if (isTouch || !cardRef.current) return
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
    if (followerRef.current) gsap.to(followerRef.current, { opacity: 0, scale: 0.7, duration: 0.3, ease: 'power2.in' })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-charcoal/60 transition-colors duration-500 hover:border-accent-soft/30 ${className}`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
        style={{ background: glowColor }}
      />

      {follower && (
        <div
          ref={followerRef}
          className="pointer-events-none absolute left-0 top-0 z-20 -translate-x-1/2 -translate-y-1/2 scale-75 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-medium text-void opacity-0"
        >
          {follower}
        </div>
      )}

      <div className="relative" style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </div>
  )
}
