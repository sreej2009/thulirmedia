import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import HeroScene from './HeroScene'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function HeroCanvas() {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()

  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.75]), [degraded])

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <HeroScene highQuality={highQuality} />
      </Suspense>
    </Canvas>
  )
}
