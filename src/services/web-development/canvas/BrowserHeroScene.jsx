import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'
import BrowserObject from './BrowserObject'

function CodeParticle({ offset, speed, color }) {
  const ref = useRef(null)
  const start = useMemo(
    () => new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -2 - Math.random() * 3),
    []
  )

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(start, new THREE.Vector3(0, 0, 0.5), t)
    if (ref.current.material) ref.current.material.opacity = Math.sin(t * Math.PI) * 0.8
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.03, 0.03, 0.03]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function Scene({ highQuality, reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#93c5fd" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#8b5cf6" />

      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.5}>
        <BrowserObject progress={0.36} reducedMotion={reducedMotion} />
      </Float>

      {!reducedMotion &&
        Array.from({ length: 24 }).map((_, i) => (
          <CodeParticle key={i} offset={i / 24} speed={0.15 + (i % 4) * 0.03} color={['#60a5fa', '#34d399', '#8b5cf6'][i % 3]} />
        ))}

      <ParticleField count={highQuality ? 420 : 220} radius={5.5} sparkles={false} />
    </>
  )
}

export default function BrowserHeroScene({ reducedMotion = false }) {
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
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 4, 13]} />
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.4 : 0.2} />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#60a5fa" />
        <Scene highQuality={highQuality} reducedMotion={reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
