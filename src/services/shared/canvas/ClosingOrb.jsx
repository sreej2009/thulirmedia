import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const GEOMETRY = {
  icosahedron: (detail) => <icosahedronGeometry args={[0.85, detail]} />,
  octahedron: (detail) => <octahedronGeometry args={[0.95, Math.max(0, detail - 2)]} />,
  dodecahedron: () => <dodecahedronGeometry args={[0.85, 0]} />,
}

function Orb({ shape, color, highQuality, reducedMotion }) {
  const meshRef = useRef(null)
  const distortRef = useRef(0.35)
  const [hovered, setHovered] = useState(false)
  const geometry = GEOMETRY[shape] || GEOMETRY.icosahedron

  useFrame((state, delta) => {
    if (!meshRef.current) return
    if (!reducedMotion) {
      meshRef.current.rotation.y += delta * 0.14
      meshRef.current.rotation.x += delta * 0.05
    }
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * (reducedMotion ? 0.02 : 0.06)
    const targetScale = pulse * (hovered ? 1.08 : 1)
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08))

    distortRef.current = THREE.MathUtils.lerp(distortRef.current, hovered ? 0.55 : 0.35, 0.06)
    if (meshRef.current.material) meshRef.current.material.distort = distortRef.current
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={reducedMotion ? 0 : 0.4} floatIntensity={reducedMotion ? 0 : 0.7}>
      <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {geometry(highQuality ? 5 : 2)}
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.5}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

export default function ClosingOrb({ color = '#a78bfa', shape = 'icosahedron', reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.75]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8.5], fov: 38 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 3, 4]} intensity={1.1} color={color} />
          <MouseLight intensity={highQuality ? 6 : 3} color={color} />

          <Orb shape={shape} color={color} highQuality={highQuality} reducedMotion={reducedMotion} />
          <ParticleField count={highQuality ? 450 : 220} radius={5} sparkles={highQuality && !reducedMotion} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
