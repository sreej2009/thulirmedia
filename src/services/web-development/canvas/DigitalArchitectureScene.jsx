import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'
import BrowserObject from './BrowserObject'

// The hero's "Digital Architecture Core" — the browser object floating in
// a blueprint-style environment (faint grid + architectural guide lines +
// code particles), with the browser itself progressing through six
// construction phases as the section is scrolled.

function CodeParticle({ offset, speed, color, reducedMotion }) {
  const ref = useRef(null)
  const start = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -2 - Math.random() * 3), [])

  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(start, new THREE.Vector3(0, 0, 0.5), t)
    if (ref.current.material) ref.current.material.opacity = Math.sin(t * Math.PI) * 0.75
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.03, 0.03, 0.03]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function BlueprintGrid({ reducedMotion }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    const { pointer } = state
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointer.x * 0.15, 0.03)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pointer.y * 0.1, 0.03)
  })
  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <planeGeometry args={[18, 12, 24, 16]} />
      <meshBasicMaterial color="#2a3a55" wireframe transparent opacity={0.09} toneMapped={false} />
    </mesh>
  )
}

function GuideLines() {
  const points1 = useMemo(() => [[-6, -3, -3], [6, -3, -3]], [])
  const points2 = useMemo(() => [[-6, 3, -4], [6, 3, -4]], [])
  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(points1.flat()), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3b5f8a" transparent opacity={0.14} toneMapped={false} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(points2.flat()), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3b5f8a" transparent opacity={0.1} toneMapped={false} />
      </line>
    </>
  )
}

function CameraRig({ progressRef, reducedMotion, isMobile }) {
  useFrame((state) => {
    const progress = progressRef?.current ?? 0
    const targetZ = THREE.MathUtils.lerp(6.6, 5.4, progress)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03)
    if (!reducedMotion && !isMobile) {
      const { pointer } = state
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.12, 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.07, 0.03)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene({ progressRef, highQuality, reducedMotion, isMobile, offset }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#93c5fd" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#8b5cf6" />
      <MouseLight intensity={highQuality ? 4.5 : 2.2} color="#60a5fa" />

      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} isMobile={isMobile} />

      <group position={[offset, 0, 0]}>
        <Float speed={reducedMotion ? 0 : 0.9} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.4}>
          <BrowserObject progress={progressRef} mouseReactive={!reducedMotion} reducedMotion={reducedMotion} />
        </Float>
      </group>

      <BlueprintGrid reducedMotion={reducedMotion} />
      <GuideLines />

      {!reducedMotion &&
        Array.from({ length: highQuality ? 22 : 10 }).map((_, i) => (
          <CodeParticle key={i} offset={i / 22} speed={0.15 + (i % 4) * 0.03} color={['#60a5fa', '#34d399', '#8b5cf6'][i % 3]} reducedMotion={reducedMotion} />
        ))}

      <ParticleField count={highQuality ? 260 : 130} radius={5.5} sparkles={false} />
    </>
  )
}

export default function DigitalArchitectureScene({ progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.7]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalProgressRef = useRef(0)
  const effectiveProgressRef = progressRef ?? internalProgressRef
  const offset = isMobile ? 0 : 1.7

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6.6], fov: 40 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#08080a', 4, 13]} />
          <Scene progressRef={effectiveProgressRef} highQuality={highQuality} reducedMotion={reducedMotion} isMobile={isMobile} offset={offset} />
          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
