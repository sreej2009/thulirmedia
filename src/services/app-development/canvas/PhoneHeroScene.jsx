import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float } from '@react-three/drei'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'
import PhoneObject from './PhoneObject'

function Scene({ highQuality, reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#c7d2fe" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#818cf8" />

      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.6}>
        <PhoneObject progress={0.16} reducedMotion={reducedMotion} />
      </Float>

      <ParticleField count={highQuality ? 420 : 220} radius={5} sparkles={highQuality && !reducedMotion} />
    </>
  )
}

export default function PhoneHeroScene({ reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.75]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
    <Canvas
      dpr={dpr}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 38 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 3.5, 11]} />
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.4 : 0.2} />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#818cf8" />
        <Scene highQuality={highQuality} reducedMotion={reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
