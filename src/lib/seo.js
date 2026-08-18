// Single source of truth for the site's canonical domain and shared brand
// facts used across SEOHead, structured data and the static sitemap/robots
// files. Update this if the production domain changes.
export const SITE_URL = 'https://www.thulirmedia.com'
export const SITE_NAME = 'Thulir Media'
export const SITE_EMAIL = 'infothulirmedia@gmail.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    email: SITE_EMAIL,
    description:
      'Thulir Media builds digital marketing, websites, apps, SEO, social content and brand identity as one connected system.',
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function buildServiceSchema({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildCreativeWorkSchema({ name, description, path, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: `${SITE_URL}${path}`,
    genre: category,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}
