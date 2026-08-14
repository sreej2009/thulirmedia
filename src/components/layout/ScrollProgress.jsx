import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress })
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div className="fixed left-0 top-0 z-[70] h-[2px] w-full">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent-dim via-accent-soft to-accent-dim"
      />
    </div>
  )
}
