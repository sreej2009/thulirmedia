// Central list of every service page — drives the mega-menu, the home
// page's services grid, and nothing else. Keep in sync with src/App.jsx's
// routes and each service's own data.js `path`.

export const servicesRegistry = [
  {
    path: '/services/digital-marketing',
    label: 'Digital Marketing',
    blurb: 'Paid + organic growth, engineered as one system.',
    accent: '#a3e635',
    world: 'The Growth Engine',
  },
  {
    path: '/services/web-development',
    label: 'Website Development',
    blurb: 'Fast, accessible builds engineered to convert.',
    accent: '#60a5fa',
    world: 'The Digital Architecture',
  },
  {
    path: '/services/app-development',
    label: 'App Development',
    blurb: 'iOS, Android and cross-platform, done right.',
    accent: '#818cf8',
    world: 'From Idea to App',
  },
  {
    path: '/services/seo',
    label: 'SEO',
    blurb: 'Compounding visibility that outlasts every algorithm update.',
    accent: '#f59e0b',
    world: 'The Search Engine',
  },
  {
    path: '/services/social-media',
    label: 'Social Media & Content',
    blurb: 'A content engine that makes your brand impossible to ignore.',
    accent: '#fb7185',
    world: 'The Content Universe',
  },
  {
    path: '/services/branding',
    label: 'Branding & Creative',
    blurb: 'Identity systems that make your brand memorable.',
    accent: '#f97316',
    world: 'The Creative Studio',
  },
]
