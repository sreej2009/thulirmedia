import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

// Generic "technology constellation" — a glowing core with labelled nodes
// orbiting it, connected by curved lines. Reused across every service page's
// Technology/Platforms section with different node data + accent color.

const worldPosScratch = new THREE.Vector3()

function OrbitNode({ label, color, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * radius * 0.4, Math.sin(t) * radius)

    const targetScale = hovered ? 1.5 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))

    if (labelRef.current) {
      // Nodes keep orbiting freely, but a label is only useful once it's
      // clear of dead-center — that's exactly where callers like Home
      // overlay a large headline, so fade the text out (not the node)
      // as it swings through the middle instead of colliding with it.
      ref.current.getWorldPosition(worldPosScratch)
      worldPosScratch.project(state.camera)
      const centerFade = THREE.MathUtils.smoothstep(Math.abs(worldPosScratch.x), 0.06, 0.42)
      const baseOpacity = hovered ? 1 : 0.75
      labelRef.current.style.opacity = String(baseOpacity * centerFade)
    }
  })

  return (
    <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh>
        <icosahedronGeometry args={[0.14, 0]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={8} occlude={false} zIndexRange={[10, 0]}>
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

function Cluster({ items, accent, highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.25)

  const nodes = useMemo(
    () =>
      items.map((item, i) => ({
        ...item,
        radius: 2 + (i % 3) * 0.4,
        angle: (i / items.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.1 + (i % 3) * 0.035,
      })),
    [items, reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.3, 0.04)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.25, 0.04)
    }
    if (coreRef.current) {
      if (!reducedMotion) coreRef.current.rotation.y += delta * 0.15
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.28, 0.05)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1.1} color={accent} />
      <pointLight position={[0, -2, -3]} intensity={0.6} color="#ffffff" />

      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.5}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.8, highQuality ? 3 : 1]} />
          <MeshDistortMaterial color={accent} emissive={accent} emissiveIntensity={0.25} roughness={0.25} metalness={0.4} distort={0.25} speed={1.4} />
        </mesh>

        {nodes.map((n, i) => (
          <group key={i}>
            <QuadraticBezierLine
              start={[0, 0, 0]}
              end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.6) * n.radius * 0.4, Math.sin(n.angle) * n.radius]}
              mid={[Math.cos(n.angle) * n.radius * 0.5, 0.35, Math.sin(n.angle) * n.radius * 0.5]}
              color={n.color || accent}
              lineWidth={0.6}
              transparent
              opacity={0.22}
            />
            <OrbitNode {...n} reducedMotion={reducedMotion} />
          </group>
        ))}
      </Float>
    </group>
  )
}

export default function OrbitCluster({ items, accent = '#a78bfa', reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const visibleItems = useMemo(() => (isMobile ? items.slice(0, 4) : items), [items, isMobile])

  return (
    <div ref={containerRef} className="absolute inset-0">
    <Canvas
      dpr={dpr}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 3.5, 10]} />
        <Cluster items={visibleItems} accent={accent} highQuality={highQuality} reducedMotion={reducedMotion} />
        <ParticleField count={highQuality ? 260 : 140} radius={4.5} sparkles={false} />
      </Suspense>
    </Canvas>
    </div>
  )
}
