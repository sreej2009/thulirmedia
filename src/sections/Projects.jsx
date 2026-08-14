import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useIsMobile } from '../hooks/useIsMobile'
import SectionHeading from '../components/ui/SectionHeading'
import ProjectCard from '../components/ui/ProjectCard'
import { projects } from '../data/content'

export default function Projects() {
  const rootRef = useRef(null)
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [active, setActive] = useState(1)
  const isMobile = useIsMobile(1024)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // desktop: pin the gallery and translate the track horizontally as the
      // user scrolls vertically — the signature agency-site case-study reveal.
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        if (!trackRef.current || !wrapRef.current) return

        const track = trackRef.current
        const wrap = wrapRef.current
        const getScrollAmount = () => track.scrollWidth - wrap.offsetWidth

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => '+=' + getScrollAmount(),
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActive(Math.min(projects.length, Math.round(self.progress * (projects.length - 1)) + 1))
            },
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      // mobile / tablet: simple staggered reveal for the stacked grid
      gsap.utils.toArray('[data-project-card-mobile]').forEach((el, i) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          delay: (i % 2) * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        })
      })

      return () => mm.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [isMobile])

  return (
    <section id="projects" ref={rootRef} className="relative bg-void">
      <div className="container-px pt-28 md:pt-40">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects engineered to leave an impression."
        />
      </div>

      {!isMobile && (
        <>
          {/* desktop: pinned horizontal gallery */}
          <div ref={wrapRef} className="relative mt-16 lg:h-svh lg:overflow-hidden">
            <div
              ref={trackRef}
              className="flex h-full items-center gap-8 pl-[clamp(1.25rem,5vw,6rem)]"
            >
              {projects.map((project, i) => (
                <div key={project.id} className="w-[420px] shrink-0">
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
              <div className="w-[clamp(1.25rem,5vw,6rem)] shrink-0" />
            </div>

            <div className="pointer-events-none absolute bottom-10 left-[clamp(1.25rem,5vw,6rem)] flex items-center gap-3 font-mono text-xs text-mist">
              <span className="text-ink">{String(active).padStart(2, '0')}</span>
              <span className="h-px w-8 bg-line" />
              <span>{String(projects.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="h-28 xl:h-40" />
        </>
      )}

      {isMobile && (
        <div className="container-px mt-16 grid grid-cols-1 gap-6 pb-28 sm:grid-cols-2 md:pb-40">
          {projects.map((project, i) => (
            <div key={project.id} data-project-card-mobile>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
