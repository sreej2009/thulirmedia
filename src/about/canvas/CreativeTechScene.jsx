import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// Two systems — organic "Creative" (warm, distorted, free-floating) and
// geometric "Technology" (cool, faceted, precise) — that scroll-merge into
// one shared core. progressRef comes from the section's ScrollTrigger.

function CreativeBody({ progress, reducedMotion }) {
  const ref = useRef(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    const x = THREE.MathUtils.lerp(-2.4, -0.35, progress.current)
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.08)
    if (!reducedMotion) ref.current.rotation.y += delta * (0.25 + progress.current * 0.4)
    const scale = 1 + progress.current * 0.15
    ref.current.scale.setScalar(scale)
    if (ref.current.material) ref.current.material.distort = 0.45 - progress.current * 0.15
  })
  return (
    <Float speed={reducedMotion ? 0 : 1.3} rotationIntensity={reducedMotion ? 0 : 0.3} floatIntensity={reducedMotion ? 0 : 0.6}>
      <mesh ref={ref} position={[-2.4, 0, 0]}>
        <icosahedronGeometry args={[0.95, 3]} />
        <MeshDistortMaterial color="#f97316" emissive="#7c2d12" emissiveIntensity={0.5} roughness={0.25} metalness={0.3} distort={0.45} speed={1.8} />
      </mesh>
    </Float>
  )
}

function TechBody({ progress, reducedMotion }) {
  const ref = useRef(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    const x = THREE.MathUtils.lerp(2.4, 0.35, progress.current)
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.08)
    if (!reducedMotion) {
      ref.current.rotation.y -= delta * (0.2 + progress.current * 0.35)
      ref.current.rotation.x += delta * 0.08
    }
    const scale = 1 + progress.current * 0.15
    ref.current.scale.setScalar(scale)
  })
  return (
    <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.5}>
      <mesh ref={ref} position={[2.4, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#818cf8" emissive="#312e81" emissiveIntensity={0.4} roughness={0.15} metalness={0.75} wireframe={false} />
      </mesh>
      <mesh position={[2.4, 0, 0]} scale={1.28}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#a5b4fc" wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </Float>
  )
}

function MergeGlow({ progress }) {
  const ref = useRef(null)
  useFrame(() => {
    if (!ref.current) return
    const intensity = progress.current > 0.55 ? (progress.current - 0.55) / 0.45 : 0
    ref.current.scale.setScalar(0.4 + intensity * 1.4)
    if (ref.current.material) ref.current.material.opacity = intensity * 0.5
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#c4b5fd" transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function Scene({ progressRef, reducedMotion, highQuality }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#fdba74" />
      <pointLight position={[-3, -1, -2]} intensity={1} color="#818cf8" />
      <MouseLight intensity={highQuality ? 5 : 2.5} color="#c4b5fd" />

      <CreativeBody progress={progressRef} reducedMotion={reducedMotion} />
      <TechBody progress={progressRef} reducedMotion={reducedMotion} />
      <MergeGlow progress={progressRef} />

      <ParticleField count={highQuality ? 420 : 220} radius={6} sparkles={highQuality && !reducedMotion} />
    </>
  )
}

export default function CreativeTechScene({ progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.7]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 7], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 13]} />
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} highQuality={highQuality} />
          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
