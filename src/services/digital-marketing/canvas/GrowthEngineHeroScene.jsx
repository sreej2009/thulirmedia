import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  AdaptiveDpr,
  PerformanceMonitor,
  Environment,
  Lightformer,
  Float,
  Html,
  MeshDistortMaterial,
  QuadraticBezierLine,
} from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

// The Growth Engine: a glowing core with the ten channels that feed it —
// Google Ads, Meta Ads, Social, Content, SEO, Website, Analytics, Audience,
// Leads, Sales — orbiting and labelled, connected back to the core.
const NODES = [
  { label: 'Google Ads', color: '#8b5cf6' },
  { label: 'Meta Ads', color: '#ec4899' },
  { label: 'Social Media', color: '#22d3ee' },
  { label: 'Content', color: '#f59e0b' },
  { label: 'SEO', color: '#34d399' },
  { label: 'Website', color: '#60a5fa' },
  { label: 'Analytics', color: '#a78bfa' },
  { label: 'Audience', color: '#f472b6' },
  { label: 'Leads', color: '#fb923c' },
  { label: 'Sales', color: '#4ade80' },
]

function OrbitNode({ label, color, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * radius * 0.32, Math.sin(t) * radius)
    const targetScale = hovered ? 1.7 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))
    if (labelRef.current) labelRef.current.style.opacity = hovered ? '1' : '0.7'
  })

  return (
    <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh>
        <icosahedronGeometry args={[0.13, 0]} />
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

function GrowthEngine({ highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.32)
  const [hovered, setHovered] = useState(false)

  const nodes = useMemo(
    () =>
      NODES.map((n, i) => ({
        ...n,
        radius: 2.3 + (i % 3) * 0.4,
        angle: (i / NODES.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.09 + (i % 3) * 0.03,
      })),
    [reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.3, 0.04)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.35, 0.04)
    }
    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.14
        coreRef.current.rotation.x += delta * 0.05
      }
      const targetScale = hovered ? 1.1 : 1
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 0.08))
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, hovered ? 0.5 : 0.32, 0.06)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.3} floatIntensity={reducedMotion ? 0 : 0.6}>
        <mesh ref={coreRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <icosahedronGeometry args={[1, highQuality ? 4 : 2]} />
          <MeshDistortMaterial
            color="#a3e635"
            emissive="#3f5c0a"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.5}
            distort={0.32}
            speed={1.6}
          />
        </mesh>

        {nodes.map((n, i) => (
          <group key={i}>
            <QuadraticBezierLine
              start={[0, 0, 0]}
              end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.7) * n.radius * 0.32, Math.sin(n.angle) * n.radius]}
              mid={[Math.cos(n.angle) * n.radius * 0.5, 0.4, Math.sin(n.angle) * n.radius * 0.5]}
              color={n.color}
              lineWidth={0.6}
              transparent
              opacity={reducedMotion ? 0.16 : 0.2}
            />
            <OrbitNode {...n} reducedMotion={reducedMotion} />
          </group>
        ))}
      </Float>
    </group>
  )
}

export default function GrowthEngineHeroScene({ reducedMotion = false }) {
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
      camera={{ position: [0, 0, 7], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 4, 13]} />
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.5 : 0.25} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={1.1} color="#c4b5fd" />
        <pointLight position={[-4, -3, -3]} intensity={1.2} color="#3b82f6" />
        <MouseLight intensity={highQuality ? 6 : 3} color="#a3e635" />

        <GrowthEngine highQuality={highQuality} reducedMotion={reducedMotion} />
        <ParticleField count={highQuality ? 500 : 260} radius={5.5} sparkles={highQuality && !reducedMotion} />

        <Environment resolution={128}>
          <Lightformer intensity={2} color="#a3e635" position={[3, 2, -2]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.5} color="#22d3ee" position={[-3, -2, -2]} scale={[4, 4, 1]} />
          <Lightformer intensity={1} color="#ffffff" position={[0, 4, 3]} scale={[6, 2, 1]} />
        </Environment>

        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
