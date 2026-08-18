import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const CARDS = [
  { label: 'Post', color: '#22d3ee', w: 0.55, h: 0.55 },
  { label: 'Reel', color: '#ec4899', w: 0.38, h: 0.62 },
  { label: 'Story', color: '#f59e0b', w: 0.34, h: 0.58 },
  { label: 'Comment', color: '#8b5cf6', w: 0.4, h: 0.28 },
  { label: 'Like', color: '#f472b6', w: 0.24, h: 0.24 },
  { label: 'Share', color: '#60a5fa', w: 0.3, h: 0.24 },
  { label: 'Calendar', color: '#34d399', w: 0.5, h: 0.4 },
]

function OrbitCard({ label, color, w, h, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.55) * radius * 0.35, Math.sin(t) * radius)
    ref.current.lookAt(0, 0, 6)
    const targetScale = hovered ? 1.35 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))
    if (labelRef.current) labelRef.current.style.opacity = hovered ? '1' : '0.72'
  })

  return (
    <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]} position={[0, -h / 2 - 0.16, 0]}>
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

function ContentCore({ highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.3)
  const [hovered, setHovered] = useState(false)

  const nodes = useMemo(
    () =>
      CARDS.map((c, i) => ({
        ...c,
        radius: 2.2 + (i % 3) * 0.35,
        angle: (i / CARDS.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.1 + (i % 3) * 0.03,
      })),
    [reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.3, 0.04)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.2, 0.04)
    }
    if (coreRef.current) {
      if (!reducedMotion) coreRef.current.rotation.y += delta * 0.15
      const targetScale = hovered ? 1.1 : 1
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 0.08))
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, hovered ? 0.5 : 0.3, 0.06)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.55}>
        <mesh ref={coreRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <icosahedronGeometry args={[0.85, highQuality ? 4 : 2]} />
          <MeshDistortMaterial color="#fb7185" emissive="#7c1d3f" emissiveIntensity={0.4} roughness={0.2} metalness={0.4} distort={0.3} speed={1.8} />
        </mesh>
        {nodes.map((n, i) => (
          <OrbitCard key={i} {...n} reducedMotion={reducedMotion} />
        ))}
      </Float>
    </group>
  )
}

export default function ContentHeroScene({ reducedMotion = false }) {
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 4]} intensity={1.1} color="#fda4af" />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#fb7185" />
        <ContentCore highQuality={highQuality} reducedMotion={reducedMotion} />
        <ParticleField count={highQuality ? 450 : 230} radius={5.5} sparkles={highQuality && !reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
