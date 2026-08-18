import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Html, Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { projects } from '../data'

// project "screens" scattered along a gentle depth path the camera flies
// through as the hero is scrolled — deliberately simple: one plane, one
// glow, one label per project. No per-card geometry complexity.
const LAYOUT = [
  [-1.6, 0.6, -2],
  [1.8, -0.4, -6],
  [-1.2, -1, -10],
  [1.4, 1.1, -14],
  [-2, 0.2, -18],
  [1.6, -0.8, -22],
  [-0.8, 0.9, -26],
]

function ProjectCard({ project, position, order, reducedMotion }) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const labelRef = useRef(null)
  const activation = useRef(0)

  useFrame((state) => {
    // activation ramps as the camera approaches this card's z position
    const camZ = state.camera.position.z
    const dist = Math.abs(camZ - position[2])
    const target = THREE.MathUtils.clamp(1 - dist / 7, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.06)

    if (meshRef.current) {
      const scale = 0.85 + activation.current * 0.3
      meshRef.current.scale.setScalar(scale)
      if (meshRef.current.material) meshRef.current.material.opacity = 0.35 + activation.current * 0.55
      if (!reducedMotion) meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + order) * 0.15
    }
    if (labelRef.current) {
      labelRef.current.style.opacity = String(0.2 + activation.current * 0.8)
      labelRef.current.style.transform = `translateY(${(1 - activation.current) * 8}px)`
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Float speed={reducedMotion ? 0 : 1} floatIntensity={reducedMotion ? 0 : 0.4} rotationIntensity={0}>
        <mesh ref={meshRef}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshBasicMaterial color={project.accent} transparent opacity={0.35} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2.68, 1.68]} />
          <meshBasicMaterial color={project.accent} transparent opacity={0.12} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </Float>
      <Html center distanceFactor={10} occlude={false} zIndexRange={[10, 0]} position={[0, -1.15, 0]}>
        <div ref={labelRef} className="pointer-events-none flex flex-col items-center gap-1 text-center transition-opacity">
          <span className="whitespace-nowrap text-sm font-medium text-ink">{project.title}</span>
          <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-mist">{project.category}</span>
        </div>
      </Html>
    </group>
  )
}

function Scene({ progressRef, reducedMotion, cards }) {
  useFrame((state) => {
    const totalDepth = LAYOUT[LAYOUT.length - 1][2] - 4
    const targetZ = 6 + progressRef.current * (totalDepth - 6)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06)

    if (!reducedMotion) {
      const { pointer } = state
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.6, 0.04)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.35, 0.04)
    }
    state.camera.lookAt(0, 0, state.camera.position.z - 8)
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, -2, -10]} intensity={0.8} color="#60a5fa" />
      {cards.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          position={LAYOUT[i % LAYOUT.length]}
          order={i}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  )
}

export default function ProjectUniverseScene({ progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const cards = useMemo(() => (isMobile ? projects.slice(0, 4) : projects), [isMobile])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
    <Canvas
      dpr={dpr}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 8, 26]} />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#a78bfa" />
        <Scene progressRef={progressRef} reducedMotion={reducedMotion} cards={cards} />
        <ParticleField count={highQuality ? 500 : 250} radius={12} sparkles={highQuality && !reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
