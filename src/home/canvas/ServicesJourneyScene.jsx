import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// One continuous world, not six swapped ones. A single persistent core +
// a fixed set of satellite nodes have every property — scale, color,
// distortion, orbit radius, node labels — driven by a single 0..1 scroll
// progress value. Nothing unmounts or gets replaced between chapters;
// everything just keeps lerping toward the next chapter's target state.

const CHAPTER_SHAPES = [
  { scale: [1, 1, 1], distort: 0.4, radius: 2.1, spread: 0.4 }, // Digital Marketing — growth core
  { scale: [1.7, 0.95, 0.4], distort: 0.18, radius: 2.4, spread: 0.15 }, // Website — flattened architecture
  { scale: [0.62, 1.55, 0.5], distort: 0.16, radius: 1.9, spread: 0.5 }, // App — tall device-like
  { scale: [1.9, 0.32, 0.55], distort: 0.12, radius: 2.6, spread: 0.08 }, // SEO — wide search-bar-like
  { scale: [1.1, 1.1, 1.1], distort: 0.34, radius: 1.9, spread: 0.65 }, // Social — busy content cluster
  { scale: [1.35, 1.35, 0.28], distort: 0.08, radius: 2.3, spread: 0.2 }, // Branding — flat, designed block
]

const NODE_COUNT = 7

function lerpArr3(a, b, t) {
  return [THREE.MathUtils.lerp(a[0], b[0], t), THREE.MathUtils.lerp(a[1], b[1], t), THREE.MathUtils.lerp(a[2], b[2], t)]
}

function getChapterState(progress) {
  const scaled = THREE.MathUtils.clamp(progress, 0, 0.9999) * CHAPTER_SHAPES.length
  const index = Math.floor(scaled)
  const local = scaled - index
  const a = CHAPTER_SHAPES[index]
  const b = CHAPTER_SHAPES[Math.min(index + 1, CHAPTER_SHAPES.length - 1)]
  return {
    index,
    local,
    scale: lerpArr3(a.scale, b.scale, local),
    distort: THREE.MathUtils.lerp(a.distort, b.distort, local),
    radius: THREE.MathUtils.lerp(a.radius, b.radius, local),
    spread: THREE.MathUtils.lerp(a.spread, b.spread, local),
  }
}

const colorFromScratch = new THREE.Color()
const colorToScratch = new THREE.Color()
const worldPosScratch = new THREE.Vector3()

function SatelliteNode({ index, chapters, progressRef, reducedMotion }) {
  const groupRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const progress = progressRef.current ?? 0
    const { index: chapterIndex, local, radius, spread } = getChapterState(progress)
    const chapter = chapters[Math.min(chapterIndex, chapters.length - 1)]
    const nextChapter = chapters[Math.min(chapterIndex + 1, chapters.length - 1)]

    const baseAngle = (index / NODE_COUNT) * Math.PI * 2
    const t = reducedMotion ? baseAngle : baseAngle + state.clock.elapsedTime * (0.06 + (index % 3) * 0.015)
    const yWobble = Math.sin(t * 0.6 + index) * spread

    groupRef.current.position.set(Math.cos(t) * radius, yWobble, Math.sin(t) * radius * 0.7)

    if (dotRef.current?.material) {
      colorFromScratch.set(chapter.accent)
      colorToScratch.set(nextChapter.accent)
      colorFromScratch.lerp(colorToScratch, local)
      dotRef.current.material.color.lerp(colorFromScratch, 0.15)
    }

    if (labelRef.current) {
      const label = local > 0.72 ? nextChapter.nodes[index % nextChapter.nodes.length] : chapter.nodes[index % chapter.nodes.length]
      if (labelRef.current.textContent !== label) labelRef.current.textContent = label

      groupRef.current.getWorldPosition(worldPosScratch)
      worldPosScratch.project(state.camera)
      const centerFade = THREE.MathUtils.smoothstep(Math.abs(worldPosScratch.x), 0.08, 0.5)
      const boundaryFade = local > 0.85 ? THREE.MathUtils.smoothstep(local, 0.85, 1) : local < 0.15 ? 1 - THREE.MathUtils.smoothstep(local, 0, 0.15) : 1
      labelRef.current.style.opacity = String(0.65 * centerFade * (1 - boundaryFade * 0.7))
      labelRef.current.style.color = `#${dotRef.current.material.color.getHexString()}`
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[5, 0]} position={[0, -0.22, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em]"
          style={{ textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
        />
      </Html>
    </group>
  )
}

function Core({ chapters, progressRef, highQuality, reducedMotion }) {
  const groupRef = useRef(null)
  const coreRef = useRef(null)
  const shellRef = useRef(null)
  const distortRef = useRef(0.4)

  useFrame((state, delta) => {
    const progress = progressRef.current ?? 0
    const { index, local, scale, distort } = getChapterState(progress)
    const chapter = chapters[Math.min(index, chapters.length - 1)]
    const nextChapter = chapters[Math.min(index + 1, chapters.length - 1)]

    const { pointer } = state
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.18, 0.03)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.1, 0.03)
    }

    if (coreRef.current) {
      if (!reducedMotion) coreRef.current.rotation.y += delta * 0.09
      coreRef.current.scale.set(
        THREE.MathUtils.lerp(coreRef.current.scale.x, scale[0], 0.06),
        THREE.MathUtils.lerp(coreRef.current.scale.y, scale[1], 0.06),
        THREE.MathUtils.lerp(coreRef.current.scale.z, scale[2], 0.06)
      )
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, distort, 0.05)
      if (coreRef.current.material) {
        coreRef.current.material.distort = distortRef.current
        colorFromScratch.set(chapter.accent)
        colorToScratch.set(nextChapter.accent)
        colorFromScratch.lerp(colorToScratch, local)
        coreRef.current.material.color.lerp(colorFromScratch, 0.1)
        coreRef.current.material.emissive.lerp(colorFromScratch, 0.1)
      }
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= delta * 0.05
      shellRef.current.rotation.z += delta * 0.015
      shellRef.current.scale.copy(coreRef.current.scale).multiplyScalar(1.4)
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 0.8} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.3}>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.08} toneMapped={false} />
        </mesh>

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
          <MeshDistortMaterial
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.35}
            transparent
            opacity={0.78}
            distort={0.4}
            speed={1.3}
          />
        </mesh>

        <mesh scale={0.2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={3.5} color="#ffffff" distance={4} decay={2} />

        {Array.from({ length: NODE_COUNT }).map((_, i) => (
          <SatelliteNode key={i} index={i} chapters={chapters} progressRef={progressRef} reducedMotion={reducedMotion} />
        ))}
      </Float>
    </group>
  )
}

function CameraRig({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const progress = progressRef?.current ?? 0
    const targetZ = THREE.MathUtils.lerp(7.6, 6.6, progress)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.04)
    if (!reducedMotion) {
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.sin(progress * Math.PI) * 0.25, 0.04)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function ServicesJourneyScene({ chapters, progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.7]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        // No mesh in this scene is clickable/hoverable — freeing pointer
        // events here (and on the wrapper div above) lets the nav + text
        // overlay, rendered as normal DOM on top of the canvas, receive
        // clicks, which a WebGL canvas will otherwise intercept even when
        // it's visually behind other content.
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 7.6], fov: 44 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 5, 15]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 4, 4]} intensity={1} color="#f5f4f2" />
          <MouseLight intensity={highQuality ? 5 : 2.5} color="#a78bfa" />

          <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
          <Core chapters={chapters} progressRef={progressRef} highQuality={highQuality} reducedMotion={reducedMotion} />
          <ParticleField count={highQuality ? 340 : 160} radius={6.5} sparkles={highQuality && !reducedMotion} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
