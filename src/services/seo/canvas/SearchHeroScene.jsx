import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const NODES = [
  { label: 'Keywords', color: '#34d399' },
  { label: 'Crawlers', color: '#22d3ee' },
  { label: 'Backlinks', color: '#8b5cf6' },
  { label: 'Rankings', color: '#f59e0b' },
  { label: 'Analytics', color: '#60a5fa' },
  { label: 'Websites', color: '#4ade80' },
]

function OrbitNode({ label, color, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * radius * 0.3, Math.sin(t) * radius)
    const targetScale = hovered ? 1.6 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))
    if (labelRef.current) labelRef.current.style.opacity = hovered ? '1' : '0.72'
  })

  return (
    <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] backdrop-blur-sm transition-opacity"
          style={{ borderColor: `${color}55`, background: 'rgba(10,10,12,0.55)', color }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function SearchBar({ reducedMotion }) {
  const groupRef = useRef(null)
  const cursorRef = useRef(null)

  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      const { pointer } = state
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.15, 0.04)
    }
    if (cursorRef.current) {
      cursorRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.4
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 1} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.5}>
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[3.2, 0.75, 0.2]} />
          <meshStandardMaterial color="#121215" roughness={0.4} metalness={0.4} emissive="#f59e0b" emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[-1.35, 0, 0.11]}>
          <torusGeometry args={[0.13, 0.03, 12, 24]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
        <mesh position={[-1.15, -0.14, 0.11]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
        <mesh ref={cursorRef} position={[0.9, 0, 0.11]}>
          <planeGeometry args={[0.03, 0.35]} />
          <meshBasicMaterial color="#e9d5ff" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function Scene({ highQuality, reducedMotion }) {
  const nodes = useMemo(
    () =>
      NODES.map((n, i) => ({
        ...n,
        radius: 2.1 + (i % 3) * 0.4,
        angle: (i / NODES.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.1 + (i % 3) * 0.03,
      })),
    [reducedMotion]
  )

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#fcd34d" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#f59e0b" />

      <SearchBar reducedMotion={reducedMotion} />
      {nodes.map((n, i) => (
        <OrbitNode key={i} {...n} reducedMotion={reducedMotion} />
      ))}

      <ParticleField count={highQuality ? 450 : 230} radius={5.5} sparkles={highQuality && !reducedMotion} />
    </>
  )
}

export default function SearchHeroScene({ reducedMotion = false }) {
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
      camera={{ position: [0, 0, 6.8], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 4, 12]} />
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.4 : 0.2} />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#f59e0b" />
        <Scene highQuality={highQuality} reducedMotion={reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
