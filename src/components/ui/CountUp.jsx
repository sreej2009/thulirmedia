import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function CountUp({ value, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const counter = { val: 0 }

    const tween = gsap.to(counter, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        const formatted = decimals > 0 ? counter.val.toFixed(decimals) : Math.round(counter.val)
        el.textContent = prefix + formatted + suffix
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [value, suffix, prefix, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
