import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="hover"]'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isTouch = useIsTouch()

  useEffect(() => {
    if (isTouch) return

    const dot = dotRef.current
    const ring = ringRef.current

    const moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
    const moveRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e) => {
      moveDot(e.clientX)
      moveDotY(e.clientY)
      moveRing(e.clientX)
      moveRingY(e.clientY)
    }

    // event delegation, not a one-time querySelectorAll — so this keeps
    // working across route changes and any content mounted after first paint.
    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.add('scale-150', '!border-accent')
      }
    }
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.remove('scale-150', '!border-accent')
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 transition-[transform,border-color] duration-200 mix-blend-difference"
      />
    </>
  )
}
