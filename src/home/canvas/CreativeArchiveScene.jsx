import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'

// The "Creative Archive Core" — a small, self-contained accent object for
// the Work section header. A layered glass cube (wireframe shell + a
// translucent inner panel, not a solid glowing blob) with a forward arrow
// held inside it, thin orbital rings, and a few flat "fragment" planes
// drifting nearby to suggest an archive of stored work — not a generic cube.

function ForwardArrow({ color }) {
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <mesh position={[-0.05, 0, 0]}>
        <boxGeometry args={[0.26, 0.035, 0.035]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0.13, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.14, 3]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Fragments({ count = 5, reducedMotion }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const radius = 1.1 + (i % 2) * 0.35
        return {
          position: [Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.5, Math.sin(angle) * radius],
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
          scale: 0.16 + (i % 3) * 0.05,
        }
      }),
    [count]
  )

  return (
    <>
      {items.map((item, i) => (
        <Float key={i} speed={reducedMotion ? 0 : 0.6 + (i % 3) * 0.15} floatIntensity={reducedMotion ? 0 : 0.6} rotationIntensity={reducedMotion ? 0 : 0.3}>
          <mesh position={item.position} rotation={item.rotation} scale={item.scale}>
            <planeGeometry args={[1, 0.62]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.14} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function ArchiveCore({ progressRef, reducedMotion, highQuality }) {
  const groupRef = useRef(null)
  const shellRef = useRef(null)
  const panelRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)

  useFrame((state, delta) => {
    const { pointer } = state
    const progress = progressRef?.current ?? 0

    if (groupRef.current) {
      const baseY = progress * 0.5
      if (!reducedMotion) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseY + pointer.x * 0.25, 0.04)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.15, 0.04)
      }
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y += delta * 0.06
      shellRef.current.rotation.x += delta * 0.015
    }
    if (panelRef.current && !reducedMotion) {
      panelRef.current.rotation.y -= delta * 0.04
    }
    if (ring1Ref.current && !reducedMotion) {
      ring1Ref.current.rotation.z += delta * 0.1
    }
    if (ring2Ref.current && !reducedMotion) {
      ring2Ref.current.rotation.z -= delta * 0.07
      ring2Ref.current.rotation.x += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={shellRef}>
        <boxGeometry args={[1.3, 1.3, 1.3]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.3} toneMapped={false} />
      </mesh>

      <mesh ref={panelRef} scale={0.86}>
        <boxGeometry args={[1.3, 1.3, 1.3]} />
        <meshPhysicalMaterial
          color="#8f7bdc"
          transparent
          opacity={0.14}
          roughness={0.15}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <ForwardArrow color="#e9d5ff" />

      <mesh ref={ring1Ref} rotation={[Math.PI / 2.6, 0, Math.PI / 5]}>
        <torusGeometry args={[1.05, 0.004, 8, 80]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.4, Math.PI / 5, 0]}>
        <torusGeometry args={[1.3, 0.003, 8, 80]} />
        <meshBasicMaterial color="#7c5cd6" transparent opacity={0.28} toneMapped={false} />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={1.4} color="#a78bfa" distance={3.5} decay={2} />

      <Fragments count={highQuality ? 5 : 3} reducedMotion={reducedMotion} />
    </group>
  )
}

export default function CreativeArchiveScene({ progressRef, reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 4.4], fov: 40 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 3, 9]} />
          <ambientLight intensity={0.4} />
          <ArchiveCore progressRef={progressRef} reducedMotion={reducedMotion} highQuality={highQuality} />
          <ParticleField count={highQuality ? 90 : 45} radius={2.4} sparkles={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
