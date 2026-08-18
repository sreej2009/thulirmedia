import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { usePrefersReducedMotion } from '../hooks/useIsMobile'
import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import ClosingOrb from '../services/shared/canvas/ClosingOrb'
import SceneErrorBoundary from '../components/canvas/SceneErrorBoundary'
import { servicesRegistry } from '../services/shared/registry'
import { buildBreadcrumbSchema, SITE_EMAIL } from '../lib/seo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// The submission endpoint is deliberately environment-configured, not
// hardcoded — this project ships with no backend, so until a real one is
// wired up (VITE_CONTACT_ENDPOINT) the form is honest about that instead
// of pretending a message was sent.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

const SERVICE_OPTIONS = [
  { value: '', label: 'What are you looking for?' },
  ...servicesRegistry.map((s) => ({ value: s.label, label: s.label })),
  { value: 'Something else', label: 'Something else' },
]

function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-rose-400">
      {children}
    </p>
  )
}

export default function Contact() {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const location = useLocation()

  // A ClosingCTA elsewhere on the site may hand off a subject line like
  // "Starting a Digital Marketing project with Thulir Media" via router
  // state — pre-select the matching service instead of losing that context.
  const prefilledService = servicesRegistry.find((s) =>
    location.state?.subject?.includes(s.label)
  )?.label ?? ''

  const [values, setValues] = useState({ name: '', email: '', service: prefilledService, message: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | unconfigured

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-contact-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
  }

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email address doesn’t look right.'
    if (!values.message.trim()) next.message = 'Tell us a little about the project.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: real users never fill this hidden field. Bots that
    // blindly fill every input do — silently accept without submitting.
    if (values.company) {
      setStatus('success')
      return
    }

    if (!validate()) return

    if (!ENDPOINT) {
      setStatus('unconfigured')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          service: values.service,
          message: values.message,
        }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const mailtoHref = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(
    values.service ? `${values.service} — Project Inquiry` : 'Project Inquiry'
  )}&body=${encodeURIComponent(
    `${values.message}\n\n— ${values.name || ''} (${values.email || ''})`
  )}`

  return (
    <>
      <SEOHead
        path="/contact"
        title="Start a Project | Thulir Media"
        description="Tell us about your project — digital marketing, websites, apps, SEO, social content or brand identity — and we'll get back to you."
        jsonLd={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <ServicesNav />
      <main ref={rootRef} className="relative min-h-svh overflow-hidden bg-void pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-40">
          <SceneErrorBoundary>
            <ClosingOrb color="#a78bfa" shape="icosahedron" reducedMotion={reducedMotion} />
          </SceneErrorBoundary>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/60 to-void" />
        </div>

        <div className="container-px relative z-10 mx-auto max-w-2xl text-center">
          <span data-contact-reveal className="mb-6 inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
            <span className="h-px w-8 bg-accent-soft" />
            Let&rsquo;s Talk
            <span className="h-px w-8 bg-accent-soft" />
          </span>

          <h1 data-contact-reveal className="font-display text-[11vw] leading-[0.95] sm:text-6xl md:text-7xl">
            Start a <span className="text-gradient">Project.</span>
          </h1>

          <p data-contact-reveal className="mx-auto mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg">
            Tell us what you&rsquo;re building. We&rsquo;ll reply personally — no forms disappearing into a queue.
          </p>
        </div>

        <div data-contact-reveal className="container-px relative z-10 mx-auto mt-14 max-w-xl">
          {status === 'success' ? (
            <div className="glass rounded-2xl border border-line p-8 text-center">
              <p className="font-display text-2xl text-ink">Message sent.</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Thanks — we&rsquo;ll get back to you at {values.email || 'the email you provided'} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="glass flex flex-col gap-5 rounded-2xl border border-line p-6 sm:p-8">
              {/* Honeypot — hidden from real users via CSS, visible in the DOM for bots that don't respect it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={handleChange('company')}
                />
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="w-full rounded-xl border border-line bg-void/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus-visible:border-accent-soft/70"
                />
                <FieldError id="name-error">{errors.name}</FieldError>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full rounded-xl border border-line bg-void/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus-visible:border-accent-soft/70"
                />
                <FieldError id="email-error">{errors.email}</FieldError>
              </div>

              <div>
                <label htmlFor="service" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={values.service}
                  onChange={handleChange('service')}
                  className="w-full rounded-xl border border-line bg-void/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus-visible:border-accent-soft/70"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-charcoal">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={handleChange('message')}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="w-full resize-none rounded-xl border border-line bg-void/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus-visible:border-accent-soft/70"
                />
                <FieldError id="message-error">{errors.message}</FieldError>
              </div>

              {status === 'unconfigured' && (
                <div role="status" className="rounded-xl border border-accent-soft/30 bg-accent-dim/10 p-4 text-sm leading-relaxed text-mist">
                  This form isn&rsquo;t wired up to send messages automatically yet — but your note is ready to go.{' '}
                  <a href={mailtoHref} className="font-medium text-ink underline underline-offset-2" data-cursor="hover">
                    Open it in your email app
                  </a>{' '}
                  and hit send, or email us directly at{' '}
                  <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-ink underline underline-offset-2" data-cursor="hover">
                    {SITE_EMAIL}
                  </a>
                  .
                </div>
              )}

              {status === 'error' && (
                <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm leading-relaxed text-mist">
                  Something went wrong sending that — please try again, or email us directly at{' '}
                  <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-ink underline underline-offset-2" data-cursor="hover">
                    {SITE_EMAIL}
                  </a>
                  .
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                data-cursor="hover"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void transition-opacity disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>

              <p className="text-center text-xs text-mist">
                Prefer email? Reach us directly at{' '}
                <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-2" data-cursor="hover">
                  {SITE_EMAIL}
                </a>
              </p>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
