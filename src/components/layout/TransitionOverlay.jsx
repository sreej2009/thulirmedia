import { useEffect, useRef } from 'react'
import { registerTransitionOverlay, registerTransitionWordmark } from '../../lib/pageTransition'

export default function TransitionOverlay() {
  const ref = useRef(null)
  const wordmarkRef = useRef(null)

  useEffect(() => {
    registerTransitionOverlay(ref.current)
    registerTransitionWordmark(wordmarkRef.current)
    return () => {
      registerTransitionOverlay(null)
      registerTransitionWordmark(null)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center"
      style={{ display: 'none' }}
    >
      <span
        ref={wordmarkRef}
        className="font-display text-sm uppercase tracking-[0.4em] text-ink opacity-0"
      >
        Thulir Media
      </span>
    </div>
  )
}
