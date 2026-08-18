import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'

export default function MagneticButton({ children, className = '', as: Tag = 'button', ...props }) {
  const ref = useRef(null)
  const isTouch = useIsTouch()

  const handleMove = (e) => {
    if (isTouch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(ref.current, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power3.out' })
  }

  const handleLeave = () => {
    if (isTouch || !ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      className={`group relative isolate overflow-hidden ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent mix-blend-difference transition-transform duration-700 ease-out group-hover:translate-x-[120%]"
      />
      <span className="relative">{children}</span>
    </Tag>
  )
}
