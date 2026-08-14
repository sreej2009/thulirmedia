import { useEffect, useState } from 'react'
import { nav } from '../../data/content'
import { ScrollTrigger } from '../../lib/gsap'

const items = [{ href: '#top', label: 'Home' }, ...nav]

export default function SectionNav() {
  const [active, setActive] = useState('#top')

  useEffect(() => {
    const triggers = items
      .map((item) => {
        const el = document.querySelector(item.href)
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActive(item.href)
          },
        })
      })
      .filter(Boolean)

    return () => triggers.forEach((t) => t.kill())
  }, [])

  const handleClick = (href) => {
    const target = document.querySelector(href)
    if (!target) return
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -40, duration: 1.4 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {items.map((item) => (
        <button
          key={item.href}
          type="button"
          onClick={() => handleClick(item.href)}
          data-cursor="hover"
          className="group flex items-center gap-3"
          aria-label={`Go to ${item.label}`}
          aria-current={active === item.href}
        >
          <span
            className={`text-[10px] uppercase tracking-[0.15em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              active === item.href ? 'text-accent-soft' : 'text-mist'
            }`}
          >
            {item.label}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full border transition-all duration-300 ${
              active === item.href
                ? 'scale-125 border-accent-soft bg-accent-soft'
                : 'border-mist/50 bg-transparent group-hover:border-accent-soft/60'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
