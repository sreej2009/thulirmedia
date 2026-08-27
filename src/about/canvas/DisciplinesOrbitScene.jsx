import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile, useIsTouch } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { capabilities } from '../data'

// "What Connects Us" — six disciplines scattered in true 3D around the
// Thulir Media core, cross-linked to each other (not just a spoke ring),
// with data particles traveling the connections — the studio doesn't work
// in silos, so the network shouldn't look like one.

const POSITIONS = [
  [-2.6, 1.2, -1.4],
  [2.7, 1.0, -1.7],
  [3.1, -1.1, 0.6],
  [-1.7, -1.7, 1.2],
  [-3.2, 0.0, 1.0],
  [1.6, 1.9, 1.1],
]

// index pairs — a connected web between related disciplines, not a ring.
const LINKS = [
  [0, 3],
  [3, 1],
  [1, 2],
  [2, 0],
  [4, 5],
  [5, 0],
  [4, 0],
]

function DataParticle({ curve, color, speed, offset }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    ref.current.position.copy(curve.getPointAt(t))
    if (ref.current.material) ref.current.material.opacity = Math.sin(t * Math.PI) * 0.85
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function DisciplineNode({ item, index, hoveredIndex, onHover, onNavigate, reducedMotion }) {
  const meshRef = useRef(null)
  const labelRef = useRef(null)
  const isTouch = useIsTouch()
  const isHovered = hoveredIndex === index
  const isDimmed = hoveredIndex !== null && !isHovered

  useFrame((state, delta) => {
    if (!meshRef.current) return
    if (!reducedMotion) meshRef.current.rotation.y += delta * 0.25
    const targetScale = isHovered ? 1.55 : isDimmed ? 0.85 : 1
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12))
    if (labelRef.current) {
      const baseOpacity = isHovered ? 1 : isDimmed ? 0.22 : 0.75
      labelRef.current.style.opacity = String(baseOpacity)
    }
  })

  const handleClick = async (e) => {
    e.preventDefault()
    const rect = labelRef.current?.getBoundingClientRect()
    if (rect) setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    await coverTransition(item.accent)
    onNavigate(item.path)
  }

  return (
    <group position={POSITIONS[index]}>
      <mesh ref={meshRef} onPointerOver={() => onHover(index)} onPointerOut={() => onHover(null)}>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshBasicMaterial color={item.accent} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={8.5} occlude={false} zIndexRange={[10, 0]} position={[0, -0.5, 0]}>
        <a
          href={item.path}
          ref={labelRef}
          onClick={handleClick}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          data-cursor="hover"
          data-cursor-text="Explore"
          className="pointer-events-auto flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center backdrop-blur-sm transition-all duration-300"
          style={{
            borderColor: `${item.accent}${isHovered ? '80' : '30'}`,
            background: isHovered ? `${item.accent}1a` : 'rgba(10,10,12,0.55)',
          }}
        >
          <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.1em]" style={{ color: item.accent }}>
            {item.label}
          </span>
          {(isHovered || isTouch) && (
            <span className="max-w-[10rem] whitespace-normal text-[10px] leading-snug text-mist">{item.blurb}</span>
          )}
        </a>
      </Html>
    </group>
  )
}

function CoreLink({ index, hoveredIndex }) {
  const lineRef = useRef(null)
  const item = capabilities[index]
  const start = useMemo(() => new THREE.Vector3(...POSITIONS[index]), [index])
  const mid = useMemo(() => start.clone().multiplyScalar(0.5).add(new THREE.Vector3(0, 0.3, 0)), [start])
  const core = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, core), [start, mid, core])
  const isHovered = hoveredIndex === index
  const isDimmed = hoveredIndex !== null && !isHovered

  useFrame(() => {
    if (!lineRef.current?.material) return
    const target = isHovered ? 0.55 : isDimmed ? 0.05 : 0.2
    lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, target, 0.1)
  })

  return (
    <>
      <QuadraticBezierLine
        ref={lineRef}
        start={POSITIONS[index]}
        end={[0, 0, 0]}
        mid={mid.toArray()}
        color={item.accent}
        lineWidth={isHovered ? 1.2 : 0.6}
        transparent
        opacity={0.2}
      />
      <DataParticle curve={curve} color={item.accent} speed={0.16 + (index % 3) * 0.04} offset={index / capabilities.length} />
    </>
  )
}

function CrossLink({ a, b, hoveredIndex }) {
  const lineRef = useRef(null)
  const start = useMemo(() => new THREE.Vector3(...POSITIONS[a]), [a])
  const end = useMemo(() => new THREE.Vector3(...POSITIONS[b]), [b])
  const mid = useMemo(() => start.clone().add(end).multiplyScalar(0.5).multiplyScalar(0.55), [start, end])
  const active = hoveredIndex === a || hoveredIndex === b

  useFrame(() => {
    if (!lineRef.current?.material) return
    const target = hoveredIndex === null ? 0.09 : active ? 0.4 : 0.03
    lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, target, 0.1)
  })

  return (
    <QuadraticBezierLine
      ref={lineRef}
      start={POSITIONS[a]}
      end={POSITIONS[b]}
      mid={mid.toArray()}
      color="#8f7bdc"
      lineWidth={0.4}
      transparent
      opacity={0.09}
    />
  )
}

function StudioCoreMark({ hoveredIndex, highQuality, reducedMotion }) {
  const coreRef = useRef(null)
  const shellRef = useRef(null)
  const glowRef = useRef(null)
  const distortRef = useRef(0.28)

  useFrame((state, delta) => {
    const active = hoveredIndex !== null ? 1 : 0
    if (coreRef.current) {
      if (!reducedMotion) coreRef.current.rotation.y += delta * 0.1
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.28 + active * 0.18, 0.06)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
      const scale = 1 + active * 0.12
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.08))
    }
    if (shellRef.current && !reducedMotion) shellRef.current.rotation.y -= delta * 0.06
    if (glowRef.current) glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 2.2 + active * 2, 0.06)
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.8} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.35}>
      <mesh ref={shellRef} scale={1.35}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.14} toneMapped={false} />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, highQuality ? 4 : 2]} />
        <MeshDistortMaterial color="#8f7bdc" emissive="#2f2260" emissiveIntensity={0.55} roughness={0.2} metalness={0.4} distort={0.28} speed={1.2} />
      </mesh>
      <pointLight ref={glowRef} intensity={2.2} color="#c4b5fd" distance={3.5} decay={2} />
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]} position={[0, -0.85, 0]}>
        <span className="pointer-events-none whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.25em] text-ink" style={{ textShadow: '0 1px 8px rgba(10,10,12,0.95)' }}>
          Thulir Media
        </span>
      </Html>
    </Float>
  )
}

function Network({ reducedMotion, onNavigate }) {
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const isMobileHook = useIsMobile()

  useFrame((state) => {
    if (reducedMotion || isMobileHook) return
    const { pointer } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.08, 0.03)
    }
  })

  return (
    <group ref={groupRef}>
      <StudioCoreMark hoveredIndex={hovered} highQuality={!isMobileHook} reducedMotion={reducedMotion} />

      {LINKS.map(([a, b], i) => (
        <CrossLink key={i} a={a} b={b} hoveredIndex={hovered} />
      ))}
      {capabilities.map((item, i) => (
        <CoreLink key={item.path} index={i} hoveredIndex={hovered} />
      ))}
      {capabilities.map((item, i) => (
        <DisciplineNode key={item.path} item={item} index={i} hoveredIndex={hovered} onHover={setHovered} onNavigate={onNavigate} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

export default function DisciplinesOrbitScene({ reducedMotion = false, onNavigate }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.3, 7.2], fov: 40 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 12]} />
          <ambientLight intensity={0.4} />
          <MouseLight intensity={highQuality ? 5 : 2.5} color="#a78bfa" />
          <Network reducedMotion={reducedMotion} onNavigate={onNavigate} />
          <ParticleField count={highQuality ? 260 : 140} radius={5} sparkles={false} />
          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
