import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const isTouch = matchMedia('(pointer: coarse)').matches

    const lenis = new Lenis({
      duration: isTouch ? 1 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: isTouch ? 1.2 : 1,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    window.__lenis = lenis

    return () => {
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}
