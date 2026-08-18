export const meta = {
  id: 'app-development',
  path: '/services/app-development',
  accent: '#818cf8',
  world: 'From Idea to App',
}

export const seo = {
  title: 'App Development Services | Thulir Media',
  description: 'iOS, Android and React Native app builds — from first wireframe through API integration, auth and a clean store deployment.',
}

export const hero = {
  eyebrow: 'App Development · Thulir Media',
  lines: ['From Idea', 'To App.'],
  sub: 'Native-feeling iOS, Android and cross-platform apps — built with real UX rigor from the first sketch to store deployment.',
  primaryCta: { label: 'Start a Project', href: '#ad-cta' },
  secondaryCta: { label: 'See the Architecture', href: '#ad-whatwedo' },
  tags: ['iOS', 'Android', 'React Native', 'Swift', 'REST APIs', 'Push Notifications', 'Payments', 'Authentication'],
}

export const introduction = {
  eyebrow: 'The Problem',
  title: 'Most app ideas never make it past the wireframe.',
  description:
    'Between design, engineering, backend and app store review, most teams stall before shipping something people actually use.',
  problem:
    'App projects often stall at the handoff between design and engineering — or ship late because backend, auth and payments were an afterthought.',
  approach:
    'We plan the backend architecture alongside the UI from day one, so authentication, payments and push notifications are never a last-minute scramble before launch.',
  highlights: ['iOS & Android', 'React Native or native', 'Backend planned from day one'],
}

export const whatWeDo = {
  eyebrow: 'What We Do',
  title: 'Platforms, technology, features, backend.',
  description: 'Every layer of the app, planned and built together.',
  categories: [
    {
      title: 'Platforms',
      tagline: 'Native or cross-platform',
      description: 'Built for wherever your users are.',
      points: ['iOS', 'Android', 'Cross Platform'],
    },
    {
      title: 'Technologies',
      tagline: 'Modern, well-supported tooling',
      description: 'Chosen for speed of development and long-term maintainability.',
      points: ['React Native', 'Swift', 'SwiftUI', 'REST APIs'],
    },
    {
      title: 'Features',
      tagline: 'The functionality users expect',
      description: 'Built-in, not bolted on after launch.',
      points: ['Authentication', 'User Profiles', 'Push Notifications', 'Payments', 'Maps', 'Chat', 'File Upload', 'Analytics'],
    },
    {
      title: 'Backend',
      tagline: 'The engine behind the app',
      description: 'Reliable infrastructure your app can grow into.',
      points: ['APIs', 'Database', 'Authentication', 'Cloud Hosting', 'Notifications'],
    },
  ],
}

export const interactiveVisual = {
  eyebrow: 'Interactive Visual',
  title: 'Watch an app take shape.',
  description: 'Scroll to move the app through idea, UI/UX, development, API, testing, deployment and growth.',
}

export const process = [
  { step: '01', title: 'Idea', description: 'We validate the concept, core user flows and platform choice before any design starts.' },
  { step: '02', title: 'UI/UX', description: 'Wireframes and a full design system, tested against real user flows.' },
  { step: '03', title: 'Development', description: 'Clean, componentized builds in React Native or native Swift/Kotlin.' },
  { step: '04', title: 'API', description: 'Backend, database and authentication built in parallel with the app itself.' },
  { step: '05', title: 'Testing', description: 'Device testing, QA and performance passes before submission.' },
  { step: '06', title: 'Deployment', description: 'App Store and Play Store submission handled end to end.' },
]

export const technology = {
  eyebrow: 'Technology',
  title: 'The stack behind every build.',
  description: 'Tools chosen for reliability across both major platforms.',
  items: [
    { label: 'React Native', color: '#60a5fa' },
    { label: 'Swift', color: '#f97316' },
    { label: 'SwiftUI', color: '#fb923c' },
    { label: 'Kotlin', color: '#a78bfa' },
    { label: 'Firebase', color: '#f59e0b' },
    { label: 'REST APIs', color: '#34d399' },
    { label: 'Push (FCM/APNs)', color: '#ec4899' },
    { label: 'App Store / Play Store', color: '#22d3ee' },
  ],
}

export const useCases = {
  eyebrow: 'Use Cases',
  title: 'What businesses build with us.',
  description: 'A few of the app types we build and ship regularly.',
  items: [
    { title: 'Booking & appointments app', description: 'Native scheduling, push reminders and payments in one flow.' },
    { title: 'D2C loyalty & commerce app', description: 'A branded mobile storefront with push-driven re-engagement.' },
    { title: 'Internal operations tool', description: 'A cross-platform app that replaces spreadsheets and manual processes.' },
    { title: 'Community / social app', description: 'Chat, profiles and content feeds built on a scalable backend.' },
  ],
}

export const metrics = {
  eyebrow: 'Performance',
  title: 'What a well-built app looks like on paper.',
  trend: [12, 18, 22, 28, 35, 40, 48, 55, 62, 70, 78, 88],
  items: [
    { label: 'Crash-free Sessions', value: 99.6, suffix: '%', decimals: 1, color: '#34d399' },
    { label: 'Cold Start Time', value: 1.4, suffix: 's', decimals: 1, color: '#60a5fa' },
    { label: 'App Store Rating', value: 4.8, suffix: '/5', decimals: 1, color: '#f472b6' },
    { label: 'Retention (D7)', value: 42, suffix: '%', color: '#8b5cf6' },
    { label: 'Push Opt-in Rate', value: 61, suffix: '%', color: '#f59e0b' },
    { label: 'Avg Session Time', value: 6.2, suffix: 'm', decimals: 1, color: '#22d3ee' },
    { label: 'API Response Time', value: 180, suffix: 'ms', color: '#a78bfa' },
    { label: 'Build Coverage', value: 87, suffix: '%', color: '#4ade80' },
  ],
}

export const whyUs = {
  eyebrow: 'Why Thulir Media',
  title: 'Product thinking, not just development.',
  description: 'We plan for the app store, the backend and the update cycle — not just the first release.',
  points: [
    { title: 'Design and engineering, one team', description: 'No hand-off gaps between UI/UX and the engineers building it.' },
    { title: 'Backend planned from day one', description: 'Auth, payments and push are architected early, not bolted on before submission.' },
    { title: 'Store-ready from the start', description: 'App Store and Play Store guidelines are accounted for from the first build.' },
    { title: 'Built to be updated', description: 'Clean, modular code your team can extend after we hand it off.' },
  ],
}

export const faq = [
  { q: 'React Native or fully native?', a: 'It depends on your feature set and performance needs — we will recommend the right approach after understanding your requirements.' },
  { q: 'How long does an app build take?', a: 'A focused MVP typically takes 8–14 weeks; a full-featured app can take longer depending on scope.' },
  { q: 'Do you handle App Store submission?', a: 'Yes, we handle App Store and Play Store submission, including review requirements and metadata.' },
  { q: 'Can you build the backend too?', a: 'Yes — API, database, authentication and cloud infrastructure are all part of what we build.' },
  { q: 'What happens after launch?', a: 'Optional support retainers cover monitoring, bug fixes and feature updates post-launch.' },
]

export const cta = {
  eyebrow: "Let's Build",
  titleLines: ['Ship Your', 'App.'],
  sub: "From idea to app store — let's build something people actually use.",
  primaryLabel: 'Start a Project',
  subject: 'Starting an App Development project with Thulir Media',
  secondaryLabel: 'See Our Process',
  secondaryHref: '#ad-process',
}
