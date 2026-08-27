import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion, useIsMobile } from '../hooks/useIsMobile'
import { revealLines } from '../lib/textReveal'
import SEOHead from '../components/layout/SEOHead'
import ServicesNav from '../services/shared/components/ServicesNav'
import SceneErrorBoundary from '../components/canvas/SceneErrorBoundary'
import MagneticButton from '../components/ui/MagneticButton'
import ProjectCoreScene from '../contact/canvas/ProjectCoreScene'
import { servicesRegistry } from '../services/shared/registry'
import { buildBreadcrumbSchema, SITE_EMAIL } from '../lib/seo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// The submission endpoint is deliberately environment-configured, not
// hardcoded — this project ships with no backend, so until a real one is
// wired up (VITE_CONTACT_ENDPOINT) the form is honest about that instead
// of pretending a message was sent.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

const SERVICE_OPTIONS = [
  ...servicesRegistry.map((s) => ({ value: s.label, label: s.label, accent: s.accent })),
  { value: 'Something else', label: 'Something else', accent: '#c4b5fd' },
]

// Which orbiting Project Core label lights up for a given service choice.
const SERVICE_FOCUS = {
  'Digital Marketing': 'growth',
  'Website Development': 'tech',
  'App Development': 'tech',
  SEO: 'growth',
  'Social Media & Content': 'content',
  'Branding & Creative': 'design',
}

const STEPS = [
  { key: 'about', number: '01', label: 'About You', prompt: 'Who are we talking to?', hint: 'So we know how to reach you back.' },
  { key: 'project', number: '02', label: 'Project', prompt: 'What are we building?', hint: 'Pick the closest fit — we can adjust scope together.' },
  { key: 'details', number: '03', label: 'Details', prompt: 'Tell us about the project.', hint: 'The more context, the sharper our first reply.' },
  { key: 'review', number: '04', label: 'Review', prompt: 'Ready to start?', hint: 'One check, then it’s on its way to us.' },
]

function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-rose-400">
      {children}
    </p>
  )
}

function ConnectionFlow() {
  const dotRefs = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      dotRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { xPercent: 0, opacity: 0 },
          { xPercent: 260, opacity: 1, duration: 2.2, delay: i * 0.5, repeat: -1, ease: 'power1.inOut', repeatDelay: 0.4 }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  const NODES = ['Thulir Media', 'Project', 'Conversation']
  return (
    <div className="flex items-center justify-center gap-0 text-[10px] font-medium uppercase tracking-[0.18em] text-mist md:justify-end">
      {NODES.map((n, i) => (
        <span key={n} className="flex items-center">
          <span className={i === 0 ? 'text-ink' : ''}>{n}</span>
          {i < NODES.length - 1 && (
            <span className="relative mx-3 h-px w-16 overflow-hidden bg-line">
              <span
                ref={(el) => (dotRefs.current[i] = el)}
                className="absolute inset-y-0 left-0 h-full w-2 rounded-full bg-accent-soft opacity-0"
              />
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function Contact() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const stepContentRef = useRef(null)
  const stepHeadingRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const location = useLocation()

  // A ClosingCTA elsewhere on the site may hand off a subject line like
  // "Starting a Digital Marketing project with Thulir Media" via router
  // state — pre-select the matching service instead of losing that context.
  const prefilledService = servicesRegistry.find((s) => location.state?.subject?.includes(s.label))?.label ?? ''

  const [values, setValues] = useState({ name: '', email: '', service: prefilledService, message: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | unconfigured
  const [step, setStep] = useState(0)

  const focusRef = useRef('about')
  const serviceColorRef = useRef(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const match = servicesRegistry.find((s) => s.label === prefilledService)
    if (match) serviceColorRef.current = match.accent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stepDefaultFocus = (targetStep = step) => {
    if (targetStep === 0) return 'about'
    if (targetStep === 1) return values.service ? SERVICE_FOCUS[values.service] || 'about' : 'about'
    if (targetStep === 2) return 'details'
    return status === 'success' ? 'success' : 'review'
  }

  useEffect(() => {
    focusRef.current = stepDefaultFocus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, values.service, status])

  // Entrance choreography: eyebrow -> headline -> supporting text -> form.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealLines('[data-c-headline]', { start: 'top 90%' })
      gsap.from('[data-c-reveal]', {
        y: 20,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.15,
      })
      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Subtle, non-pinned scroll parallax for the 3D scene's camera.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollRef.current = self.progress
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Brief, calm fade when moving between steps — usability first. Focus
  // moves to the new step's heading (not on first mount) so keyboard and
  // screen-reader users land somewhere meaningful instead of losing their
  // place when the step content swaps out from under them.
  const isFirstStepRender = useRef(true)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(stepContentRef.current, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' })
    }, rootRef)
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false
    } else {
      stepHeadingRef.current?.focus()
    }
    return () => ctx.revert()
  }, [step])

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))
  const handleFocus = (key) => () => {
    focusRef.current = key
  }
  const handleBlur = () => {
    focusRef.current = stepDefaultFocus()
  }

  const handleServiceSelect = (opt) => {
    setValues((v) => ({ ...v, service: opt.value }))
    serviceColorRef.current = opt.accent
    focusRef.current = SERVICE_FOCUS[opt.value] || 'about'
  }

  const runValidation = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email address doesn’t look right.'
    if (!values.message.trim()) next.message = 'Tell us a little about the project.'
    return next
  }

  const goNext = () => {
    if (step === 0) {
      const next = {}
      if (!values.name.trim()) next.name = 'Please enter your name.'
      if (!values.email.trim()) next.email = 'Please enter your email.'
      else if (!EMAIL_RE.test(values.email.trim())) next.email = 'That email address doesn’t look right.'
      if (Object.keys(next).length) {
        setErrors((e) => ({ ...e, ...next }))
        return
      }
    }
    if (step === 2 && !values.message.trim()) {
      setErrors((e) => ({ ...e, message: 'Tell us a little about the project.' }))
      return
    }
    setErrors({})
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step < STEPS.length - 1 && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      goNext()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: real users never fill this hidden field. Bots that
    // blindly fill every input do — silently accept without submitting.
    if (values.company) {
      setStatus('success')
      return
    }

    const validationErrors = runValidation()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) {
      if (validationErrors.name || validationErrors.email) setStep(0)
      else if (validationErrors.message) setStep(2)
      return
    }

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
  )}&body=${encodeURIComponent(`${values.message}\n\n— ${values.name || ''} (${values.email || ''})`)}`

  const currentStepMeta = STEPS[step]

  const headerBlock = (
    <>
      <span data-c-reveal className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
        <span className="h-px w-8 bg-accent-soft" />
        Let&rsquo;s Talk
      </span>
      <h1 data-c-headline className="font-display text-[13vw] leading-[0.98] sm:text-6xl md:text-7xl lg:text-[4.5rem]">
        Start a
        <br />
        <span className="text-gradient">Project.</span>
      </h1>
      <p data-c-reveal className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg">
        Tell us what you&rsquo;re building. We&rsquo;ll reply personally — no forms disappearing into a queue.
      </p>
      <p data-c-reveal className="mt-5 max-w-sm text-sm leading-relaxed text-mist/80 md:text-base">
        We&rsquo;ll turn the first conversation into a clear direction.
      </p>
    </>
  )

  const progressBlock = (
    <div className="mb-9">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-medium uppercase tracking-[0.15em]">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => i < step && setStep(i)}
            disabled={i >= step}
            aria-current={i === step ? 'step' : undefined}
            className={`transition-colors duration-300 ${i <= step ? 'text-ink' : 'cursor-default text-mist/45'}`}
          >
            {s.number} — {s.label}
          </button>
        ))}
      </div>
      <div className="relative mt-3 h-px w-full bg-line">
        <div
          className="absolute inset-y-0 left-0 bg-accent-soft transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )

  const formBlock = (
    <div data-c-reveal>
      {status === 'success' ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-soft">Project Received.</p>
          <h2 className="mt-4 font-display text-3xl leading-[1.05] text-ink md:text-4xl">
            Thanks for reaching out.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist md:text-base">
            We&rsquo;ll review your brief and get back to you at {values.email || 'the email you provided'} shortly.
          </p>
          <p className="mt-6 text-sm font-medium text-ink">Your next project starts here.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="w-full">
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

          {progressBlock}

          <div ref={stepContentRef}>
            <p className="text-xs uppercase tracking-[0.18em] text-mist">{currentStepMeta.hint}</p>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-2 font-display text-2xl text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/70 md:text-3xl">
              {currentStepMeta.prompt}
            </h2>

            <div className="mt-8 flex flex-col gap-8">
              {step === 0 && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      autoFocus={!isMobile}
                      value={values.name}
                      onChange={handleChange('name')}
                      onFocus={handleFocus('about')}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      placeholder="Your name"
                      className="mt-3 w-full border-0 border-b border-line bg-transparent pb-3 font-display text-2xl text-ink outline-none transition-colors duration-300 placeholder:text-mist/25 focus:border-accent-soft md:text-3xl"
                    />
                    <FieldError id="name-error">{errors.name}</FieldError>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      onFocus={handleFocus('about')}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      placeholder="you@company.com"
                      className="mt-3 w-full border-0 border-b border-line bg-transparent pb-3 font-display text-2xl text-ink outline-none transition-colors duration-300 placeholder:text-mist/25 focus:border-accent-soft md:text-3xl"
                    />
                    <FieldError id="email-error">{errors.email}</FieldError>
                  </div>
                </>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="sr-only">Service</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SERVICE_OPTIONS.map((opt) => {
                      const active = values.service === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handleServiceSelect(opt)}
                          data-cursor="hover"
                          className="rounded-lg border px-4 py-3.5 text-left text-sm font-medium transition-all duration-300"
                          style={{
                            borderColor: active ? opt.accent : 'var(--color-line)',
                            background: active ? `${opt.accent}14` : 'transparent',
                            color: active ? 'var(--color-ink)' : 'var(--color-mist)',
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <div>
                  <label htmlFor="message" className="block text-xs font-medium uppercase tracking-[0.15em] text-mist">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    autoFocus={!isMobile}
                    value={values.message}
                    onChange={handleChange('message')}
                    onFocus={handleFocus('details')}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    placeholder="What are you building, and what does success look like?"
                    className="mt-3 w-full resize-none border-0 border-b border-line bg-transparent pb-3 text-lg leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-mist/25 focus:border-accent-soft md:text-xl"
                  />
                  <FieldError id="message-error">{errors.message}</FieldError>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4 text-sm">
                  <ReviewRow label="Name" value={values.name} onEdit={() => setStep(0)} />
                  <ReviewRow label="Email" value={values.email} onEdit={() => setStep(0)} />
                  <ReviewRow label="Service" value={values.service || 'Not specified'} onEdit={() => setStep(1)} />
                  <ReviewRow label="Message" value={values.message} onEdit={() => setStep(2)} multiline />

                  {status === 'unconfigured' && (
                    <div role="status" className="mt-2 border-l-2 border-accent-soft/50 py-1 pl-4 text-sm leading-relaxed text-mist">
                      This form isn&rsquo;t wired up to send messages automatically yet — but your brief is ready to go.{' '}
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
                    <div role="alert" className="mt-2 border-l-2 border-rose-400/50 py-1 pl-4 text-sm leading-relaxed text-mist">
                      <span className="font-medium text-ink">Something went wrong.</span> Please try again, or email us
                      directly at{' '}
                      <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-ink underline underline-offset-2" data-cursor="hover">
                        {SITE_EMAIL}
                      </a>
                      .
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                data-cursor="hover"
                className="text-sm font-medium text-mist transition-colors duration-300 hover:text-ink"
              >
                ← Back
              </button>
            ) : (
              <span aria-hidden="true" />
            )}

            {step < STEPS.length - 1 ? (
              <MagneticButton
                type="button"
                onClick={goNext}
                data-cursor="hover"
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                Continue
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </MagneticButton>
            ) : (
              <MagneticButton
                type="submit"
                disabled={status === 'submitting'}
                data-cursor="hover"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void shadow-[0_0_0_0_rgba(196,181,253,0)] transition-[opacity,box-shadow] duration-300 hover:shadow-[0_0_24px_2px_rgba(196,181,253,0.35)] disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Project Brief'}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </MagneticButton>
            )}
          </div>

          <p className="mt-6 text-xs text-mist">
            Prefer email? Reach us directly at{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-2" data-cursor="hover">
              {SITE_EMAIL}
            </a>
          </p>
        </form>
      )}
    </div>
  )

  const directContactBlock = (
    <section className="container-px relative border-t border-line py-16 md:py-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mist">Prefer a direct conversation?</p>
          <a
            href={`mailto:${SITE_EMAIL}`}
            data-cursor="hover"
            data-cursor-text="Email"
            className="group mt-4 inline-flex items-center gap-3 font-display text-2xl text-ink md:text-3xl"
          >
            {SITE_EMAIL}
            <span
              aria-hidden="true"
              className="h-px w-8 bg-line transition-all duration-300 group-hover:w-12 group-hover:bg-accent-soft"
            />
          </a>
        </div>
        <ConnectionFlow />
      </div>
    </section>
  )

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
      <main ref={rootRef} className="relative bg-void">
        {isMobile ? (
          <section ref={heroRef} className="relative overflow-hidden pb-16 pt-32">
            <div className="container-px relative z-10">{headerBlock}</div>

            <div className="relative mx-4 mt-10 h-[46vh] overflow-hidden rounded-2xl border border-line sm:mx-6">
              <SceneErrorBoundary>
                <ProjectCoreScene focusRef={focusRef} serviceColorRef={serviceColorRef} scrollRef={scrollRef} reducedMotion={reducedMotion} centered />
              </SceneErrorBoundary>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/10" />
            </div>

            <div className="container-px relative z-10 mt-12">{formBlock}</div>
          </section>
        ) : (
          <section ref={heroRef} className="relative overflow-hidden pb-24 pt-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(#c4b5fd 1px, transparent 1px), linear-gradient(90deg, #c4b5fd 1px, transparent 1px)',
                  backgroundSize: '72px 72px',
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-[60vw] opacity-70"
              style={{ background: 'radial-gradient(55% 60% at 70% 40%, #7c5cd622, transparent 70%)' }}
            />

            <div className="container-px relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-[45%_55%]">
              <div className="max-w-lg">{headerBlock}</div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 overflow-hidden lg:-inset-x-16">
                  <SceneErrorBoundary>
                    <ProjectCoreScene focusRef={focusRef} serviceColorRef={serviceColorRef} scrollRef={scrollRef} reducedMotion={reducedMotion} />
                  </SceneErrorBoundary>
                </div>
                <div className="relative z-10 max-w-xl">{formBlock}</div>
              </div>
            </div>
          </section>
        )}

        {directContactBlock}
      </main>
    </>
  )
}

function ReviewRow({ label, value, onEdit, multiline = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist">{label}</p>
        <p className={`mt-1.5 text-ink ${multiline ? 'max-w-md whitespace-pre-wrap text-sm leading-relaxed' : 'truncate text-base'}`}>
          {value || '—'}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        data-cursor="hover"
        className="shrink-0 text-xs font-medium text-mist underline underline-offset-2 transition-colors duration-300 hover:text-ink"
      >
        Edit
      </button>
    </div>
  )
}
