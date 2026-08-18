import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/useIsMobile'
import SectionHeading from '../../components/ui/SectionHeading'
import { MediaFrame } from './PlaceholderVisual'

const FALLBACK_ITEMS = [
  { span: 'wide', label: 'Full-width showcase' },
  { span: 'half', label: 'Detail view' },
  { span: 'half', label: 'Detail view' },
]

export default function Gallery({ project }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const items = project.gallery && project.gallery.length > 0 ? project.gallery : FALLBACK_ITEMS

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-gallery-item]', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      })

      if (!reducedMotion) {
        gsap.utils.toArray('[data-gallery-item]').forEach((el, i) => {
          const speed = i % 3 === 0 ? 0 : i % 2 === 0 ? -30 : 30
          if (speed === 0) return
          gsap.to(el, {
            y: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="cs-showcase" ref={rootRef} className="relative overflow-hidden bg-void py-20 md:py-28">
      <div className="container-px">
        <SectionHeading eyebrow="Project Showcase" title="A closer look." />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              data-gallery-item
              className={`overflow-hidden rounded-2xl ${item.span === 'wide' ? 'sm:col-span-2' : ''}`}
            >
              <div className={item.span === 'wide' ? 'aspect-[16/8]' : 'aspect-[4/3]'}>
                <MediaFrame
                  src={item.src}
                  video={item.video}
                  accent={project.accent}
                  frame={project.frame}
                  alt={item.label || project.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
