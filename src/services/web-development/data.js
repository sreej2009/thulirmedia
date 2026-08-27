export const meta = {
  id: 'web-development',
  path: '/services/web-development',
  accent: '#60a5fa',
  world: 'The Digital Architecture',
}

export const seo = {
  title: 'Website Development Services | Thulir Media',
  description:
    'Business websites, landing pages and e-commerce builds — engineered with React, performance and conversion in mind.',
}

export const hero = {
  eyebrow: 'Web Development',
  lines: ['We build websites', 'that work as hard as they look.'],
  sub: 'Fast, scalable digital experiences engineered for performance, usability and growth.',
  primaryCta: { label: 'Start a Project', href: '#wd-cta' },
  secondaryCta: { label: 'See the Architecture', href: '#wd-whatwedo' },
}

// The six construction phases the Digital Architecture Core moves through
// as the hero is scrolled — matches BrowserObject's own band logic.
export const architecturePhases = ['Structure', 'Design', 'Development', 'Integration', 'Optimization', 'Launch']

export const introduction = {
  eyebrow: 'The Problem',
  title: 'Most websites are built for launch day, not for growth.',
  description:
    'A site that looks good in a portfolio but loads slowly, ranks poorly and never gets touched again is a liability, not an asset.',
  problem:
    'Template sites and one-off freelance builds tend to ignore performance, accessibility and SEO architecture — the parts that determine whether anyone finds the site at all.',
  approach:
    'We build every site on the same performance discipline behind our own 3D work: fast by default, accessible by default, and structured so search engines and visitors both understand it immediately.',
  highlights: ['Built on React', 'SEO-ready architecture', 'Core Web Vitals first'],
}

export const whatWeDo = {
  eyebrow: 'What We Do',
  title: 'Three build types. One engineering standard.',
  description: 'Whatever the brief, every build follows the same performance and accessibility bar.',
  categories: [
    {
      title: 'Business Websites',
      tagline: 'Your digital headquarters',
      description: 'Corporate, company and service websites built to establish trust fast.',
      points: ['Corporate Websites', 'Company Websites', 'Service Websites', 'Portfolio Websites'],
    },
    {
      title: 'Landing Pages',
      tagline: 'Built for one job: convert',
      description: 'Focused, fast-loading pages built around a single campaign goal.',
      points: ['Campaign Pages', 'Lead Generation', 'Product Pages', 'Conversion-focused Pages'],
    },
    {
      title: 'E-commerce',
      tagline: 'From browse to checkout',
      description: 'Full commerce builds — catalog through to order management.',
      points: ['Product Catalog', 'Cart & Checkout', 'Payment Integration', 'Order Management', 'Admin Dashboard'],
    },
  ],
}

export const interactiveVisual = {
  eyebrow: 'Interactive Visual',
  title: 'Watch a site come to life.',
  description: 'Scroll to move a build through wireframe, UI design, code and a live, polished product.',
}

export const process = [
  { step: '01', title: 'Discover', description: 'We map your business goals, audience and content before a single pixel is designed.' },
  { step: '02', title: 'Wireframe', description: 'Structure and user flow first — validated before visual design begins.' },
  { step: '03', title: 'Design', description: 'A visual system built around your brand, not a generic template.' },
  { step: '04', title: 'Build', description: 'Clean, componentized React code — fast, accessible, and easy to extend.' },
  { step: '05', title: 'Launch', description: 'Performance, SEO and analytics verified before the site goes live.' },
  { step: '06', title: 'Support', description: 'Ongoing performance monitoring and iteration after launch.' },
]

export const technology = {
  eyebrow: 'Technology',
  title: 'The stack behind every build.',
  description: 'Modern, well-supported technology chosen for speed and longevity — not hype.',
  items: [
    { label: 'React', color: '#60a5fa' },
    { label: 'JavaScript', color: '#f59e0b' },
    { label: 'HTML / CSS', color: '#8b5cf6' },
    { label: 'Node.js', color: '#34d399' },
    { label: 'API Integration', color: '#ec4899' },
    { label: 'CMS', color: '#f472b6' },
    { label: 'Database', color: '#a78bfa' },
    { label: 'Cloud Hosting', color: '#22d3ee' },
  ],
}

export const useCases = {
  eyebrow: 'Use Cases',
  title: 'What businesses build with us.',
  description: 'A few of the outcomes a well-engineered site makes possible.',
  items: [
    { title: 'Service business generating leads', description: 'A fast, credible site that turns organic and paid traffic into booked calls.' },
    { title: 'D2C brand launching online', description: 'A full e-commerce build ready for a coordinated marketing launch.' },
    { title: 'Agency-grade portfolio', description: 'A site that itself becomes proof of the quality of the work behind it.' },
    { title: 'Legacy site rebuild', description: 'Migrating a slow, outdated site to a fast, modern, SEO-ready architecture.' },
  ],
}

// Deliberately no numbers, percentages or timing claims here — every build
// is different, and this page shouldn't imply a measured result before a
// single line of a client's code exists. These are the standards every
// build is held to, shown conceptually, not a fabricated scorecard.
export const performance = {
  eyebrow: 'Performance',
  title: 'Built to perform.',
  description: 'What every build is engineered around, before a single visitor arrives.',
  items: [
    { label: 'Fast', description: 'Lean assets and modern rendering, tuned for real-world networks.', fill: 0.94, color: '#60a5fa' },
    { label: 'Responsive', description: 'Built for the screen it’s actually viewed on, not just desktop.', fill: 0.97, color: '#8b5cf6' },
    { label: 'Accessible', description: 'Semantic markup and keyboard support, not an afterthought.', fill: 0.9, color: '#34d399' },
    { label: 'SEO-Ready', description: 'Structured so search engines understand the site from day one.', fill: 0.92, color: '#f59e0b' },
    { label: 'Scalable', description: 'Componentized code that grows with the business, not against it.', fill: 0.88, color: '#22d3ee' },
  ],
}

// Six practices every build is held to — shown as a network around a
// central "Engineering Core", not a fabricated audit or scorecard.
export const engineeringStandard = {
  eyebrow: 'One Engineering Standard',
  title: 'Every build, held to the same bar.',
  description: 'Six practices that shape every decision, from the first wireframe to the last deploy.',
  nodes: [
    { key: 'performance', label: 'Performance', color: '#60a5fa' },
    { key: 'accessibility', label: 'Accessibility', color: '#34d399' },
    { key: 'responsive', label: 'Responsive', color: '#8b5cf6' },
    { key: 'seo', label: 'SEO', color: '#f59e0b' },
    { key: 'security', label: 'Security', color: '#f472b6' },
    { key: 'scalability', label: 'Scalability', color: '#22d3ee' },
  ],
}

export const whyUs = {
  eyebrow: 'Why Thulir Media',
  title: 'Engineering discipline, not just design.',
  description: 'Every build follows the same standard we hold our own 3D work to.',
  points: [
    { title: 'Performance is a feature', description: 'Every build is budgeted for load time and Core Web Vitals from day one, not fixed after the fact.' },
    { title: 'SEO-ready from the start', description: 'Semantic structure, metadata and sitemap architecture are built in, not bolted on.' },
    { title: 'Componentized, maintainable code', description: 'Clean React components that your team — or ours — can extend without a rebuild.' },
    { title: 'Design that serves the business', description: 'Every layout decision is tied to a conversion or trust goal, not just visual trend.' },
  ],
}

export const faq = [
  { q: 'How long does a typical build take?', a: 'A focused landing page can launch in 1–2 weeks; a full business site or e-commerce build typically takes 4–8 weeks depending on scope.' },
  { q: 'Do you build on a CMS or fully custom?', a: 'Both — we recommend a CMS when your team needs to self-edit content, and a fully custom React build when performance and interaction matter most.' },
  { q: 'Will the site be SEO-ready?', a: 'Yes. Semantic HTML, metadata, sitemap and Core Web Vitals are treated as requirements, not add-ons.' },
  { q: 'Can you redesign an existing site?', a: 'Yes — we regularly migrate legacy sites to modern, faster architectures without losing existing SEO equity.' },
  { q: 'Do you offer ongoing support?', a: 'Yes, optional retainers cover performance monitoring, updates and iteration after launch.' },
]

export const cta = {
  eyebrow: "Let's Build",
  titleLines: ["Let's Build", 'Something Real.'],
  sub: 'A website engineered to earn trust, load fast and convert — not just look good in a screenshot.',
  primaryLabel: 'Start a Project',
  subject: 'Starting a Website Development project with Thulir Media',
  secondaryLabel: 'See Our Process',
  secondaryHref: '#wd-process',
}
