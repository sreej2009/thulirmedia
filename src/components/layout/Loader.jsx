import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'

export default function Loader({ onComplete, label = 'Aether' }) {
  const [progress, setProgress] = useState(0)
  const rootRef = useRef(null)

  useEffect(() => {
    const counter = { val: 0 }
    const tween = gsap.to(counter, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(counter.val)),
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.2,
          onComplete,
        })
      },
    })
    return () => tween.kill()
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void"
    >
      <span className="font-display text-sm uppercase tracking-[0.3em] text-mist">
        {label}
      </span>
      <div className="mt-6 h-px w-48 overflow-hidden bg-line sm:w-64">
        <div
          className="h-full bg-gradient-to-r from-accent-dim to-accent-soft transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-4 font-mono text-xs text-mist">{progress}%</span>
    </div>
  )
}
