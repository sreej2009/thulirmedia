// Honesty note (matches the pattern already established in src/work/data.js):
// Thulir Media has no public founding date, headcount, awards or team
// roster loaded into this codebase yet. Nothing below invents one. Where
// real information doesn't exist — team bios, studio photography, company
// milestones — this file says so explicitly and the corresponding section
// renders an honest, clearly-labelled placeholder instead of fabricated
// content. Swap the empty arrays/nulls below with real content whenever
// it exists and the page updates automatically.

import { servicesRegistry } from '../services/shared/registry'

export const seo = {
  title: 'About Thulir Media',
  description:
    'Thulir Media brings creativity, technology and digital growth together to build experiences that move brands forward. This is who we are and how we work.',
}

export const hero = {
  eyebrow: 'About Thulir Media',
  lines: ['We build what', 'brands become.'],
  sub: 'We bring strategy, creativity and technology together to build digital experiences that move brands forward.',
  tag: 'One studio. Every discipline.',
  primaryCta: { label: 'Start a Project', href: '/contact' },
  secondaryCta: { label: 'See Our Work', href: '/work' },
}

// The five forces the Studio Core is built from — distinct from the six
// service disciplines further down the page. These represent how the
// studio works, not what it sells.
export const studioForces = [
  { key: 'strategy', label: 'Strategy', color: '#f59e0b' },
  { key: 'creative', label: 'Creative', color: '#a78bfa' },
  { key: 'technology', label: 'Technology', color: '#60a5fa' },
  { key: 'content', label: 'Content', color: '#fb7185' },
  { key: 'experience', label: 'Experience', color: '#e9d5ff' },
]

export const philosophy = {
  eyebrow: 'Our Philosophy',
  lines: [
    { text: 'Creativity gets attention.', highlight: 'Creativity' },
    { text: 'Strategy gives it direction.', highlight: 'Strategy' },
  ],
  description:
    'Great work is not only about how it looks. It’s about why it exists, who it reaches, and what happens next.',
}

export const ecosystem = [
  { label: 'Creative', color: '#f97316' },
  { label: 'Technology', color: '#818cf8' },
  { label: 'Strategy', color: '#f59e0b' },
  { label: 'Content', color: '#fb7185' },
  { label: 'Digital', color: '#a3e635' },
  { label: 'Growth', color: '#60a5fa' },
]

export const story = {
  eyebrow: 'Our Story',
  title: 'From Ideas to Impact.',
  description: 'Why Thulir Media exists, and what we’re building toward.',
  problem:
    'Most agencies specialize in one thing — a design studio, a media buyer, a dev shop — and leave brands to stitch the pieces together themselves. That gap is where good ideas quietly lose their edge on the way to execution.',
  approach:
    'Thulir Media was built to close that gap: creative, technology and growth working as one connected system instead of three separate vendors. Every discipline — marketing, websites, apps, SEO, content and brand identity — is treated as its own craft, held to the same standard, and pointed at the same outcome.',
  highlights: ['One studio, every discipline', 'Craft and performance, not either/or', 'Built around your brand, not a template'],
}

export const beliefs = [
  {
    step: '01',
    title: 'Create With Purpose',
    description: 'Every creative decision should have a reason. Nothing ships because it looks good in isolation — it ships because it moves the brand or the business forward.',
  },
  {
    step: '02',
    title: 'Technology With Intent',
    description: 'Technology should improve the experience, not exist for decoration. We reach for a tool, a framework or a line of 3D because it earns its place, not because it’s trending.',
  },
  {
    step: '03',
    title: 'Design For People',
    description: 'Beautiful experiences should also be intuitive and useful. If it isn’t clear, fast and easy to use, it isn’t finished — no matter how polished it looks.',
  },
  {
    step: '04',
    title: 'Build For Growth',
    description: 'Digital work should create meaningful business value. A campaign, a site or an app is only as good as the growth it creates after launch.',
  },
]

export const creativeTech = {
  eyebrow: 'What Makes Us Different',
  title: 'Creative × Technology.',
  description: 'Two disciplines most studios keep separate — we run them as one system.',
  progression: ['Creative', 'Design', 'Technology', 'Experience', 'Growth'],
}

export const capabilities = servicesRegistry.map((s) => ({
  path: s.path,
  label: s.label,
  blurb: s.blurb,
  accent: s.accent,
}))

export const whatWeDo = {
  eyebrow: 'What Connects Us',
  title: 'One studio. Every discipline.',
  description: 'Six disciplines, cross-linked, not siloed — explore one to see how it plugs into the rest.',
}

export const howWeWork = {
  eyebrow: 'How We Work',
  title: 'A process built for craft and momentum.',
  description: 'The same six-stage system behind every engagement, whatever the discipline.',
  steps: [
    { step: '01', title: 'Discover', description: 'Understand the brand, the audience and the business behind the brief before anything gets designed.' },
    { step: '02', title: 'Think', description: 'Define strategy, direction and the real opportunity — the plan every later decision has to serve.' },
    { step: '03', title: 'Create', description: 'Design the experience and the creative system it lives in, from first concept to final detail.' },
    { step: '04', title: 'Build', description: 'Develop the digital product or campaign to a standard that holds up in the real world.' },
    { step: '05', title: 'Launch', description: 'Take the work live — tracking, QA and rollout handled with the same care as the creative.' },
    { step: '06', title: 'Grow', description: 'Measure what launch actually produced, then optimize and evolve it from there.' },
  ],
}

export const whyThulir = {
  eyebrow: 'Why Thulir Media',
  title: 'A partner, not a vendor per discipline.',
  description: 'What actually changes when creative, technology and growth sit under one roof.',
  points: [
    { title: 'Creative Thinking', description: 'Ideas are judged on whether they move the brand forward, not on whether they’re trend-of-the-moment.' },
    { title: 'Technology', description: 'A 3D scene, an animation system or a stack choice earns its place by improving the experience — never decoration for its own sake.' },
    { title: 'Strategy', description: 'Every deliverable traces back to a stated goal, so craft and business outcomes are never in tension.' },
    { title: 'Execution', description: 'The team that plans the work is the team that builds it — no hand-offs that quietly erode the original idea.' },
    { title: 'Long-Term Partnership', description: 'We measure success after launch, not just at delivery — the relationship is built to continue past the first project.' },
  ],
}

// No team roster exists yet — these are the functional roles the studio is
// structured around, not invented people. Swap in real profiles
// (name, role, bio, portrait) as the team page is populated; the section
// component already renders real cards automatically once `photo`/`name`
// are present.
export const team = {
  eyebrow: 'The People',
  title: 'The people behind the work.',
  description: 'Team profiles are being added — here’s how the studio is structured today.',
  roles: [
    { role: 'Creative Direction', focus: 'Brand, identity and the ideas that hold a campaign together.' },
    { role: 'Strategy & Growth', focus: 'Positioning, channel planning and the numbers behind every decision.' },
    { role: 'Design & Product', focus: 'Interfaces, interaction and the 3D/motion systems across every build.' },
    { role: 'Engineering', focus: 'Websites, apps and the infrastructure that keeps them fast and reliable.' },
  ],
}

// No real studio photography/video exists yet — see PlaceholderVisual /
// MediaFrame in src/work/components, reused here so real assets can be
// dropped in later without touching this section's markup.
export const culture = {
  eyebrow: 'Studio',
  title: 'Where creativity meets technology.',
  description:
    'Real studio photography and process footage will live here as it’s produced — for now, here’s a clearly-marked placeholder built to the same structure.',
  image: null,
  video: null,
}

export const finalCta = {
  eyebrow: 'Let’s Build',
  titleLines: ['Let’s build something', 'worth remembering.'],
  sub: 'Have an idea, a challenge or a project in mind?',
  primaryLabel: 'Start a Project',
  subject: 'Starting a project with Thulir Media',
  secondaryLabel: 'See Our Work',
  secondaryHref: '/work',
}
