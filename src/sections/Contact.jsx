import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import SectionHeading from '../components/ui/SectionHeading'
import MagneticButton from '../components/ui/MagneticButton'
import { socials } from '../data/content'

const EMAIL = 'hello@aether.dev'

export default function Contact() {
  const rootRef = useRef(null)
  const blobRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-contact-reveal]', {
        y: 30,
        opacity: 0,
        rotateX: -20,
        transformOrigin: '50% 100%',
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      gsap.from('[data-contact-field]', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 65%',
          once: true,
        },
      })

      gsap.to(blobRef.current, {
        y: 140,
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project inquiry from ${form.name || 'your site'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative overflow-hidden bg-void py-28 md:py-40"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent-dim/20 blur-[120px] will-change-transform"
      />

      <div className="container-px relative">
        <div data-contact-reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something exceptional together."
            align="center"
            description="Have a project in mind, or just want to say hello? My inbox is always open."
          />
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div data-contact-reveal className="flex flex-col gap-8">
            <MagneticButton
              as="a"
              href={`mailto:${EMAIL}`}
              className="inline-block w-fit break-all font-display text-2xl text-gradient sm:text-3xl"
            >
              {EMAIL}
            </MagneticButton>

            <div className="flex flex-col gap-2 text-sm text-mist">
              <span>Based in — Remote / Worldwide</span>
              <span>Available for freelance &amp; full-time roles</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="rounded-full border border-line px-4 py-2 text-xs text-mist transition-colors hover:border-accent-soft/50 hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              data-contact-field
              type="text"
              name="name"
              required
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="glass rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-mist focus:border-accent-soft/50 focus:outline-none"
            />
            <input
              data-contact-field
              type="email"
              name="email"
              required
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              className="glass rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-mist focus:border-accent-soft/50 focus:outline-none"
            />
            <textarea
              data-contact-field
              name="message"
              required
              rows={4}
              placeholder="Tell me about your project"
              value={form.message}
              onChange={handleChange}
              className="glass resize-none rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-mist focus:border-accent-soft/50 focus:outline-none"
            />
            <MagneticButton
              data-contact-field
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void"
            >
              Send message
            </MagneticButton>
          </form>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-mist sm:flex-row">
          <span>© {new Date().getFullYear()} Aether. All rights reserved.</span>
          <span>Designed &amp; built with React, Three.js &amp; GSAP.</span>
        </div>
      </div>
    </section>
  )
}
