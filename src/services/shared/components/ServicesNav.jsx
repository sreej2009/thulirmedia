import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from '../../../lib/gsap'
import MagneticButton from '../../../components/ui/MagneticButton'
import { servicesRegistry } from '../registry'

export default function ServicesNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef(null)
  const closeTimer = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!panelRef.current) return
    if (open) {
      gsap.set(panelRef.current, { pointerEvents: 'auto' })
      gsap.to(panelRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' })
    } else {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => gsap.set(panelRef.current, { pointerEvents: 'none' }),
      })
    }
  }, [open])

  const handleEnter = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? 'glass' : 'bg-transparent'}`}
    >
      <nav className="container-px flex h-20 items-center justify-between">
        <Link to="/" data-cursor="hover" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Thulir Media<span className="text-accent-soft">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          <li
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onFocus={handleEnter}
              aria-expanded={open}
              aria-haspopup="true"
              data-cursor="hover"
              className="flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-ink"
            >
              Services
              <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
                ⌄
              </span>
            </button>

            <div
              ref={panelRef}
              aria-hidden={!open}
              style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(-8px) scale(0.98)' }}
              className="glass absolute left-1/2 top-full mt-4 w-[640px] -translate-x-1/2 rounded-2xl border border-line p-3"
              onFocus={handleEnter}
            >
              <div className="grid grid-cols-2 gap-1">
                {servicesRegistry.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    tabIndex={open ? 0 : -1}
                    data-cursor="hover"
                    data-cursor-text="Explore"
                    className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
                  >
                    <span
                      className="mt-0.5 h-9 w-9 shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${service.accent}33, ${service.accent}08)`,
                        boxShadow: `inset 0 0 0 1px ${service.accent}40`,
                      }}
                    >
                      <span className="flex h-full w-full items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: service.accent }} />
                      </span>
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">{service.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-mist">{service.blurb}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li>
            <Link
              to="/work"
              className={`group relative text-sm transition-colors hover:text-ink ${location.pathname.startsWith('/work') ? 'text-ink' : 'text-mist'}`}
              data-cursor="hover"
            >
              Work
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-accent-soft transition-all duration-300 ${location.pathname.startsWith('/work') ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`group relative text-sm transition-colors hover:text-ink ${location.pathname.startsWith('/about') ? 'text-ink' : 'text-mist'}`}
              data-cursor="hover"
            >
              About
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-accent-soft transition-all duration-300 ${location.pathname.startsWith('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`group relative text-sm transition-colors hover:text-ink ${location.pathname === '/contact' ? 'text-ink' : 'text-mist'}`}
              data-cursor="hover"
            >
              Contact
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-accent-soft transition-all duration-300 ${location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <MagneticButton
            as={Link}
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
          >
            Start a Project
          </MagneticButton>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${mobileOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${mobileOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out lg:hidden ${mobileOpen ? 'max-h-[42rem]' : 'max-h-0'}`}
      >
        <ul className="container-px flex flex-col gap-1 pb-2">
          {servicesRegistry.map((service) => (
            <li key={service.path}>
              <Link
                to={service.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: service.accent }} />
                <span className="text-base text-ink">{service.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="container-px flex flex-col gap-1 border-t border-line pb-6 pt-2">
          <li>
            <Link to="/work" onClick={() => setMobileOpen(false)} className="block py-3 text-base text-ink">
              Work
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-3 text-base text-ink">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-base text-ink">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
