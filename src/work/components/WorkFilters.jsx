import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { filters } from '../data'

export default function WorkFilters({ active, onChange }) {
  const listRef = useRef(null)
  const indicatorRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return
    const activeBtn = list.querySelector(`[data-filter-key="${active}"]`)
    if (!activeBtn) return

    const listRect = list.getBoundingClientRect()
    const btnRect = activeBtn.getBoundingClientRect()

    gsap.to(indicator, {
      x: btnRect.left - listRect.left,
      width: btnRect.width,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [active])

  return (
    <div ref={listRef} className="relative flex flex-wrap gap-2">
      <div
        ref={indicatorRef}
        className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-ink"
        style={{ width: 0 }}
      />
      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          data-filter-key={f.key}
          onClick={() => onChange(f.key)}
          data-cursor="hover"
          className={`relative z-10 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
            active === f.key
              ? 'border-ink text-void'
              : 'border-line text-mist hover:border-accent-soft/40 hover:text-ink'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
