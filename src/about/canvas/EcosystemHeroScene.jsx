import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import CameraRig from '../../components/canvas/CameraRig'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { ecosystem } from '../data'

// The Thulir Media ecosystem: one glowing core (the studio) with the six
// disciplines it's built from orbiting around it, connected back to the
// center — deliberately the same "core + orbit" language as the homepage
// and service pages, so About reads as a continuation, not a new system.

function OrbitNode({ label, color, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.65) * radius * 0.35, Math.sin(t) * radius)
    const targetScale = hovered ? 1.6 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))
    if (labelRef.current) labelRef.current.style.opacity = hovered ? '1' : '0.75'
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

function Ecosystem({ highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.3)

  const nodes = useMemo(
    () =>
      ecosystem.map((n, i) => ({
        ...n,
        radius: 2.2 + (i % 3) * 0.4,
        angle: (i / ecosystem.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.085 + (i % 3) * 0.03,
      })),
    [reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.28, 0.04)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.32, 0.04)
    }
    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.12
        coreRef.current.rotation.x += delta * 0.04
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.3, 0.05)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.55}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, highQuality ? 4 : 2]} />
          <MeshDistortMaterial
            color="#a78bfa"
            emissive="#3d2a6b"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.5}
            distort={0.3}
            speed={1.5}
          />
        </mesh>

        {nodes.map((n, i) => (
          <group key={i}>
            <QuadraticBezierLine
              start={[0, 0, 0]}
              end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.65) * n.radius * 0.35, Math.sin(n.angle) * n.radius]}
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

export default function EcosystemHeroScene({ reducedMotion = false }) {
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
          <pointLight position={[-4, -3, -3]} intensity={1.1} color="#7c5cd6" />
          <MouseLight intensity={highQuality ? 6 : 3} color="#a78bfa" />

          <Ecosystem highQuality={highQuality} reducedMotion={reducedMotion} />
          <ParticleField count={highQuality ? 480 : 250} radius={5.5} sparkles={highQuality && !reducedMotion} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
