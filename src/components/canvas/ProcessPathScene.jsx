import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Line } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import MouseLight from './MouseLight'
import PostFX from './PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// A single spatial path (not a flat rail) a process travels through — one
// glowing particle runs the curve on loop, and each waypoint brightens as
// the matching stage becomes active (driven by scroll). Generic: reused
// wherever a page needs to show a staged process as a connected 3D path.

function buildCurve(count) {
  const points = Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1)
    return new THREE.Vector3(
      THREE.MathUtils.lerp(-3.4, 3.4, t),
      Math.sin(t * Math.PI * 1.4) * 0.9,
      Math.cos(t * Math.PI * 1.1) * 1.3 - 0.5
    )
  })
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35)
}

function Waypoint({ index, position, activeIndexRef, color }) {
  const ref = useRef(null)
  const glowRef = useRef(null)

  useFrame(() => {
    const active = activeIndexRef.current === index
    if (ref.current) {
      const scale = active ? 1.7 : 1
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, scale, 0.1))
      if (ref.current.material) ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, active ? 1 : 0.45, 0.08)
    }
    if (glowRef.current) glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, active ? 2.2 : 0.3, 0.08)
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.09, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <pointLight ref={glowRef} intensity={0.3} color={color} distance={2.4} decay={2} />
    </group>
  )
}

function TravelingSpark({ curve, reducedMotion }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    const t = (state.clock.elapsedTime * 0.08) % 1
    const p = curve.getPointAt(t)
    ref.current.position.copy(p)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </mesh>
  )
}

function PathLine({ curve, color }) {
  const points = useMemo(() => curve.getPoints(120).map((p) => [p.x, p.y, p.z]), [curve])
  return <Line points={points} color={color} lineWidth={1} transparent opacity={0.35} />
}

function Scene({ steps, activeIndexRef, accent, highQuality, reducedMotion }) {
  const curve = useMemo(() => buildCurve(steps.length), [steps.length])
  const waypoints = useMemo(() => curve.getSpacedPoints(steps.length - 1), [curve, steps.length])

  useFrame((state) => {
    if (reducedMotion) return
    const { pointer } = state
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.3, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2 + pointer.y * 0.2, 0.03)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 4]} intensity={0.6} color="#f5f4f2" />
      <MouseLight intensity={highQuality ? 3.5 : 1.8} color={accent} />

      <PathLine curve={curve} color={accent} />
      <TravelingSpark curve={curve} reducedMotion={reducedMotion} />
      {waypoints.map((p, i) => (
        <Waypoint key={i} index={i} position={[p.x, p.y, p.z]} activeIndexRef={activeIndexRef} color={accent} />
      ))}
    </>
  )
}

export default function ProcessPathScene({ steps, activeIndexRef, accent = '#a78bfa', reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()
  const internalActiveRef = useRef(0)
  const effectiveActiveRef = activeIndexRef ?? internalActiveRef

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0.2, 6.4], fov: 44 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#08080a', 4, 11]} />
          <Scene steps={steps} activeIndexRef={effectiveActiveRef} accent={accent} highQuality={highQuality} reducedMotion={reducedMotion} />
          <ParticleField count={highQuality ? 120 : 60} radius={5} sparkles={false} />
          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
