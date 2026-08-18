import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../../lib/gsap'
import SectionHeading from '../../../components/ui/SectionHeading'

function FAQItem({ item, index, open, onToggle, accent }) {
  const panelRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current
    if (!panel || !inner) return
    gsap.to(panel, {
      height: open ? inner.offsetHeight : 0,
      duration: 0.5,
      ease: 'power3.inOut',
    })
  }, [open])

  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          data-cursor="hover"
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-base font-medium text-ink md:text-lg">{item.q}</span>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-sm transition-transform duration-500"
            style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', color: accent }}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden"
        style={{ height: 0 }}
      >
        <div ref={innerRef} className="pb-6 pr-12 text-sm leading-relaxed text-mist md:text-base">
          {item.a}
        </div>
      </div>
    </div>
  )
}

export default function FAQAccordion({ id, eyebrow, title, description, items, accent = '#a78bfa' }) {
  const rootRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-faq-item]', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={rootRef} className="relative bg-void py-24 md:py-32">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 border-t border-line">
          {items.map((item, i) => (
            <div key={item.q} data-faq-item>
              <FAQItem
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
                accent={accent}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
