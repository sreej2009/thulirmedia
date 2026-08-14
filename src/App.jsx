import { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsap'
import SmoothScroll from './components/layout/SmoothScroll'
import Cursor from './components/layout/Cursor'
import Loader from './components/layout/Loader'
import ScrollProgress from './components/layout/ScrollProgress'

const Home = lazy(() => import('./pages/Home'))
const DigitalMarketing = lazy(() => import('./pages/DigitalMarketing'))

const LOADER_LABELS = {
  '/digital-marketing': 'Thulir Media',
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const handleLoaded = useCallback(() => setLoading(false), [])

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  // client-side route changes don't reset scroll on their own — snap back to
  // top and let ScrollTrigger re-measure the newly mounted page's triggers.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <SmoothScroll>
      {loading && (
        <Loader onComplete={handleLoaded} label={LOADER_LABELS[location.pathname] || 'Aether'} />
      )}
      <Cursor />
      <ScrollProgress />
      <div className="noise-overlay" />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/digital-marketing" element={<DigitalMarketing />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </SmoothScroll>
  )
}
