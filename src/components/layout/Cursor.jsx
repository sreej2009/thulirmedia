import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useIsTouch } from '../../hooks/useIsMobile'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="hover"]'
const TEXT_SELECTOR = '[data-cursor-text]'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const isTouch = useIsTouch()

  useEffect(() => {
    if (isTouch) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current

    const moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
    const moveRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const moveLabel = gsap.quickTo(label, 'x', { duration: 0.5, ease: 'power3.out' })
    const moveLabelY = gsap.quickTo(label, 'y', { duration: 0.5, ease: 'power3.out' })

    let labelShown = false
    const hideLabel = () => {
      if (!labelShown) return
      labelShown = false
      gsap.to(label, { opacity: 0, scale: 0.85, duration: 0.25, ease: 'power2.out' })
      ring.classList.remove('!opacity-0')
    }

    const onMove = (e) => {
      moveDot(e.clientX)
      moveDotY(e.clientY)
      moveRing(e.clientX)
      moveRingY(e.clientY)
      moveLabel(e.clientX)
      moveLabelY(e.clientY)

      // A panel (e.g. the mega-menu) can go from interactive to
      // pointer-events:none without firing a native mouseout on its
      // children, since nothing actually moved — that leaves the label
      // stuck showing stale text. Self-heal every move: if we think a
      // text element is hovered, confirm the cursor is still really over
      // one (and hittable), or clear it.
      if (labelShown) {
        const under = document.elementFromPoint(e.clientX, e.clientY)
        if (!under?.closest?.(TEXT_SELECTOR)) hideLabel()
      }
    }

    // event delegation, not a one-time querySelectorAll — so this keeps
    // working across route changes and any content mounted after first paint.
    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.add('scale-150', '!border-accent')
      }
      const textEl = e.target.closest?.(TEXT_SELECTOR)
      if (textEl) {
        labelShown = true
        label.textContent = textEl.dataset.cursorText
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' })
        ring.classList.add('!opacity-0')
      }
    }
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.remove('scale-150', '!border-accent')
      }
      if (e.target.closest?.(TEXT_SELECTOR)) hideLabel()
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
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 transition-[transform,border-color,opacity] duration-200 mix-blend-difference"
      />
      <div
        ref={labelRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 scale-[0.85] whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-void opacity-0"
      />
    </>
  )
}
