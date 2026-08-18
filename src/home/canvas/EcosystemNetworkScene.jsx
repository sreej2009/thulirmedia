import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// "The Digital Growth Ecosystem" — a real spatial 3D scene, not a diagram.
// One persistent Growth Core, seven services scattered at different
// depths (not a flat arc), and a four-step growth journey progressing
// through space. Everything is driven by a single 0..1 scroll progress
// split into six phases; nothing is swapped or remounted between them.

const SERVICES = [
  { label: 'SEO', blurb: 'Compounding visibility', color: '#f59e0b', position: [-3.2, 1.3, -2.0] },
  { label: 'Ads', blurb: 'Paid growth, engineered', color: '#a3e635', position: [-2.5, -1.6, -3.6] },
  { label: 'Social', blurb: 'Content that connects', color: '#fb7185', position: [-3.7, -0.3, 0.5] },
  { label: 'Content', blurb: 'Words that convert', color: '#c4b5fd', position: [-1.9, 1.9, 1.3] },
  { label: 'Website', blurb: 'Fast, accessible builds', color: '#60a5fa', position: [3.0, 1.5, -1.9] },
  { label: 'App', blurb: 'Native-feeling products', color: '#818cf8', position: [3.6, -1.3, -3.1] },
  { label: 'Branding', blurb: 'Identity that sticks', color: '#f97316', position: [2.6, -1.8, 0.9] },
]

const JOURNEY = [
  { label: 'Audience', position: [-2.1, 0.3, -4.6], color: '#9ca8ff', startPhase: 2 },
  { label: 'Experience', position: [-0.7, -0.15, -2.1], color: '#b4a5fb', startPhase: 3 },
  { label: 'Conversion', position: [0.9, 0.2, 0.4], color: '#dcc9ff', startPhase: 4 },
  { label: 'Growth', position: [0, 0.35, 3.1], color: '#ffffff', startPhase: 5 },
]

function activation(startPhase, progress) {
  return THREE.MathUtils.clamp(progress * 6 - startPhase, 0, 1)
}

function DataPacket({ curve, color, speed, offset, active }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    const p = curve.getPointAt(t)
    ref.current.position.copy(p)
    if (ref.current.material) {
      const fade = Math.sin(t * Math.PI)
      ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, active ? fade * 0.9 : 0, 0.1)
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function ServiceNode({ item, index, hoveredIndex, onHover, progressRef, reducedMotion }) {
  const nodeRef = useRef(null)
  const labelRef = useRef(null)

  const isHovered = hoveredIndex === index
  const isDimmed = hoveredIndex !== null && !isHovered

  useFrame((_state, delta) => {
    const progress = progressRef.current ?? 0
    const appear = activation(0, progress)

    if (nodeRef.current) {
      if (!reducedMotion) nodeRef.current.rotation.y += delta * 0.3
      const targetScale = appear * (isHovered ? 1.7 : isDimmed ? 0.85 : 1)
      nodeRef.current.scale.setScalar(THREE.MathUtils.lerp(nodeRef.current.scale.x, targetScale, 0.12))
    }
    if (labelRef.current) {
      const targetOpacity = appear * (isHovered ? 1 : isDimmed ? 0.2 : 0.6)
      labelRef.current.style.opacity = String(THREE.MathUtils.lerp(parseFloat(labelRef.current.style.opacity || '0'), targetOpacity, 0.15))
    }
  })

  return (
    <group position={item.position}>
      <mesh
        ref={nodeRef}
        scale={0}
        onPointerOver={() => onHover(index)}
        onPointerOut={() => onHover(null)}
      >
        <icosahedronGeometry args={[0.13, 1]} />
        <meshBasicMaterial color={item.color} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[5, 0]} position={[0, -0.28, 0]}>
        <div ref={labelRef} className="pointer-events-none flex flex-col items-center gap-0.5" style={{ opacity: 0 }}>
          <span
            className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em]"
            style={{ color: item.color, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {item.label}
          </span>
          {isHovered && (
            <span className="whitespace-nowrap text-[9px] text-mist" style={{ textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}>
              {item.blurb}
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}

function ServiceConnection({ item, index, hoveredIndex, progressRef }) {
  const lineRef = useRef(null)
  const start = useMemo(() => new THREE.Vector3(...item.position), [item.position])
  const mid = useMemo(
    () => new THREE.Vector3(item.position[0] * 0.5, item.position[1] * 0.5 + 0.4, item.position[2] * 0.5),
    [item.position]
  )
  const core = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, core), [start, mid, core])
  const isHovered = hoveredIndex === index
  const isDimmed = hoveredIndex !== null && !isHovered

  useFrame(() => {
    if (!lineRef.current?.material) return
    const progress = progressRef.current ?? 0
    const flowOn = activation(1, progress)
    const finalFade = 1 - activation(5, progress) * 0.6
    const target = flowOn * (isHovered ? 0.6 : isDimmed ? 0.05 : 0.18) * finalFade
    lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, target, 0.08)
  })

  return (
    <>
      <QuadraticBezierLine
        ref={lineRef}
        start={item.position}
        end={[0, 0, 0]}
        mid={mid.toArray()}
        color={item.color}
        lineWidth={isHovered ? 1.1 : 0.5}
        transparent
        opacity={0}
      />
      <DataPacket curve={curve} color={item.color} speed={0.22 + (index % 3) * 0.05} offset={index / SERVICES.length} active={hoveredIndex === null || isHovered} />
    </>
  )
}

function JourneyNode({ item, progressRef, reducedMotion }) {
  const nodeRef = useRef(null)
  const glowRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const isGrowth = item.label === 'Growth'

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const active = activation(item.startPhase, progress)
    const finalPush = isGrowth ? activation(5, progress) : 0

    if (nodeRef.current) {
      if (!reducedMotion) nodeRef.current.rotation.y += delta * (isGrowth ? 0.25 : 0.12)
      const baseScale = 0.55 + (isGrowth ? 0.35 : 0.15)
      const targetScale = baseScale * (0.3 + active * 0.7) * (1 + finalPush * 0.5)
      nodeRef.current.scale.setScalar(THREE.MathUtils.lerp(nodeRef.current.scale.x, targetScale, 0.06))
      if (nodeRef.current.material) {
        nodeRef.current.material.opacity = THREE.MathUtils.lerp(nodeRef.current.material.opacity, 0.25 + active * 0.65, 0.08)
        nodeRef.current.material.emissiveIntensity = 0.3 + active * 0.5 + finalPush * 0.6
      }
      if (isGrowth) {
        nodeRef.current.position.z = THREE.MathUtils.lerp(nodeRef.current.position.z, item.position[2] + finalPush * 0.7, 0.04)
      }
    }
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, (0.5 + active * 2 + finalPush * 3) * (isGrowth ? 1.4 : 0.6), 0.05)
    }
    if (isGrowth && ringRef.current) {
      const t = (state.clock.elapsedTime * 0.3) % 1
      ringRef.current.scale.setScalar(0.6 + t * 0.9 * (0.3 + active * 0.7))
      if (ringRef.current.material) ringRef.current.material.opacity = (1 - t) * 0.22 * active
    }
    if (labelRef.current) {
      labelRef.current.style.opacity = String(THREE.MathUtils.clamp(0.35 + active * 0.65, 0, 1))
    }
  })

  return (
    <group position={item.position}>
      <mesh ref={nodeRef} scale={0}>
        <icosahedronGeometry args={[0.3, isGrowth ? 3 : 1]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
      {isGrowth && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.008, 8, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
        </mesh>
      )}
      <pointLight ref={glowRef} intensity={0.5} color={item.color} distance={3.5} decay={2} />
      <Html center distanceFactor={8} occlude={false} zIndexRange={[6, 0]} position={[0, 0.6, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.22em] text-ink"
          style={{ textShadow: '0 1px 8px rgba(10,10,12,0.95)' }}
        >
          {item.label}
        </div>
      </Html>
    </group>
  )
}

function GrowthCore({ progressRef, highQuality, reducedMotion }) {
  const shellRef = useRef(null)
  const coreRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const distortRef = useRef(0.32)

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const finalPush = activation(5, progress)

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.08
        coreRef.current.rotation.x += delta * 0.025
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.3 + finalPush * 0.25, 0.04)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
      const scale = 1 + finalPush * 0.2
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.05))
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= delta * 0.05
      shellRef.current.rotation.z += delta * 0.015
    }
    if (ring1Ref.current && !reducedMotion) {
      ring1Ref.current.rotation.z += delta * 0.06
      ring1Ref.current.rotation.x += delta * 0.02
    }
    if (ring2Ref.current && !reducedMotion) {
      ring2Ref.current.rotation.z -= delta * 0.04
      ring2Ref.current.rotation.y += delta * 0.03
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={reducedMotion ? 0 : 0.1} floatIntensity={reducedMotion ? 0 : 0.25}>
      <mesh ref={shellRef} scale={1.35}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.09} toneMapped={false} />
      </mesh>

      <mesh ref={ring1Ref} rotation={[Math.PI / 2.4, 0, Math.PI / 5]}>
        <torusGeometry args={[1.55, 0.005, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.2, Math.PI / 6, 0]}>
        <torusGeometry args={[1.85, 0.004, 8, 96]} />
        <meshBasicMaterial color="#7c5cd6" transparent opacity={0.18} toneMapped={false} />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
        <MeshDistortMaterial
          color="#8f7bdc"
          emissive="#2f2260"
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.35}
          transparent
          opacity={0.75}
          distort={0.32}
          speed={1.2}
        />
      </mesh>

      <mesh scale={0.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3.2} color="#c4b5fd" distance={4.5} decay={2} />

      <ParticleField count={highQuality ? 140 : 60} radius={1.1} sparkles={false} />
    </Float>
  )
}

function Fragments({ count = 7 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, -6 - Math.random() * 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.15 + Math.random() * 0.2,
        speed: 0.02 + Math.random() * 0.03,
      })),
    [count]
  )
  const refs = useRef([])

  useFrame((_state, delta) => {
    items.forEach((item, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.rotation.x += delta * item.speed
      mesh.rotation.y += delta * item.speed * 0.7
    })
  })

  return (
    <>
      {items.map((item, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={item.position} rotation={item.rotation} scale={item.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#4a4a55" wireframe transparent opacity={0.2} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

function FaintGrid() {
  return (
    <mesh position={[0, 0, -9]} rotation={[0, 0, 0]}>
      <planeGeometry args={[26, 16, 26, 16]} />
      <meshBasicMaterial color="#3a3a45" wireframe transparent opacity={0.06} toneMapped={false} />
    </mesh>
  )
}

function CameraRig({ progressRef, reducedMotion }) {
  const isMobile = useIsMobile()
  useFrame((state) => {
    const progress = progressRef?.current ?? 0
    const { pointer } = state
    const targetZ = THREE.MathUtils.lerp(8.6, 6.4, progress)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.035)

    if (!reducedMotion && !isMobile) {
      const orbitX = Math.sin(progress * Math.PI * 0.6) * 0.35
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, orbitX + pointer.x * 0.15, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2 + pointer.y * 0.08, 0.03)
    } else if (!reducedMotion && isMobile) {
      const orbitX = Math.sin(progress * Math.PI * 0.4) * 0.15
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, orbitX, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.15, 0.03)
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Ecosystem({ progressRef, highQuality, reducedMotion }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const serviceGroupRef = useRef(null)
  const journeyGroupRef = useRef(null)
  const isMobile = useIsMobile()

  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (serviceGroupRef.current) {
      serviceGroupRef.current.rotation.y = THREE.MathUtils.lerp(serviceGroupRef.current.rotation.y, pointer.x * 0.05, 0.04)
      serviceGroupRef.current.rotation.x = THREE.MathUtils.lerp(serviceGroupRef.current.rotation.x, pointer.y * 0.03, 0.04)
    }
    if (journeyGroupRef.current) {
      journeyGroupRef.current.rotation.y = THREE.MathUtils.lerp(journeyGroupRef.current.rotation.y, pointer.x * 0.09, 0.04)
      journeyGroupRef.current.position.y = THREE.MathUtils.lerp(journeyGroupRef.current.position.y, pointer.y * 0.15, 0.04)
    }
  })

  return (
    <>
      <GrowthCore progressRef={progressRef} highQuality={highQuality} reducedMotion={reducedMotion} />

      <group ref={serviceGroupRef}>
        {SERVICES.map((item, i) => (
          <ServiceConnection key={item.label} item={item} index={i} hoveredIndex={hoveredIndex} progressRef={progressRef} />
        ))}
        {SERVICES.map((item, i) => (
          <ServiceNode
            key={item.label}
            item={item}
            index={i}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
            progressRef={progressRef}
            reducedMotion={reducedMotion}
          />
        ))}
      </group>

      <group ref={journeyGroupRef}>
        {JOURNEY.map((item) => (
          <JourneyNode key={item.label} item={item} progressRef={progressRef} reducedMotion={reducedMotion} />
        ))}
      </group>

      {highQuality && <Fragments count={7} />}
      <FaintGrid />
    </>
  )
}

export default function EcosystemNetworkScene({ progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalProgressRef = useRef(0)
  const effectiveProgressRef = progressRef ?? internalProgressRef

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 8.6], fov: 44 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 5, 15]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 4, 4]} intensity={0.8} color="#f5f4f2" />
          <MouseLight intensity={highQuality ? 4 : 2} color="#a78bfa" />

          <CameraRig progressRef={effectiveProgressRef} reducedMotion={reducedMotion} />
          <Ecosystem progressRef={effectiveProgressRef} highQuality={highQuality} reducedMotion={reducedMotion} />
          <ParticleField count={highQuality ? 200 : 100} radius={7} sparkles={highQuality && !reducedMotion} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
