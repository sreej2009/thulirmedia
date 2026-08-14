import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Environment, Lightformer } from '@react-three/drei'
import EcosystemCore from './EcosystemCore'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import CameraRig from '../../components/canvas/CameraRig'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function DMHeroCanvas({ reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()

  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.75]), [degraded])

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.5 : 0.25} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={1.1} color="#c4b5fd" />
        <pointLight position={[-4, -3, -3]} intensity={1.2} color="#3b82f6" />
        <MouseLight intensity={highQuality ? 6 : 3} />

        <EcosystemCore highQuality={highQuality} reducedMotion={reducedMotion} />
        <ParticleField count={highQuality ? 500 : 260} radius={5.5} sparkles={highQuality && !reducedMotion} />

        <Environment resolution={128}>
          <Lightformer intensity={2} color="#8b5cf6" position={[3, 2, -2]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.5} color="#22d3ee" position={[-3, -2, -2]} scale={[4, 4, 1]} />
          <Lightformer intensity={1} color="#ffffff" position={[0, 4, 3]} scale={[6, 2, 1]} />
        </Environment>

        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
  )
}
