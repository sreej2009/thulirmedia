import { useEffect } from 'react'

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

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Client-side per-route SEO tags for this SPA. index.html carries the
// default/home tags for pre-hydration crawlers; this keeps them in sync
// with the current route for JS-executing crawlers, social scrapers and
// (most importantly) the browser tab itself.
export default function SEOHead({ title, description, path = '/' }) {
  useEffect(() => {
    const previousTitle = document.title
    if (title) document.title = title
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    if (typeof window !== 'undefined') {
      setCanonical(`${window.location.origin}${path}`)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, path])

  return null
}
