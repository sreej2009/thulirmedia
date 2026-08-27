import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

// One small, reusable "Digital Direction" system — real channels feeding a
// three-stage chain (Audience -> Brand -> Growth). Section 01 shows only
// the Brand stage (channels feed it directly); as progress advances into
// section 02, Audience then Growth appear and the channels re-target the
// front of the chain — the same object growing, not a swapped scene.

const CHANNELS = [
  { key: 'seo', label: 'SEO', color: '#f59e0b', angle: 0.2, radius: 2.15, y: 0.85 },
  { key: 'social', label: 'Social', color: '#22d3ee', angle: 1.15, radius: 1.9, y: -0.85 },
  { key: 'content', label: 'Content', color: '#f472b6', angle: 2.1, radius: 2.25, y: 0.6 },
  { key: 'google-ads', label: 'Google Ads', color: '#8b5cf6', angle: 3.05, radius: 2.0, y: -0.7 },
  { key: 'meta-ads', label: 'Meta Ads', color: '#ec4899', angle: 4.05, radius: 2.2, y: 0.3 },
  { key: 'website', label: 'Website', color: '#60a5fa', angle: 5.0, radius: 1.95, y: -0.35 },
]

const CHAIN = [
  { key: 'audience', label: 'Audience', color: '#c4b5fd', position: [-1.6, 0.1, -0.4] },
  { key: 'brand', label: 'Brand', color: '#a78bfa', position: [0, 0, 0] },
  { key: 'growth', label: 'Growth', color: '#4ade80', position: [1.6, 0.1, 0.35] },
]

function ChannelNode({ item, progressRef, hoveredKey, onHover, reducedMotion }) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const lineRef = useRef(null)
  const labelRef = useRef(null)
  const isHovered = hoveredKey === item.key
  const isDimmed = hoveredKey !== null && !isHovered

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0
    const audienceOn = THREE.MathUtils.clamp((progress - 0.35) / 0.2, 0, 1)
    const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * 0.04
    const x = Math.cos(t) * item.radius
    const y = item.y + Math.sin(t * 0.7) * 0.15
    const z = Math.sin(t) * item.radius

    if (groupRef.current) groupRef.current.position.set(x, y, z)
    if (meshRef.current) {
      const scale = isHovered ? 1.6 : isDimmed ? 0.8 : 1
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1))
      if (!reducedMotion) meshRef.current.rotation.y += delta * 0.3
    }

    // targets Brand until Audience is born, then re-targets Audience.
    const audiencePos = CHAIN[0].position
    const brandPos = CHAIN[1].position
    const target = new THREE.Vector3().lerpVectors(new THREE.Vector3(...brandPos), new THREE.Vector3(...audiencePos), audienceOn)
    if (lineRef.current?.geometry) lineRef.current.geometry.setPositions([x, y, z, target.x, target.y, target.z])
    if (lineRef.current?.material) {
      const base = isHovered ? 0.55 : isDimmed ? 0.05 : 0.22
      lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, base, 0.1)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(isHovered ? 1 : isDimmed ? 0.2 : 0.7)
  })

  return (
    <>
      <group ref={groupRef} onPointerOver={() => onHover(item.key)} onPointerOut={() => onHover(null)}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.09, 0]} />
          <meshBasicMaterial color={item.color} toneMapped={false} />
        </mesh>
        <Html center distanceFactor={8} occlude={false} zIndexRange={[5, 0]} position={[0, -0.2, 0]}>
          <span
            ref={labelRef}
            className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.16em]"
            style={{ color: item.color, opacity: 0.7, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {item.label}
          </span>
        </Html>
      </group>
      <Line ref={lineRef} points={[[0.001, 0, 0], [0, 0, 0]]} color={item.color} lineWidth={0.5} transparent opacity={0} />
    </>
  )
}

function ChainNode({ item, index, progressRef, reducedMotion }) {
  const meshRef = useRef(null)
  const glowRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0
    // brand (index 1) is always present; audience/growth ramp in with progress
    const born = index === 1 ? 1 : index === 0 ? THREE.MathUtils.clamp((progress - 0.3) / 0.2, 0, 1) : THREE.MathUtils.clamp((progress - 0.65) / 0.25, 0, 1)

    if (meshRef.current) {
      if (!reducedMotion) meshRef.current.rotation.y += delta * 0.15
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, born * (index === 1 ? 1.1 : 0.85), 0.08))
      if (meshRef.current.material) meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, born * 0.9, 0.08)
    }
    if (glowRef.current) glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, born * 1.6, 0.08)
    if (labelRef.current) labelRef.current.style.opacity = String(born * 0.9)
  })

  return (
    <group position={item.position}>
      <mesh ref={meshRef} scale={0}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshBasicMaterial color={item.color} transparent opacity={0} toneMapped={false} />
      </mesh>
      <pointLight ref={glowRef} intensity={0} color={item.color} distance={2.6} decay={2} />
      <Html center distanceFactor={8} occlude={false} zIndexRange={[6, 0]} position={[0, -0.3, 0]}>
        <span
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.18em] text-ink"
          style={{ opacity: 0, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
        >
          {item.label}
        </span>
      </Html>
    </group>
  )
}

function ChainLink({ progressRef }) {
  const ref = useRef(null)
  useFrame(() => {
    const progress = progressRef?.current ?? 0
    const on = THREE.MathUtils.clamp((progress - 0.4) / 0.3, 0, 1)
    if (ref.current?.material) ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, on * 0.3, 0.08)
  })
  return <Line ref={ref} points={[CHAIN[0].position, CHAIN[1].position, CHAIN[2].position]} color="#a78bfa" lineWidth={0.8} transparent opacity={0} />
}

function Scene({ progressRef, hoveredKey, onHover, isMobile, reducedMotion }) {
  const groupRef = useRef(null)
  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.08, 0.03)
      const progress = progressRef?.current ?? 0
      const expandProgress = THREE.MathUtils.clamp((progress - 0.9) / 0.1, 0, 1)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1 + expandProgress * 0.6, 0.05))
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <MouseLight intensity={isMobile ? 1.6 : 3} color="#a78bfa" />
      <ChainLink progressRef={progressRef} />
      {CHAIN.map((item, i) => (
        <ChainNode key={item.key} item={item} index={i} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
      {CHANNELS.map((item) => (
        <ChannelNode key={item.key} item={item} progressRef={progressRef} hoveredKey={hoveredKey} onHover={onHover} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

export default function DigitalDirectionScene({ progressRef, reducedMotion = false, compact = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.5]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const [hoveredKey, setHoveredKey] = useState(null)
  const internalProgressRef = useRef(compact ? 0 : 1)
  const effectiveProgressRef = progressRef ?? internalProgressRef

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0.15, compact ? 6.4 : 7.2], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 10]} />
          <Scene
            progressRef={effectiveProgressRef}
            hoveredKey={hoveredKey}
            onHover={setHoveredKey}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <ParticleField count={highQuality ? 90 : 45} radius={3.5} sparkles={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
