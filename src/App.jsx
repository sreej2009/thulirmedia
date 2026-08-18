import { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsap'
import { revealTransition } from './lib/pageTransition'
import SmoothScroll from './components/layout/SmoothScroll'
import Cursor from './components/layout/Cursor'
import Loader from './components/layout/Loader'
import ScrollProgress from './components/layout/ScrollProgress'
import TransitionOverlay from './components/layout/TransitionOverlay'
import ErrorBoundary from './components/layout/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const DigitalMarketing = lazy(() => import('./pages/services/DigitalMarketing'))
const WebDevelopment = lazy(() => import('./pages/services/WebDevelopment'))
const AppDevelopment = lazy(() => import('./pages/services/AppDevelopment'))
const SEO = lazy(() => import('./pages/services/SEO'))
const SocialMedia = lazy(() => import('./pages/services/SocialMedia'))
const Branding = lazy(() => import('./pages/services/Branding'))
const Work = lazy(() => import('./pages/Work'))
const CaseStudy = lazy(() => import('./pages/work/CaseStudy'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const handleLoaded = useCallback(() => setLoading(false), [])

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    revealTransition()
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <SmoothScroll>
      {loading && <Loader onComplete={handleLoaded} label="Thulir Media" />}
      <Cursor />
      <ScrollProgress />
      <TransitionOverlay />
      <div className="noise-overlay" />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/services/web-development" element={<WebDevelopment />} />
            <Route path="/services/app-development" element={<AppDevelopment />} />
            <Route path="/services/seo" element={<SEO />} />
            <Route path="/services/social-media" element={<SocialMedia />} />
            <Route path="/services/branding" element={<Branding />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </SmoothScroll>
  )
}
