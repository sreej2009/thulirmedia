import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import GrowthOrbScene from '../canvas/GrowthOrbScene'
import MagneticButton from '../../components/ui/MagneticButton'

const EMAIL = 'infothulirmedia@gmail.com'

export default function DMFinalCTA() {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta-reveal]', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="dm-contact"
      ref={rootRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-void"
    >
      <div className="absolute inset-0">
        <GrowthOrbScene reducedMotion={reducedMotion} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
      </div>

      <div className="container-px relative z-10 flex flex-col items-center py-28 text-center md:py-40">
        <span
          data-cta-reveal
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft"
        >
          <span className="h-px w-8 bg-accent-soft" />
          Let&rsquo;s Talk
        </span>

        <h2
          data-cta-reveal
          className="max-w-3xl font-display text-[13vw] leading-[0.95] sm:text-[9vw] md:text-[6vw] lg:text-6xl"
        >
          Ready to <span className="text-gradient">Grow?</span>
        </h2>

        <p data-cta-reveal className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg">
          Let&rsquo;s build something people can&rsquo;t ignore.
        </p>

        <div data-cta-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            as="a"
            href={`mailto:${EMAIL}?subject=${encodeURIComponent('Starting a project with Thulir Media')}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-void"
          >
            Start a Project
          </MagneticButton>
          <MagneticButton
            as={Link}
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-line px-8 py-4 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
          >
            ← Back to main site
          </MagneticButton>
        </div>

        <p data-cta-reveal className="mt-14 text-xs text-mist">
          {EMAIL} · Thulir Media
        </p>
      </div>
    </section>
  )
}
