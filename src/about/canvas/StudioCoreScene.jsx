import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { studioForces } from '../data'

// The "Studio Core" — one continuous object, not six swapped ones. A spark
// (Idea) becomes a structured core as five forces — Strategy, Creative,
// Technology, Content, Experience — build up around it and gradually
// fold in, ending as a single bright, coherent "Thulir Media" core.
// Everything is driven by one 0..1 progress value split into six bands.

function activation(band, progress) {
  const start = band / 6
  const end = (band + 1) / 6
  return THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1)
}

const colorFromScratch = new THREE.Color()
const colorToScratch = new THREE.Color()

const FORCE_ITEMS = studioForces.map((f, i) => ({
  ...f,
  angle: (i / studioForces.length) * Math.PI * 2 + 0.3,
  radius: 2.0 + (i % 3) * 0.3,
  y: Math.sin(i * 1.9) * 0.4,
}))

const FRAGMENTS = Array.from({ length: 10 }).map((_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  radius: 0.5 + (i % 3) * 0.14,
  y: Math.sin(i * 2.3) * 0.32,
  kind: i % 3 === 0 ? 'dot' : i % 3 === 1 ? 'bar' : 'plane',
}))

function Spark({ progressRef }) {
  const ref = useRef(null)
  useFrame(() => {
    const progress = progressRef.current ?? 0
    const idea = activation(0, progress)
    const fade = 1 - activation(1, progress) * 0.7
    if (ref.current) {
      const scale = idea * fade * 1.4
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1))
      if (ref.current.material) ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, idea * fade, 0.1)
    }
  })
  return (
    <mesh ref={ref} scale={0}>
      <sphereGeometry args={[0.14, 16, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function ForceNode({ item, progressRef, band, reducedMotion }) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const lineRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state) => {
    const progress = progressRef.current ?? 0
    const appear = activation(band, progress)
    const merge = activation(5, progress)
    const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * 0.05

    const radius = THREE.MathUtils.lerp(item.radius, 0.12, merge)
    const x = Math.cos(t) * radius
    const y = item.y * (1 - merge * 0.6)
    const z = Math.sin(t) * radius

    if (groupRef.current) groupRef.current.position.set(x, y, z)
    if (meshRef.current) {
      const scale = appear * (1 - merge * 0.4)
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.08))
      if (meshRef.current.material) {
        meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, appear * (1 - merge * 0.3) * 0.85, 0.08)
      }
    }
    if (lineRef.current?.geometry) lineRef.current.geometry.setPositions([x, y, z, 0, 0, 0])
    if (lineRef.current?.material) {
      lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, appear * (1 - merge * 0.2) * 0.3, 0.08)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(appear * (1 - merge) * 0.85)
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh ref={meshRef} scale={0}>
          <icosahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color={item.color} transparent opacity={0} toneMapped={false} />
        </mesh>
        <Html center distanceFactor={9} occlude={false} zIndexRange={[5, 0]} position={[0, -0.24, 0]}>
          <span
            ref={labelRef}
            className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{ color: item.color, opacity: 0, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {item.label}
          </span>
        </Html>
      </group>
      <Line ref={lineRef} points={[[0.001, 0, 0], [0, 0, 0]]} color={item.color} lineWidth={0.5} transparent opacity={0} />
    </>
  )
}

function CoreFragments({ progressRef, reducedMotion }) {
  const refs = useRef([])
  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const active = activation(2, progress)
    FRAGMENTS.forEach((item, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const t = reducedMotion ? item.angle : item.angle + state.clock.elapsedTime * (0.1 + (i % 3) * 0.02)
      mesh.position.set(Math.cos(t) * item.radius, item.y, Math.sin(t) * item.radius)
      if (!reducedMotion) mesh.rotation.y += delta * 0.18
      if (mesh.material) mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, active * 0.4, 0.06)
    })
  })
  return (
    <>
      {FRAGMENTS.map((item, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          {item.kind === 'dot' && <sphereGeometry args={[0.026, 8, 8]} />}
          {item.kind === 'bar' && <boxGeometry args={[0.14, 0.016, 0.016]} />}
          {item.kind === 'plane' && <planeGeometry args={[0.11, 0.075]} />}
          <meshBasicMaterial color="#e9d5ff" transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

function Core({ progressRef, highQuality, reducedMotion }) {
  const shellRef = useRef(null)
  const coreRef = useRef(null)
  const glowRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const pulseRef = useRef(null)
  const distortRef = useRef(0.22)

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const born = activation(1, progress)
    const merge = activation(4, progress)
    const final = activation(5, progress)

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.06
        coreRef.current.rotation.x += delta * 0.018
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.2 + merge * 0.16 + final * 0.14, 0.04)
      if (coreRef.current.material) {
        coreRef.current.material.distort = distortRef.current
        colorFromScratch.set('#8f7bdc')
        colorToScratch.set('#f5f0ff')
        colorFromScratch.lerp(colorToScratch, final)
        coreRef.current.material.color.lerp(colorFromScratch, 0.06)
        coreRef.current.material.emissiveIntensity = 0.3 + merge * 0.25 + final * 0.5
      }
      const scale = born * (0.7 + merge * 0.25 + final * 0.15)
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.05))
      if (coreRef.current.material) coreRef.current.material.opacity = THREE.MathUtils.lerp(coreRef.current.material.opacity ?? 0, born * 0.75, 0.06)
    }
    if (shellRef.current) {
      if (!reducedMotion) {
        shellRef.current.rotation.y -= delta * 0.04
        shellRef.current.rotation.z += delta * 0.012
      }
      if (shellRef.current.material) shellRef.current.material.opacity = THREE.MathUtils.lerp(shellRef.current.material.opacity, born * 0.11, 0.05)
    }
    if (ring1Ref.current) {
      if (!reducedMotion) ring1Ref.current.rotation.z += delta * 0.05
      if (ring1Ref.current.material) ring1Ref.current.material.opacity = THREE.MathUtils.lerp(ring1Ref.current.material.opacity, activation(2, progress) * 0.3, 0.05)
    }
    if (ring2Ref.current) {
      if (!reducedMotion) ring2Ref.current.rotation.z -= delta * 0.035
      if (ring2Ref.current.material) ring2Ref.current.material.opacity = THREE.MathUtils.lerp(ring2Ref.current.material.opacity, activation(3, progress) * 0.24, 0.05)
    }
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 0.8 + born * 1.4 + merge * 1.4 + final * 2.4, 0.05)
    }
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * 0.32) % 1
      pulseRef.current.scale.setScalar(0.5 + t * 1.7 * final)
      if (pulseRef.current.material) pulseRef.current.material.opacity = (1 - t) * 0.3 * final
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.6} rotationIntensity={reducedMotion ? 0 : 0.1} floatIntensity={reducedMotion ? 0 : 0.2}>
      <mesh ref={shellRef} scale={1.32}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0} toneMapped={false} />
      </mesh>

      <mesh ref={ring1Ref} rotation={[Math.PI / 2.4, 0, Math.PI / 6]}>
        <torusGeometry args={[1.45, 0.004, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.3, Math.PI / 5, 0]}>
        <torusGeometry args={[1.7, 0.003, 8, 96]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0} toneMapped={false} />
      </mesh>

      <mesh ref={coreRef} scale={0}>
        <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
        <MeshDistortMaterial
          color="#8f7bdc"
          emissive="#2f2260"
          emissiveIntensity={0.3}
          roughness={0.18}
          metalness={0.3}
          transparent
          opacity={0}
          distort={0.22}
          speed={1.1}
        />
      </mesh>

      <pointLight ref={glowRef} position={[0, 0, 0]} intensity={0.8} color="#c4b5fd" distance={4.2} decay={2} />

      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]} scale={0.5}>
        <torusGeometry args={[1, 0.006, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
      </mesh>

      <Spark progressRef={progressRef} />
      <CoreFragments progressRef={progressRef} reducedMotion={reducedMotion} />
    </Float>
  )
}

function FaintGrid({ offset = 0 }) {
  return (
    <mesh position={[offset, 0, -7]}>
      <planeGeometry args={[16, 11, 16, 11]} />
      <meshBasicMaterial color="#3a3a45" wireframe transparent opacity={0.045} toneMapped={false} />
    </mesh>
  )
}

function CameraRig({ progressRef, reducedMotion, isMobile }) {
  useFrame((state) => {
    const progress = progressRef?.current ?? 0
    const targetZ = THREE.MathUtils.lerp(7.6, 6.1, progress)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03)
    if (!reducedMotion && !isMobile) {
      const { pointer } = state
      const orbit = Math.sin(progress * Math.PI * 0.5) * 0.25
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, orbit + pointer.x * 0.16, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.1, 0.03)
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.05)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function ForcesGroup({ progressRef, reducedMotion, isMobile }) {
  const groupRef = useRef(null)
  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.07, 0.04)
    }
  })
  return (
    <group ref={groupRef}>
      {FORCE_ITEMS.map((item, i) => (
        <ForceNode key={item.key} item={item} progressRef={progressRef} band={i + 1} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

export default function StudioCoreScene({ progressRef, reducedMotion = false, centered = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.65]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalProgressRef = useRef(0)
  const effectiveProgressRef = progressRef ?? internalProgressRef
  const offset = centered || isMobile ? 0 : 2.1

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#08080a', 4.5, 12]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 3, 4]} intensity={0.7} color="#f5f4f2" />
          <MouseLight intensity={highQuality ? 4 : 2} color="#a78bfa" />

          <CameraRig progressRef={effectiveProgressRef} reducedMotion={reducedMotion} isMobile={isMobile} />
          <group position={[offset, 0, 0]}>
            <Core progressRef={effectiveProgressRef} highQuality={highQuality} reducedMotion={reducedMotion} />
            <ForcesGroup progressRef={effectiveProgressRef} reducedMotion={reducedMotion} isMobile={isMobile} />
          </group>
          <FaintGrid offset={offset} />
          <ParticleField count={highQuality ? 160 : 80} radius={5.5} sparkles={false} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
