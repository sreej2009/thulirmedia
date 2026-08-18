import { useEffect } from 'react'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../../lib/seo'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(name, attr = 'name') {
  document.head.querySelector(`meta[${attr}="${name}"]`)?.remove()
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// JSON-LD is our own generated data (never user input), JSON.stringified
// and with `<` escaped so a value can never prematurely close the script
// tag — the standard, safe way to embed structured data.
function setJsonLd(id, data) {
  document.getElementById(id)?.remove()
  if (!data) return
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  const payload = Array.isArray(data) ? data : [data]
  script.textContent = JSON.stringify(payload).replace(/</g, '\\u003c')
  document.head.appendChild(script)
}

// Client-side per-route SEO tags for this SPA. index.html carries the
// default/home tags for pre-hydration crawlers; this keeps them in sync
// with the current route for JS-executing crawlers, social scrapers and
// (most importantly) the browser tab itself.
export default function SEOHead({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const previousTitle = document.title
    const url = `${SITE_URL}${path}`

    if (title) document.title = title
    setMeta('description', description)
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    if (noindex) {
      setMeta('robots', 'noindex, nofollow')
    } else {
      removeMeta('robots')
    }

    setCanonical(url)
    setJsonLd('seo-jsonld', jsonLd)

    return () => {
      document.title = previousTitle
      setJsonLd('seo-jsonld', null)
    }
  }, [title, description, path, image, type, noindex, jsonLd])

  return null
}
