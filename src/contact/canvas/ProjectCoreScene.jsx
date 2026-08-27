import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// The "Project Core" — a translucent layered core carrying small UI/data
// fragments, orbited by five labels (Idea/Design/Tech/Content/Growth). The
// whole thing reacts to the briefing form: which field is focused and which
// service is selected drive which label brightens and what color tints the
// core, via two plain refs (no React state) so typing never re-renders R3F.

const LABELS = [
  { key: 'about', text: 'Idea', color: '#c4b5fd', angle: 0.4, radius: 1.9 },
  { key: 'design', text: 'Design', color: '#f97316', angle: 1.5, radius: 2.15 },
  { key: 'tech', text: 'Tech', color: '#60a5fa', angle: 2.6, radius: 1.85 },
  { key: 'content', text: 'Content', color: '#fb7185', angle: 3.9, radius: 2.1 },
  { key: 'growth', text: 'Growth', color: '#a3e635', angle: 5.1, radius: 1.95 },
]

const FRAGMENTS = Array.from({ length: 8 }).map((_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  radius: 0.55 + (i % 3) * 0.12,
  y: Math.sin(i * 1.7) * 0.3,
  kind: i % 3 === 0 ? 'dot' : i % 3 === 1 ? 'line' : 'plane',
  seed: i,
}))

const colorFromScratch = new THREE.Color()
const colorToScratch = new THREE.Color()

function OrbitLabel({ item, focusRef, reducedMotion }) {
  const ref = useRef(null)
  const dotRef = useRef(null)
  const lineRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state) => {
    const focus = focusRef.current
    const active = focus === item.key || focus === 'review' || focus === 'success'
    const boosted = focus === 'details' ? 0.35 : 0
    const target = (active ? 1 : 0.32) + boosted

    const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * 0.045
    const x = Math.cos(t) * item.radius
    const y = Math.sin(t * 0.8 + item.angle) * 0.35
    const z = Math.sin(t) * item.radius

    if (ref.current) ref.current.position.set(x, y, z)
    if (dotRef.current) {
      const s = THREE.MathUtils.lerp(dotRef.current.scale.x || 0.001, active ? 1.6 : 1, 0.1)
      dotRef.current.scale.setScalar(s)
      if (dotRef.current.material) dotRef.current.material.opacity = THREE.MathUtils.lerp(dotRef.current.material.opacity, 0.5 + target * 0.5, 0.1)
    }
    if (lineRef.current?.geometry) lineRef.current.geometry.setPositions([x, y, z, 0, 0, 0])
    if (lineRef.current?.material) {
      lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, 0.08 + target * 0.3, 0.08)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(0.45 + target * 0.55)
  })

  return (
    <>
      <group ref={ref}>
        <mesh ref={dotRef}>
          <icosahedronGeometry args={[0.055, 0]} />
          <meshBasicMaterial color={item.color} transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <Html center distanceFactor={8} occlude={false} zIndexRange={[5, 0]} position={[0, -0.22, 0]}>
          <span
            ref={labelRef}
            className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{ color: item.color, opacity: 0.45, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {item.text}
          </span>
        </Html>
      </group>
      <Line ref={lineRef} points={[[0.001, 0, 0], [0, 0, 0]]} color={item.color} lineWidth={0.5} transparent opacity={0.08} />
    </>
  )
}

function CoreFragments({ focusRef, reducedMotion }) {
  const refs = useRef([])

  useFrame((state, delta) => {
    const focus = focusRef.current
    const boost = focus === 'details' || focus === 'review' || focus === 'success' ? 1 : 0

    FRAGMENTS.forEach((item, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * (0.12 + (i % 3) * 0.03)
      mesh.position.set(Math.cos(t) * item.radius, item.y, Math.sin(t) * item.radius)
      if (!reducedMotion) mesh.rotation.y += delta * 0.2
      if (mesh.material) mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, 0.4 + boost * 0.35, 0.06)
    })
  })

  return (
    <>
      {FRAGMENTS.map((item, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          {item.kind === 'dot' && <sphereGeometry args={[0.03, 8, 8]} />}
          {item.kind === 'line' && <boxGeometry args={[0.16, 0.018, 0.018]} />}
          {item.kind === 'plane' && <planeGeometry args={[0.13, 0.09]} />}
          <meshBasicMaterial color="#e9d5ff" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

function Core({ focusRef, serviceColorRef, highQuality, reducedMotion }) {
  const shellRef = useRef(null)
  const coreRef = useRef(null)
  const glowRef = useRef(null)
  const ringRef = useRef(null)
  const distortRef = useRef(0.26)
  const pulseRef = useRef(null)

  useFrame((state, delta) => {
    const focus = focusRef.current
    const activity =
      focus === 'idle' ? 0 : focus === 'success' ? 1.3 : focus === 'review' || focus === 'complete' ? 1 : focus === 'details' ? 0.7 : 0.45
    const serviceColor = serviceColorRef.current

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.07
        coreRef.current.rotation.x += delta * 0.02
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.24 + activity * 0.2, 0.05)
      if (coreRef.current.material) {
        coreRef.current.material.distort = distortRef.current
        colorFromScratch.set('#8f7bdc')
        colorToScratch.set(serviceColor || '#c4b5fd')
        colorFromScratch.lerp(colorToScratch, serviceColor ? 0.55 : 0)
        coreRef.current.material.color.lerp(colorFromScratch, 0.06)
        coreRef.current.material.emissiveIntensity = 0.35 + activity * 0.45
      }
      const scale = 1 + activity * 0.08
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.05))
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= delta * 0.045
      shellRef.current.rotation.z += delta * 0.014
    }
    if (ringRef.current && !reducedMotion) {
      ringRef.current.rotation.z += delta * 0.05
    }
    if (glowRef.current) {
      colorToScratch.set(serviceColor || '#c4b5fd')
      glowRef.current.color.lerp(colorToScratch, 0.05)
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 1.6 + activity * 2.2, 0.05)
    }
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * 0.4) % 1
      const on = focus === 'success' ? 1 : 0
      pulseRef.current.scale.setScalar(0.5 + t * 1.5 * on)
      if (pulseRef.current.material) pulseRef.current.material.opacity = (1 - t) * 0.32 * on
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.6} rotationIntensity={reducedMotion ? 0 : 0.1} floatIntensity={reducedMotion ? 0 : 0.2}>
      <mesh ref={shellRef} scale={1.28}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.1} toneMapped={false} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, Math.PI / 7]}>
        <torusGeometry args={[1.42, 0.004, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.24} toneMapped={false} />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
        <MeshDistortMaterial
          color="#8f7bdc"
          emissive="#2f2260"
          emissiveIntensity={0.35}
          roughness={0.18}
          metalness={0.3}
          transparent
          opacity={0.7}
          distort={0.26}
          speed={1.1}
        />
      </mesh>

      <mesh scale={0.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 0, 0]} intensity={1.6} color="#c4b5fd" distance={4} decay={2} />

      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]} scale={0.5}>
        <torusGeometry args={[1, 0.006, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
      </mesh>

      <CoreFragments focusRef={focusRef} reducedMotion={reducedMotion} />
    </Float>
  )
}

function FaintGrid({ offset }) {
  return (
    <mesh position={[offset, 0, -6]}>
      <planeGeometry args={[14, 10, 14, 10]} />
      <meshBasicMaterial color="#3a3a45" wireframe transparent opacity={0.05} toneMapped={false} />
    </mesh>
  )
}

function CameraRig({ scrollRef, reducedMotion, isMobile }) {
  useFrame((state) => {
    const scroll = scrollRef?.current ?? 0
    if (!reducedMotion && !isMobile) {
      const { pointer } = state
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.2, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.12 - scroll * 0.4, 0.03)
    } else {
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -scroll * 0.25, 0.05)
    }
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.2 + scroll * 0.6, 0.03)
    state.camera.lookAt(state.camera.position.x, 0, 0)
  })
  return null
}

export default function ProjectCoreScene({ focusRef, serviceColorRef, scrollRef, reducedMotion = false, centered = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalFocusRef = useRef('idle')
  const internalServiceRef = useRef(null)
  const internalScrollRef = useRef(0)
  const effectiveFocusRef = focusRef ?? internalFocusRef
  const effectiveServiceRef = serviceColorRef ?? internalServiceRef
  const effectiveScrollRef = scrollRef ?? internalScrollRef
  const groupOffset = centered ? 0 : 1.5

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [groupOffset * 0.4, 0, 7.2], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#08080a', 4.5, 11]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 3, 4]} intensity={0.6} color="#f5f4f2" />
          <MouseLight intensity={highQuality ? 3 : 1.6} color="#a78bfa" />

          <CameraRig scrollRef={effectiveScrollRef} reducedMotion={reducedMotion} isMobile={isMobile} />

          <group position={[groupOffset, 0, 0]}>
            <Core focusRef={effectiveFocusRef} serviceColorRef={effectiveServiceRef} highQuality={highQuality} reducedMotion={reducedMotion} />
            {LABELS.map((item) => (
              <OrbitLabel key={item.key} item={item} focusRef={effectiveFocusRef} reducedMotion={reducedMotion} />
            ))}
          </group>

          <FaintGrid offset={groupOffset} />
          <ParticleField count={highQuality ? 110 : 55} radius={5} sparkles={false} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
