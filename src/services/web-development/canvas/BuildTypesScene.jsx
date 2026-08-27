import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Html, Line, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

// One architecture, three layouts. Switching build type doesn't replace the
// scene — every panel eases toward the new mode's position/label, so the
// same six generic "panels" become a multi-page site, a single funnel, or
// a connected commerce flow depending on which is selected.

const MODES = [
  {
    key: 'business',
    items: ['Home', 'About', 'Services', 'Contact', '', ''],
    positions: [
      [-2.3, 0.4, -0.4],
      [-0.75, 0.15, 0.15],
      [0.75, 0.15, 0.15],
      [2.3, 0.4, -0.4],
      [0, -2, -1.2],
      [0, -2, -1.2],
    ],
  },
  {
    key: 'landing',
    items: ['Hero', 'Offer', 'Proof', 'CTA', '', ''],
    positions: [
      [0, 1.6, 0],
      [0, 0.55, 0.15],
      [0, -0.55, 0.15],
      [0, -1.6, 0.3],
      [0, -2, -1.2],
      [0, -2, -1.2],
    ],
  },
  {
    key: 'ecommerce',
    items: ['Products', 'Catalog', 'Cart', 'Checkout', 'Payment', 'Order'],
    positions: [
      [-2.1, 1, -0.4],
      [-2.1, -1, -0.2],
      [-0.2, 1.3, 0.3],
      [-0.2, -1.3, 0.3],
      [2.1, 1, -0.1],
      [2.1, -1, -0.3],
    ],
  },
]

const COLORS = ['#60a5fa', '#8b5cf6', '#34d399', '#f472b6', '#f59e0b', '#22d3ee']

function Panel({ index, activeModeRef }) {
  const meshRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state, delta) => {
    const mode = MODES[activeModeRef.current]
    const active = index < mode.items.filter(Boolean).length
    const target = new THREE.Vector3(...mode.positions[index])

    if (meshRef.current) {
      meshRef.current.position.lerp(target, 0.1)
      if (!active) meshRef.current.rotation.y += delta * 0.4
      const scale = active ? 1 : 0.001
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.08))
      if (meshRef.current.material) meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, active ? 0.85 : 0, 0.08)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(active ? 0.9 : 0)
  })

  return (
    <group>
      <mesh ref={meshRef} scale={0.001}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshBasicMaterial color={COLORS[index]} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
        <Html center distanceFactor={7.5} occlude={false} zIndexRange={[5, 0]}>
          <span
            ref={labelRef}
            className="pointer-events-none whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.15em]"
            style={{ color: '#f5f4f2', opacity: 0, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {MODES[activeModeRef.current]?.items[index]}
          </span>
        </Html>
      </mesh>
    </group>
  )
}

function ConnectionLine({ index, activeModeRef, accent }) {
  const ref = useRef(null)

  useFrame(() => {
    if (!ref.current?.geometry) return
    const mode = MODES[activeModeRef.current]
    const count = mode.items.filter(Boolean).length
    const active = index < count - 1
    if (active) {
      const a = mode.positions[index]
      const b = mode.positions[index + 1]
      ref.current.geometry.setPositions([a[0], a[1], a[2], b[0], b[1], b[2]])
    }
    if (ref.current.material) ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, active ? 0.25 : 0, 0.08)
  })

  return <Line ref={ref} points={[[0, 0, 0], [0.001, 0, 0]]} color={accent} lineWidth={0.6} transparent opacity={0} />
}

function CoreMark({ accent, highQuality, reducedMotion }) {
  const ref = useRef(null)
  useFrame((state, delta) => {
    if (!ref.current || reducedMotion) return
    ref.current.rotation.y += delta * 0.15
  })
  return (
    <mesh ref={ref} scale={0.32}>
      <icosahedronGeometry args={[1, highQuality ? 4 : 2]} />
      <MeshDistortMaterial color={accent} emissive={accent} emissiveIntensity={0.35} roughness={0.2} metalness={0.4} distort={0.25} speed={1.3} />
    </mesh>
  )
}

function Scene({ activeModeRef, accent, highQuality, reducedMotion, isMobile }) {
  const groupRef = useRef(null)
  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.1, 0.03)
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1} color="#93c5fd" />
      <MouseLight intensity={highQuality ? 4 : 2} color={accent} />

      <CoreMark accent={accent} highQuality={highQuality} reducedMotion={reducedMotion} />
      {Array.from({ length: 6 }).map((_, i) => (
        <ConnectionLine key={i} index={i} activeModeRef={activeModeRef} accent={accent} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Panel key={i} index={i} activeModeRef={activeModeRef} />
      ))}
    </group>
  )
}

export default function BuildTypesScene({ activeModeRef, accent = '#60a5fa', reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalRef = useRef(0)
  const effectiveRef = activeModeRef ?? internalRef

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 6.4], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 12]} />
          <Scene activeModeRef={effectiveRef} accent={accent} highQuality={highQuality} reducedMotion={reducedMotion} isMobile={isMobile} />
          <ParticleField count={highQuality ? 160 : 80} radius={5} sparkles={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
