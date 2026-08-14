import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MagneticButton from '../../components/ui/MagneticButton'

const links = [
  { label: 'Services', href: '#dm-services' },
  { label: 'Ecosystem', href: '#dm-ecosystem' },
  { label: 'Results', href: '#dm-analytics' },
  { label: 'Process', href: '#dm-process' },
]

export default function DMNavbar() {
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
        <Link to="/" data-cursor="hover" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Thulir Media<span className="text-accent-soft">.</span>
          </span>
          <span className="hidden rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-mist sm:inline">
            Growth
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((item) => (
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

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/"
            data-cursor="hover"
            className="text-sm text-mist transition-colors hover:text-ink"
          >
            ← Main site
          </Link>
          <MagneticButton
            as="a"
            href="#dm-contact"
            onClick={(e) => handleNavClick(e, '#dm-contact')}
            className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent-soft/60"
          >
            Start a Project
          </MagneticButton>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
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
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="container-px flex flex-col gap-1 pb-6">
          {links.map((item) => (
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
          <li>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block py-3 text-base text-mist transition-colors hover:text-ink"
            >
              ← Main site
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
