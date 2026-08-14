import { useEffect, useState } from 'react'
import { nav } from '../../data/content'
import MagneticButton from '../ui/MagneticButton'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const target = document.querySelector(href)
    if (!target) return
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -40, duration: 1.4 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-20 items-center justify-between">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, '#top')}
          className="font-display text-lg font-semibold tracking-tight"
          data-cursor="hover"
        >
          Aether<span className="text-accent-soft">.</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm text-mist transition-colors hover:text-ink"
                data-cursor="hover"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <MagneticButton
          as="a"
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="hidden rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent-soft/60 md:inline-flex"
        >
          Let's talk
        </MagneticButton>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="container-px flex flex-col gap-1 pb-6">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block py-3 text-base text-mist transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
