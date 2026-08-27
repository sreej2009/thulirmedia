import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'
import { engineeringStandard } from '../data'

// Six practices, one Engineering Core — nodes light up in sequence as the
// section is scrolled, each staying lit once reached (progress is
// cumulative, not a moving spotlight).

const NODES = engineeringStandard.nodes.map((n, i) => ({
  ...n,
  angle: (i / engineeringStandard.nodes.length) * Math.PI * 2,
  radius: 2.1 + (i % 2) * 0.3,
}))

function Node({ item, index, activeCountRef, reducedMotion }) {
  const ref = useRef(null)
  const meshRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state) => {
    const active = activeCountRef.current > index
    const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * 0.05
    const pos = [Math.cos(t) * item.radius, Math.sin(t * 0.6) * 0.4, Math.sin(t) * item.radius]
    if (ref.current) ref.current.position.set(...pos)
    if (meshRef.current) {
      const scale = active ? 1.15 : 0.65
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.08))
      if (meshRef.current.material) meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, active ? 1 : 0.3, 0.08)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(active ? 0.95 : 0.35)
  })

  return (
    <group ref={ref}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.13, 1]} />
        <meshBasicMaterial color={item.color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={8.5} occlude={false} zIndexRange={[5, 0]} position={[0, -0.32, 0]}>
        <span
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.15em]"
          style={{ color: item.color, opacity: 0.35, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
        >
          {item.label}
        </span>
      </Html>
    </group>
  )
}

function NodeLink({ item, index, activeCountRef }) {
  const lineRef = useRef(null)
  useFrame((state) => {
    if (!lineRef.current?.material) return
    const active = activeCountRef.current > index
    const t = item.angle + state.clock.elapsedTime * 0.05
    lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, active ? 0.35 : 0.05, 0.08)
    // keep the far end of the line loosely following the orbiting node
    if (lineRef.current.geometry) {
      const x = Math.cos(t) * item.radius
      const y = Math.sin(t * 0.6) * 0.4
      const z = Math.sin(t) * item.radius
      lineRef.current.geometry.setPositions([0, 0, 0, x * 0.5, y * 0.5 + 0.2, z * 0.5, x, y, z])
    }
  })
  return (
    <QuadraticBezierLine
      ref={lineRef}
      start={[0, 0, 0]}
      end={[Math.cos(item.angle) * item.radius, 0, Math.sin(item.angle) * item.radius]}
      mid={[Math.cos(item.angle) * item.radius * 0.5, 0.2, Math.sin(item.angle) * item.radius * 0.5]}
      color={item.color}
      lineWidth={0.6}
      transparent
      opacity={0.05}
    />
  )
}

function Core({ accent, activeCountRef, highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const glowRef = useRef(null)

  useFrame((state, delta) => {
    const activity = (activeCountRef.current ?? 0) / NODES.length
    if (coreRef.current) {
      if (!reducedMotion) coreRef.current.rotation.y += delta * 0.1
      if (coreRef.current.material) coreRef.current.material.distort = 0.22 + activity * 0.16
      const scale = 0.85 + activity * 0.2
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.05))
    }
    if (glowRef.current) glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 1.4 + activity * 2.2, 0.05)
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.3}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.7, highQuality ? 4 : 2]} />
        <MeshDistortMaterial color={accent} emissive={accent} emissiveIntensity={0.4} roughness={0.2} metalness={0.4} distort={0.22} speed={1.2} />
      </mesh>
      <pointLight ref={glowRef} intensity={1.4} color={accent} distance={4} decay={2} />
      <Html center distanceFactor={9} occlude={false} zIndexRange={[6, 0]} position={[0, -1, 0]}>
        <span className="pointer-events-none whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-ink" style={{ textShadow: '0 1px 8px rgba(10,10,12,0.95)' }}>
          Engineering Core
        </span>
      </Html>
    </Float>
  )
}

function Scene({ accent, activeCountRef, highQuality, reducedMotion, isMobile }) {
  const groupRef = useRef(null)
  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (groupRef.current) groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.09, 0.03)
  })
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <MouseLight intensity={highQuality ? 4 : 2} color={accent} />
      <Core accent={accent} activeCountRef={activeCountRef} highQuality={highQuality} reducedMotion={reducedMotion} />
      {NODES.map((item, i) => (
        <NodeLink key={item.key} item={item} index={i} activeCountRef={activeCountRef} />
      ))}
      {NODES.map((item, i) => (
        <Node key={item.key} item={item} index={i} activeCountRef={activeCountRef} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

export default function EngineeringCoreScene({ activeCountRef, accent = '#60a5fa', reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalRef = useRef(0)
  const effectiveRef = activeCountRef ?? internalRef

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0.3, 6.6], fov: 40 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 12]} />
          <Scene accent={accent} activeCountRef={effectiveRef} highQuality={highQuality} reducedMotion={reducedMotion} isMobile={isMobile} />
          <ParticleField count={highQuality ? 140 : 70} radius={4.5} sparkles={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
