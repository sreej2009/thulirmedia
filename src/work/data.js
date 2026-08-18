// Work / Case Studies content system.
//
// IMPORTANT — honesty note: Thulir Media has no client case studies loaded
// into this codebase yet. Every project below is marked `client: 'Concept
// Project'` and carries no invented metrics or testimonials — `results` is
// always qualitative (scope/deliverables/capabilities), and `testimonial`
// is `null` throughout, which the Testimonial section respects by simply
// not rendering. Swap in real client work by adding objects in this same
// shape; nothing else in the system needs to change.

export const filters = [
  { key: 'all', label: 'All' },
  { key: 'digital', label: 'Digital' },
  { key: 'web', label: 'Web' },
  { key: 'app', label: 'App' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Social' },
  { key: 'branding', label: 'Branding' },
  { key: 'media', label: 'Media' },
]

export const projects = [
  {
    slug: 'ecommerce-platform-redesign',
    title: 'E-Commerce Platform Redesign',
    category: 'Website Development',
    filterKeys: ['web'],
    year: '2025',
    client: 'Concept Project',
    industry: 'Retail / E-commerce',
    accent: '#60a5fa',
    frame: 'browser',
    description:
      'A full storefront rebuild — catalog, cart and checkout — engineered for speed and built to convert, not just look good in a deck.',
    services: ['Website Development', 'UI/UX Design', 'Performance Engineering'],
    technologies: [
      { label: 'React', color: '#60a5fa' },
      { label: 'Node.js', color: '#34d399' },
      { label: 'Shopify', color: '#4ade80' },
      { label: 'GSAP', color: '#8b5cf6' },
      { label: 'REST APIs', color: '#22d3ee' },
      { label: 'CMS', color: '#f472b6' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'The existing storefront was slow, difficult to update and lost a meaningful share of visitors before they ever reached checkout. Every new promotion required a developer, and mobile load times were pushing shoppers away before the page even finished painting.',
    approach: [
      { step: '01', title: 'Discover', description: 'Audited the existing funnel, catalog structure and checkout flow to find exactly where visitors were dropping off.' },
      { step: '02', title: 'Strategize', description: 'Mapped a component-driven architecture that let the team update merchandising without touching code.' },
      { step: '03', title: 'Design', description: 'A cleaner visual system focused on product photography and a frictionless path to checkout.' },
      { step: '04', title: 'Build', description: 'A componentized React storefront on a fast, SEO-ready architecture from day one.' },
      { step: '05', title: 'Launch', description: 'Phased rollout with analytics and conversion tracking verified before full traffic cutover.' },
      { step: '06', title: 'Optimize', description: 'Post-launch performance passes on load time, checkout friction and mobile usability.' },
    ],
    deliverables: [
      { title: 'UI & UX', tagline: 'Designed around the path to checkout', description: 'A visual system built for product discovery and fast decisions.', points: ['Wireframes', 'Visual Design System', 'Mobile-first Layouts', 'Checkout UX'] },
      { title: 'Development', tagline: 'Fast by architecture, not by patching', description: 'A componentized build engineered for speed and easy iteration.', points: ['React Storefront', 'CMS Integration', 'Payment Integration', 'Order Management'] },
      { title: 'Motion & Detail', tagline: 'Small interactions, done properly', description: 'Interface motion that guides attention without slowing the page down.', points: ['Micro-interactions', 'Page Transitions', 'Loading States'] },
    ],
    impact: [
      { label: 'Scope', value: 'Full storefront rebuild, catalog to checkout' },
      { label: 'Deliverables', value: 'Design system, componentized build, CMS' },
      { label: 'Capabilities Added', value: 'Merchandising without developer time' },
      { label: 'Engineering Focus', value: 'Core Web Vitals & mobile performance' },
    ],
    testimonial: null,
    featured: true,
  },
  {
    slug: 'saas-growth-campaign',
    title: 'SaaS Growth Campaign',
    category: 'Digital Marketing',
    filterKeys: ['digital'],
    year: '2025',
    client: 'Concept Project',
    industry: 'B2B SaaS',
    accent: '#8b5cf6',
    frame: 'card',
    description:
      'A connected Google Ads and content system built to turn search intent into demo bookings for a subscription product.',
    services: ['Google Ads', 'Content Strategy', 'Conversion Tracking'],
    technologies: [
      { label: 'Google Ads', color: '#8b5cf6' },
      { label: 'Search Console', color: '#34d399' },
      { label: 'Analytics', color: '#f59e0b' },
      { label: 'Tag Manager', color: '#60a5fa' },
      { label: 'CRM', color: '#f472b6' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'Paid spend was generating clicks but few qualified demo requests — campaigns targeted broad, high-competition keywords with no content behind them to build trust before the ask.',
    approach: [
      { step: '01', title: 'Discover', description: 'Reviewed account structure, search terms and the existing landing experience.' },
      { step: '02', title: 'Strategize', description: 'Re-mapped campaigns around high-intent, lower-competition keyword clusters.' },
      { step: '03', title: 'Create', description: 'Landing pages and supporting content built specifically for each campaign cluster.' },
      { step: '04', title: 'Launch', description: 'Restructured campaigns launched with proper conversion tracking from day one.' },
      { step: '05', title: 'Optimize', description: 'Weekly bid and creative testing against cost-per-qualified-lead, not cost-per-click.' },
      { step: '06', title: 'Scale', description: 'Budget reallocated toward the clusters proving out, deliberately, cycle by cycle.' },
    ],
    deliverables: [
      { title: 'Google Ads', tagline: 'Built around demo bookings', description: 'Campaign structure rebuilt around qualified intent, not raw traffic.', points: ['Keyword Strategy', 'Search & Display Ads', 'Landing Pages', 'Conversion Tracking'] },
      { title: 'Content', tagline: 'Trust before the ask', description: 'Supporting content built to answer objections before the demo request.', points: ['Campaign Content', 'Landing Page Copy', 'Case Study Format'] },
      { title: 'Analytics', tagline: 'Measured on the right number', description: 'Reporting tied to qualified pipeline, not clicks.', points: ['Conversion Tracking', 'CRM Integration', 'Monthly Reporting'] },
    ],
    impact: [
      { label: 'Scope', value: 'Full-funnel paid search campaign' },
      { label: 'Deliverables', value: 'Campaign structure, 4 landing pages, tracking setup' },
      { label: 'Capabilities Added', value: 'Qualified-lead reporting, not just clicks' },
      { label: 'Engineering Focus', value: 'Conversion tracking & CRM handoff' },
    ],
    testimonial: null,
    featured: true,
  },
  {
    slug: 'fitness-app-launch',
    title: 'Fitness App Launch',
    category: 'App Development',
    filterKeys: ['app'],
    year: '2024',
    client: 'Concept Project',
    industry: 'Health & Fitness',
    accent: '#f472b6',
    frame: 'phone',
    description:
      'A cross-platform training app built from first wireframe through App Store and Play Store submission.',
    services: ['App Development', 'UI/UX Design', 'Backend & APIs'],
    technologies: [
      { label: 'React Native', color: '#60a5fa' },
      { label: 'Firebase', color: '#f59e0b' },
      { label: 'REST APIs', color: '#34d399' },
      { label: 'Push (FCM/APNs)', color: '#ec4899' },
      { label: 'App Store / Play Store', color: '#22d3ee' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'The concept needed to launch on both iOS and Android with a single team, on a timeline that made a fully native build for each platform impractical.',
    approach: [
      { step: '01', title: 'Idea', description: 'Validated the core workout-tracking flow and platform choice before design began.' },
      { step: '02', title: 'UI/UX', description: 'Wireframes and a full design system tested against real training flows.' },
      { step: '03', title: 'Development', description: 'A single React Native codebase shared across iOS and Android.' },
      { step: '04', title: 'API', description: 'Backend, authentication and workout data synced in parallel with the app build.' },
      { step: '05', title: 'Testing', description: 'Device testing across both platforms before submission.' },
      { step: '06', title: 'Deployment', description: 'App Store and Play Store submission handled end to end.' },
    ],
    deliverables: [
      { title: 'UI/UX', tagline: 'Built for daily use', description: 'An interface designed to make logging a workout fast, not tedious.', points: ['Onboarding Flow', 'Workout Logging', 'Progress Tracking'] },
      { title: 'Mobile Development', tagline: 'One codebase, two platforms', description: 'A React Native build sharing logic across iOS and Android.', points: ['React Native Build', 'Offline Support', 'Push Notifications'] },
      { title: 'APIs & Backend', tagline: 'Reliable from day one', description: 'Authentication, sync and storage built to scale with the user base.', points: ['Authentication', 'Cloud Database', 'Push Infrastructure'] },
    ],
    impact: [
      { label: 'Scope', value: 'iOS + Android app, idea to store launch' },
      { label: 'Deliverables', value: 'Design system, React Native build, backend' },
      { label: 'Capabilities Added', value: 'Push notifications, offline workout logging' },
      { label: 'Engineering Focus', value: 'Shared codebase across both platforms' },
    ],
    testimonial: null,
    featured: true,
  },
  {
    slug: 'local-services-seo-overhaul',
    title: 'Local Services SEO Overhaul',
    category: 'SEO',
    filterKeys: ['seo'],
    year: '2024',
    client: 'Concept Project',
    industry: 'Local Services',
    accent: '#34d399',
    frame: 'card',
    description:
      'A technical and local SEO rebuild for a multi-location service business competing against national directories.',
    services: ['Technical SEO', 'Local SEO', 'Content'],
    technologies: [
      { label: 'Search Console', color: '#34d399' },
      { label: 'Google Business Profile', color: '#4ade80' },
      { label: 'Schema.org', color: '#60a5fa' },
      { label: 'Core Web Vitals', color: '#22d3ee' },
      { label: 'Site Crawlers', color: '#8b5cf6' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'Every location page looked nearly identical, crawl errors were suppressing indexing, and the business was invisible in local map results against directory listings with far less relevant content.',
    approach: [
      { step: '01', title: 'Audit', description: 'A full technical and local SEO audit across every location page.' },
      { step: '02', title: 'Keyword Strategy', description: 'Mapped location-specific search intent to dedicated, differentiated pages.' },
      { step: '03', title: 'Technical Fixes', description: 'Resolved crawl errors, duplicate content and Core Web Vitals issues.' },
      { step: '04', title: 'On-Page Optimization', description: 'Rewrote titles, headings and content for each location individually.' },
      { step: '05', title: 'Local Authority', description: 'Google Business Profile optimization and citation cleanup across locations.' },
      { step: '06', title: 'Reporting', description: 'Monthly reporting tied to rankings, local visibility and organic traffic.' },
    ],
    deliverables: [
      { title: 'Technical SEO', tagline: 'Fixing what search engines see first', description: 'Crawlability and indexing issues resolved at the source.', points: ['Crawlability Fixes', 'Schema Markup', 'Core Web Vitals'] },
      { title: 'Local SEO', tagline: 'Winning the map pack, location by location', description: 'Every location built to compete individually in local search.', points: ['Google Business Profile', 'Citation Cleanup', 'Location Pages'] },
      { title: 'Content', tagline: 'Differentiated, not duplicated', description: 'Unique, locally relevant content across every service area.', points: ['On-page Content', 'Internal Linking', 'Keyword Mapping'] },
    ],
    impact: [
      { label: 'Scope', value: 'Multi-location technical & local SEO rebuild' },
      { label: 'Deliverables', value: 'Technical audit, location pages, GBP optimization' },
      { label: 'Capabilities Added', value: 'Monthly rank & visibility reporting' },
      { label: 'Engineering Focus', value: 'Crawlability & Core Web Vitals' },
    ],
    testimonial: null,
    featured: false,
  },
  {
    slug: 'hospitality-brand-identity',
    title: 'Hospitality Brand Identity',
    category: 'Branding & Creative',
    filterKeys: ['branding'],
    year: '2024',
    client: 'Concept Project',
    industry: 'Hospitality',
    accent: '#f59e0b',
    frame: 'card',
    description:
      'A full identity system — logo, typography, color and guidelines — for a boutique hospitality concept expanding to new locations.',
    services: ['Brand Strategy', 'Brand Identity', 'Creative Direction'],
    technologies: [
      { label: 'Figma', color: '#8b5cf6' },
      { label: 'Typography Systems', color: '#f59e0b' },
      { label: 'Color Systems', color: '#34d399' },
      { label: 'Brand Guidelines', color: '#22d3ee' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'The brand looked different at every location — different fonts, different tone, no consistent visual language — which undermined the premium positioning as it prepared to expand.',
    approach: [
      { step: '01', title: 'Discover', description: 'Research into the audience, competitors and what the brand needed to stand for as it scaled.' },
      { step: '02', title: 'Strategy', description: 'Positioning and brand voice agreed before any visual design began.' },
      { step: '03', title: 'Identity', description: 'Logo, typography and color system designed as one cohesive system.' },
      { step: '04', title: 'Guidelines', description: 'Everything documented so the identity holds as new locations open.' },
      { step: '05', title: 'Creative', description: 'Templates for signage, menus and social built on the new identity.' },
      { step: '06', title: 'Rollout', description: 'The new identity applied consistently across every real, live location.' },
    ],
    deliverables: [
      { title: 'Brand Strategy', tagline: 'The thinking behind the look', description: 'Positioning and voice defined before any visual work began.', points: ['Positioning', 'Brand Voice', 'Visual Direction'] },
      { title: 'Identity', tagline: 'One system, every location', description: 'A complete, documented identity system.', points: ['Logo', 'Typography', 'Color System', 'Guidelines'] },
      { title: 'Creative', tagline: 'The identity, applied', description: 'Templates ready for signage, menus and social.', points: ['Signage Templates', 'Menu Design', 'Social Templates'] },
    ],
    impact: [
      { label: 'Scope', value: 'Full identity system for multi-location rollout' },
      { label: 'Deliverables', value: 'Logo, guidelines, signage & menu templates' },
      { label: 'Capabilities Added', value: 'Consistent rollout across new locations' },
      { label: 'Engineering Focus', value: 'Documented, reusable brand guidelines' },
    ],
    testimonial: null,
    featured: false,
  },
  {
    slug: 'product-launch-campaign',
    title: 'Product Launch Campaign',
    category: 'Creative Campaign',
    filterKeys: ['social', 'digital'],
    year: '2023',
    client: 'Concept Project',
    industry: 'Consumer Goods',
    accent: '#22d3ee',
    frame: 'card',
    description:
      'A coordinated social and paid campaign built to build awareness and pipeline at the same moment for a new product launch.',
    services: ['Social Media', 'Content Production', 'Meta Ads'],
    technologies: [
      { label: 'Meta Ads Manager', color: '#ec4899' },
      { label: 'Content Calendar', color: '#34d399' },
      { label: 'Canva', color: '#22d3ee' },
      { label: 'Analytics', color: '#f59e0b' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'The launch had one moment to make an impression — a fragmented content and paid plan risked awareness and demand peaking at different times instead of reinforcing each other.',
    approach: [
      { step: '01', title: 'Idea', description: 'Content pillars and campaign concept built around the launch moment.' },
      { step: '02', title: 'Create', description: 'Reels, posts and paid creative produced natively for each platform.' },
      { step: '03', title: 'Publish', description: 'A synchronized content calendar across organic and paid channels.' },
      { step: '04', title: 'Engage', description: 'Community management kept the conversation alive through launch week.' },
      { step: '05', title: 'Analyze', description: 'Performance reviewed daily against reach, engagement and conversions.' },
      { step: '06', title: 'Optimize', description: 'Budget and creative shifted in real time toward what was working.' },
    ],
    deliverables: [
      { title: 'Social Media', tagline: 'Built for the launch moment', description: 'A synchronized calendar across every organic channel.', points: ['Content Calendar', 'Reels', 'Stories', 'Community Management'] },
      { title: 'Meta Ads', tagline: 'Amplifying what was already working', description: 'Paid spend directed at the organic content already resonating.', points: ['Campaign Strategy', 'Creative Testing', 'Retargeting'] },
      { title: 'Content Production', tagline: 'Native to every platform', description: 'Creative produced specifically for how each platform is watched.', points: ['Video Content', 'Graphics', 'Copywriting'] },
    ],
    impact: [
      { label: 'Scope', value: 'Coordinated organic + paid launch campaign' },
      { label: 'Deliverables', value: 'Content calendar, ad creative, community management' },
      { label: 'Capabilities Added', value: 'Real-time budget shifts during launch week' },
      { label: 'Engineering Focus', value: 'Synchronized organic & paid timing' },
    ],
    testimonial: null,
    featured: false,
  },
  {
    slug: 'restaurant-visual-content',
    title: 'Restaurant Visual Content Campaign',
    category: 'Photography & Videography',
    filterKeys: ['media', 'social'],
    year: '2023',
    client: 'Concept Project',
    industry: 'Food & Beverage',
    accent: '#ec4899',
    frame: 'card',
    description:
      'A photography and video content library built to give a restaurant brand a consistent, appetite-driving visual presence across every channel.',
    services: ['Photography', 'Videography', 'Content Strategy'],
    technologies: [
      { label: 'Video Editing', color: '#60a5fa' },
      { label: 'Content Calendar', color: '#34d399' },
      { label: 'Canva', color: '#22d3ee' },
      { label: 'Social Scheduling', color: '#f472b6' },
    ],
    heroImage: null,
    gallery: [],
    challenge:
      'The brand relied on inconsistent, guest-submitted photos with no real content library — nothing to post, and no visual consistency across the channels the brand actually needed to show up on.',
    approach: [
      { step: '01', title: 'Idea', description: 'A shot list and content pillars built around the menu and the space itself.' },
      { step: '02', title: 'Create', description: 'A full production day covering photography and short-form video.' },
      { step: '03', title: 'Publish', description: 'A content calendar built to spread the library across weeks, not days.' },
      { step: '04', title: 'Engage', description: 'Content formatted natively for how each platform is actually watched.' },
      { step: '05', title: 'Analyze', description: 'Reviewed which formats and dishes drove the most engagement.' },
      { step: '06', title: 'Optimize', description: 'Future shoots planned around what the data showed was working.' },
    ],
    deliverables: [
      { title: 'Photography', tagline: 'A real content library, not stock photos', description: 'Menu and space photography built for use across every channel.', points: ['Menu Photography', 'Interior & Ambiance', 'Social-ready Crops'] },
      { title: 'Videography', tagline: 'Built for how people actually watch', description: 'Short-form video native to reels and stories.', points: ['Reels', 'Behind-the-scenes', 'Menu Highlights'] },
      { title: 'Content Strategy', tagline: 'A calendar, not a scramble', description: 'A publishing plan that stretches the content library properly.', points: ['Content Calendar', 'Platform Strategy'] },
    ],
    impact: [
      { label: 'Scope', value: 'Full-day photo & video production' },
      { label: 'Deliverables', value: 'Photo library, reels, 6-week content calendar' },
      { label: 'Capabilities Added', value: 'A reusable visual library across channels' },
      { label: 'Engineering Focus', value: 'Platform-native short-form video' },
    ],
    testimonial: null,
    featured: false,
  },
]

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null
}

export function getAdjacentProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return projects[0]
  return projects[(index + 1) % projects.length]
}
