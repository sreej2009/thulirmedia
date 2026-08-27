import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// The "Creative Core" — one continuous 3D system, not swapped objects.
// Three element layers (creativity/technology/strategy) build up around a
// persistent glass core as `progress` advances, then gradually converge
// into it and trigger a brief "growth" pulse. Everything is driven by a
// single 0..1 progress value split into five overlapping activation bands.

function activation(start, end, progress) {
  return THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1)
}

const colorFromScratch = new THREE.Color()
const colorToScratch = new THREE.Color()

const CREATIVITY_ITEMS = Array.from({ length: 7 }).map((_, i) => ({
  angle: (i / 7) * Math.PI * 2 + 0.4,
  radius: 1.7 + (i % 3) * 0.35,
  y: Math.sin(i * 2.1) * 0.6,
  kind: i % 2 === 0 ? 'plane' : 'bar',
  seed: i,
}))

const TECHNOLOGY_ITEMS = Array.from({ length: 6 }).map((_, i) => ({
  angle: (i / 6) * Math.PI * 2,
  radius: 2.1,
  y: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.15),
  seed: i,
}))

const STRATEGY_RINGS = [
  { radius: 2.6, tilt: [Math.PI / 2.3, 0, Math.PI / 6] },
  { radius: 3.0, tilt: [Math.PI / 3.1, Math.PI / 5, 0] },
]

const STRATEGY_PATHS = Array.from({ length: 3 }).map((_, i) => ({
  angle: (i / 3) * Math.PI * 2 + 0.6,
  tilt: (i - 1) * 0.55,
  length: 2.2 + i * 0.2,
}))

function CreativityLayer({ groupRef, progressRef, reducedMotion }) {
  const itemRefs = useRef([])

  useFrame((state) => {
    const progress = progressRef.current ?? 0
    const appear = activation(0, 0.18, progress)
    const merge = activation(0.65, 0.85, progress)
    const t = state.clock.elapsedTime

    CREATIVITY_ITEMS.forEach((item, i) => {
      const mesh = itemRefs.current[i]
      if (!mesh) return
      const wobble = reducedMotion ? 0 : Math.sin(t * 0.35 + item.seed) * 0.18
      const radius = THREE.MathUtils.lerp(item.radius, 0.15, merge)
      const x = Math.cos(item.angle + wobble * 0.3) * radius
      const y = item.y + wobble
      const z = Math.sin(item.angle + wobble * 0.3) * radius
      mesh.position.set(x, y, z)
      if (!reducedMotion) {
        mesh.rotation.z = Math.sin(t * 0.4 + item.seed) * 0.4
        mesh.rotation.y += 0.002
      }
      const targetScale = appear * (1 - merge * 0.5)
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.08))
      if (mesh.material) mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, appear * (1 - merge * 0.35) * 0.8, 0.08)
    })
  })

  return (
    <group ref={groupRef}>
      {CREATIVITY_ITEMS.map((item, i) => (
        <mesh key={i} ref={(el) => (itemRefs.current[i] = el)} scale={0}>
          {item.kind === 'plane' ? <planeGeometry args={[0.34, 0.24]} /> : <boxGeometry args={[0.32, 0.045, 0.045]} />}
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function TechnologyLayer({ groupRef, progressRef, reducedMotion }) {
  const nodeRefs = useRef([])
  const lineRefs = useRef([])
  const positions = useRef(TECHNOLOGY_ITEMS.map(() => new THREE.Vector3()))

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const appear = activation(0.2, 0.42, progress)
    const merge = activation(0.65, 0.85, progress)

    TECHNOLOGY_ITEMS.forEach((item, i) => {
      const node = nodeRefs.current[i]
      if (!node) return
      const radius = THREE.MathUtils.lerp(item.radius, 0.2, merge)
      const angle = item.angle + (reducedMotion ? 0 : state.clock.elapsedTime * 0.08)
      const pos = positions.current[i]
      pos.set(Math.cos(angle) * radius, item.y, Math.sin(angle) * radius)
      node.position.copy(pos)
      if (!reducedMotion) node.rotation.y += delta * 0.6
      const targetScale = appear * (1 - merge * 0.5)
      node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, targetScale, 0.1))
      if (node.material) node.material.opacity = THREE.MathUtils.lerp(node.material.opacity, appear * (1 - merge * 0.4), 0.1)

      const line = lineRefs.current[i]
      if (line?.geometry) line.geometry.setPositions([pos.x, pos.y, pos.z, 0, 0, 0])
      if (line?.material) line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, appear * (1 - merge * 0.3) * 0.32, 0.1)
    })
  })

  return (
    <group ref={groupRef}>
      {TECHNOLOGY_ITEMS.map((_, i) => (
        <mesh key={i} ref={(el) => (nodeRefs.current[i] = el)} scale={0}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
      {TECHNOLOGY_ITEMS.map((_, i) => (
        <Line key={`l${i}`} ref={(el) => (lineRefs.current[i] = el)} points={[[0, 0, 0], [0, 0, 0.001]]} color="#60a5fa" lineWidth={0.5} transparent opacity={0} />
      ))}
    </group>
  )
}

function StrategyLayer({ groupRef, progressRef, reducedMotion }) {
  const ringRefs = useRef([])
  const pathRefs = useRef([])

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const appear = activation(0.45, 0.64, progress)
    const merge = activation(0.65, 0.85, progress)

    STRATEGY_RINGS.forEach((ring, i) => {
      const mesh = ringRefs.current[i]
      if (!mesh) return
      if (!reducedMotion) mesh.rotation.z += delta * (0.03 + i * 0.015)
      const scale = THREE.MathUtils.lerp(1, 0.18, merge)
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x || 0.001, appear * scale, 0.07))
      if (mesh.material) mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, appear * (1 - merge * 0.5) * 0.4, 0.08)
    })

    STRATEGY_PATHS.forEach((path, i) => {
      const line = pathRefs.current[i]
      if (!line?.material) return
      line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, appear * (1 - merge) * 0.28, 0.08)
    })
  })

  return (
    <group ref={groupRef}>
      {STRATEGY_RINGS.map((ring, i) => (
        <mesh key={i} ref={(el) => (ringRefs.current[i] = el)} rotation={ring.tilt} scale={0.001}>
          <torusGeometry args={[ring.radius, 0.005, 8, 96]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
      {STRATEGY_PATHS.map((path, i) => {
        const end = [Math.cos(path.angle) * path.length, 0.15 + path.tilt * path.length, Math.sin(path.angle) * path.length]
        return (
          <Line
            key={i}
            ref={(el) => (pathRefs.current[i] = el)}
            points={[[0, 0.15, 0], end]}
            color="#fb923c"
            lineWidth={0.6}
            transparent
            opacity={0}
          />
        )
      })}
    </group>
  )
}

function CreativeCore({ progressRef, highQuality, reducedMotion }) {
  const shellRef = useRef(null)
  const coreRef = useRef(null)
  const glowRef = useRef(null)
  const pulseRef = useRef(null)
  const distortRef = useRef(0.28)

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const merge = activation(0.65, 0.85, progress)
    const growth = activation(0.85, 1, progress)

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.06
        coreRef.current.rotation.x += delta * 0.02
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.24 + merge * 0.18 + growth * 0.16, 0.04)
      if (coreRef.current.material) {
        coreRef.current.material.distort = distortRef.current
        colorFromScratch.set('#8f7bdc')
        colorToScratch.set('#f5f0ff')
        colorFromScratch.lerp(colorToScratch, growth)
        coreRef.current.material.color.lerp(colorFromScratch, 0.08)
        coreRef.current.material.emissiveIntensity = 0.4 + merge * 0.3 + growth * 0.5
      }
      const scale = 0.92 + merge * 0.16 + growth * 0.1
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, scale, 0.05))
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= delta * 0.04
      shellRef.current.rotation.z += delta * 0.012
    }
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 1.8 + merge * 1.4 + growth * 2.6, 0.05)
    }
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * 0.35) % 1
      const active = growth > 0.05 ? 1 : 0
      pulseRef.current.scale.setScalar(0.5 + t * 1.6 * active)
      if (pulseRef.current.material) pulseRef.current.material.opacity = (1 - t) * 0.3 * growth
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.65} rotationIntensity={reducedMotion ? 0 : 0.1} floatIntensity={reducedMotion ? 0 : 0.22}>
      <mesh ref={shellRef} scale={1.3}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.1} toneMapped={false} />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
        <MeshDistortMaterial
          color="#8f7bdc"
          emissive="#2f2260"
          emissiveIntensity={0.4}
          roughness={0.18}
          metalness={0.3}
          transparent
          opacity={0.72}
          distort={0.28}
          speed={1.1}
        />
      </mesh>

      <mesh scale={0.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 0, 0]} intensity={1.8} color="#c4b5fd" distance={4} decay={2} />

      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]} scale={0.5}>
        <torusGeometry args={[1, 0.006, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
      </mesh>

      <ParticleField count={highQuality ? 90 : 45} radius={1} sparkles={false} />
    </Float>
  )
}

function Labels({ progressRef }) {
  const labelPositions = useMemo(
    () => ({
      creativity: [-1.95, 1.35, 0.4],
      technology: [1.95, -0.6, -0.6],
      strategy: [0, -1.75, 1],
      experience: [1.4, 1.4, -1],
      growth: [0, 1.15, 0],
    }),
    []
  )
  const refs = {
    creativity: useRef(null),
    technology: useRef(null),
    strategy: useRef(null),
    experience: useRef(null),
    growth: useRef(null),
  }

  useFrame(() => {
    const progress = progressRef.current ?? 0
    const merge = activation(0.65, 0.85, progress)
    const growth = activation(0.85, 1, progress)
    const creativityOn = activation(0.02, 0.18, progress) * (1 - merge)
    const technologyOn = activation(0.2, 0.4, progress) * (1 - merge)
    const strategyOn = activation(0.45, 0.62, progress) * (1 - merge)
    const experienceOn = activation(0.66, 0.84, progress) * (1 - growth)
    const growthOn = growth

    if (refs.creativity.current) refs.creativity.current.style.opacity = String(creativityOn * 0.75)
    if (refs.technology.current) refs.technology.current.style.opacity = String(technologyOn * 0.75)
    if (refs.strategy.current) refs.strategy.current.style.opacity = String(strategyOn * 0.75)
    if (refs.experience.current) refs.experience.current.style.opacity = String(experienceOn * 0.8)
    if (refs.growth.current) refs.growth.current.style.opacity = String(growthOn * 0.95)
  })

  const LABEL_META = [
    { key: 'creativity', text: 'Creativity', color: '#c4b5fd' },
    { key: 'technology', text: 'Technology', color: '#60a5fa' },
    { key: 'strategy', text: 'Strategy', color: '#f59e0b' },
    { key: 'experience', text: 'Experience', color: '#e9d5ff' },
    { key: 'growth', text: 'Growth', color: '#ffffff' },
  ]

  return (
    <>
      {LABEL_META.map((l) => (
        <Html key={l.key} position={labelPositions[l.key]} center distanceFactor={9} occlude={false} zIndexRange={[5, 0]}>
          <span
            ref={refs[l.key]}
            className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{ color: l.color, opacity: 0, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
          >
            {l.text}
          </span>
        </Html>
      ))}
    </>
  )
}

function FaintGrid() {
  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[16, 12, 16, 12]} />
      <meshBasicMaterial color="#3a3a45" wireframe transparent opacity={0.05} toneMapped={false} />
    </mesh>
  )
}

function CameraRig({ progressRef, reducedMotion, isMobile }) {
  useFrame((state) => {
    const progress = progressRef?.current ?? 0
    const targetZ = THREE.MathUtils.lerp(7, 5.7, progress)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03)

    if (!reducedMotion && !isMobile) {
      const { pointer } = state
      const orbit = Math.sin(progress * Math.PI * 0.5) * 0.28
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, orbit + pointer.x * 0.14, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.09, 0.03)
    } else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.05)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene({ progressRef, highQuality, reducedMotion, isMobile }) {
  const creativityGroupRef = useRef(null)
  const technologyGroupRef = useRef(null)
  const strategyGroupRef = useRef(null)

  useFrame((state) => {
    if (reducedMotion || isMobile) return
    const { pointer } = state
    if (creativityGroupRef.current) {
      creativityGroupRef.current.rotation.y = THREE.MathUtils.lerp(creativityGroupRef.current.rotation.y, pointer.x * 0.09, 0.04)
    }
    if (technologyGroupRef.current) {
      technologyGroupRef.current.rotation.y = THREE.MathUtils.lerp(technologyGroupRef.current.rotation.y, pointer.x * 0.05, 0.04)
    }
    if (strategyGroupRef.current) {
      strategyGroupRef.current.rotation.y = THREE.MathUtils.lerp(strategyGroupRef.current.rotation.y, pointer.x * 0.02, 0.04)
    }
  })

  return (
    <>
      <CreativeCore progressRef={progressRef} highQuality={highQuality} reducedMotion={reducedMotion} />
      <CreativityLayer groupRef={creativityGroupRef} progressRef={progressRef} reducedMotion={reducedMotion} />
      <TechnologyLayer groupRef={technologyGroupRef} progressRef={progressRef} reducedMotion={reducedMotion} />
      <StrategyLayer groupRef={strategyGroupRef} progressRef={progressRef} reducedMotion={reducedMotion} />
      {highQuality && <Labels progressRef={progressRef} />}
      <FaintGrid />
    </>
  )
}

export default function CreativeCoreScene({ progressRef, reducedMotion = false }) {
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
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 7], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#08080a', 4, 11]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 3, 4]} intensity={0.7} color="#f5f4f2" />
          <MouseLight intensity={highQuality ? 3.5 : 1.8} color="#a78bfa" />

          <CameraRig progressRef={effectiveProgressRef} reducedMotion={reducedMotion} isMobile={isMobile} />
          <Scene progressRef={effectiveProgressRef} highQuality={highQuality} reducedMotion={reducedMotion} isMobile={isMobile} />
          <ParticleField count={highQuality ? 130 : 70} radius={5} sparkles={false} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
