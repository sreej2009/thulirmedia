import { useEffect, useRef, useState } from 'react'

// Pauses R3F's render loop (frameloop="never") once a scene's container has
// scrolled well outside the viewport, and resumes it as it approaches —
// avoids paying continuous GPU/JS cost for canvases nobody is looking at.
export function useCanvasInView(rootMargin = '40% 0px') {
  const containerRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { containerRef, inView }
}
