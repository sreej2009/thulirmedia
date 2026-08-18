import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../../lib/gsap'
import { usePrefersReducedMotion } from '../../../hooks/useIsMobile'
import MagneticButton from '../../../components/ui/MagneticButton'
import ClosingOrb from '../canvas/ClosingOrb'
import SceneErrorBoundary from '../../../components/canvas/SceneErrorBoundary'
import { SITE_EMAIL } from '../../../lib/seo'

export default function ClosingCTA({
  id,
  eyebrow = "Let's Talk",
  titleLines,
  sub,
  primaryLabel = 'Start a Project',
  subject,
  secondaryLabel,
  secondaryHref,
  color = '#a78bfa',
  shape = 'icosahedron',
}) {
  const rootRef = useRef(null)
  const orbWrapRef = useRef(null)
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

      if (!reducedMotion) {
        // A quiet sense of arrival: the core converges into full presence
        // as the section centers, rather than just being there already.
        gsap.fromTo(
          orbWrapRef.current,
          { scale: 0.82, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'center center', scrub: 0.6 },
          }
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id={id}
      ref={rootRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-void"
    >
      <div ref={orbWrapRef} className="absolute inset-0 will-change-transform">
        <SceneErrorBoundary>
          <ClosingOrb color={color} shape={shape} reducedMotion={reducedMotion} />
        </SceneErrorBoundary>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
      </div>

      <div className="container-px relative z-10 flex flex-col items-center py-28 text-center md:py-40">
        <span
          data-cta-reveal
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color }}
        >
          <span className="h-px w-8" style={{ background: color }} />
          {eyebrow}
        </span>

        <h2
          data-cta-reveal
          className="max-w-3xl font-display text-[13vw] leading-[0.95] sm:text-[9vw] md:text-[6vw] lg:text-6xl"
          style={{ textShadow: '0 4px 40px rgba(10,10,12,0.7)' }}
        >
          {titleLines.map((line, i) => (
            <span key={i} className={i === titleLines.length - 1 ? 'text-gradient' : ''}>
              {line}{i < titleLines.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>

        <p
          data-cta-reveal
          className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg"
          style={{ textShadow: '0 2px 16px rgba(10,10,12,0.9)' }}
        >
          {sub}
        </p>

        <div data-cta-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            as={Link}
            to="/contact"
            state={{ subject }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-void"
          >
            {primaryLabel}
          </MagneticButton>
          {secondaryLabel && (
            <MagneticButton
              as="a"
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-line px-8 py-4 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
            >
              {secondaryLabel}
            </MagneticButton>
          )}
        </div>

        <p data-cta-reveal className="mt-14 text-xs text-mist">
          {SITE_EMAIL} · Thulir Media
        </p>
      </div>
    </section>
  )
}
