import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import MagneticButton from '../components/ui/MagneticButton'

export default function NotFound() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-nf-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <SEOHead
        path="/404"
        title="Page Not Found — Thulir Media"
        description="The page you're looking for doesn't exist or has moved."
        noindex
      />
      <ServicesNav />
      <main ref={rootRef} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(167,139,250,0.08),transparent)]" />

        <span data-nf-reveal className="relative mb-4 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          Error 404
        </span>

        <h1 data-nf-reveal className="relative font-display text-[24vw] leading-none text-white/10 sm:text-[16rem]">
          404
        </h1>

        <p data-nf-reveal className="relative mt-[-4vw] max-w-md text-lg font-medium text-ink sm:mt-[-3rem] sm:text-xl">
          This page doesn't exist — or it moved.
        </p>
        <p data-nf-reveal className="relative mt-3 max-w-md text-base leading-relaxed text-mist">
          Double-check the link, or pick up from one of these instead.
        </p>

        <div data-nf-reveal className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            as={Link}
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void"
          >
            Back to Home
          </MagneticButton>
          <MagneticButton
            as={Link}
            to="/work"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
          >
            See Our Work
          </MagneticButton>
        </div>
      </main>
    </>
  )
}
