import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'

const NODE_COLORS = ['#8b5cf6', '#ec4899', '#22d3ee', '#f59e0b', '#34d399', '#60a5fa']

function OrbitNode({ color, radius, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * radius * 0.35, Math.sin(t) * radius)

    const targetScale = hovered ? 1.6 : 1
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1))
  })

  return (
    <mesh ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <icosahedronGeometry args={[0.16, 0]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function OrbitLines({ nodeRefs, reducedMotion }) {
  // static curved guide lines from center to each orbit ring — subtle, not
  // literally tracking the moving nodes (keeps this cheap: no per-frame
  // geometry rebuilds), just enough to read as a connected network.
  return (
    <>
      {nodeRefs.map((n, i) => (
        <QuadraticBezierLine
          key={i}
          start={[0, 0, 0]}
          end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.7) * n.radius * 0.35, Math.sin(n.angle) * n.radius]}
          mid={[Math.cos(n.angle) * n.radius * 0.5, 0.4, Math.sin(n.angle) * n.radius * 0.5]}
          color={n.color}
          lineWidth={0.6}
          transparent
          opacity={reducedMotion ? 0.18 : 0.22}
        />
      ))}
    </>
  )
}

export default function EcosystemCore({ highQuality = true, reducedMotion = false }) {
  const coreRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.3)
  const [hovered, setHovered] = useState(false)

  const nodes = useMemo(
    () =>
      NODE_COLORS.map((color, i) => ({
        color,
        radius: 2.1 + (i % 3) * 0.35,
        angle: (i / NODE_COLORS.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.12 + (i % 3) * 0.04,
      })),
    [reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state

    if (groupRef.current && !reducedMotion) {
      const targetX = pointer.y * 0.35
      const targetY = pointer.x * 0.4
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.04)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.04)
    }

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.12
        coreRef.current.rotation.x += delta * 0.04
      }
      const targetScale = hovered ? 1.1 : 1
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 0.08))

      distortRef.current = THREE.MathUtils.lerp(distortRef.current, hovered ? 0.5 : 0.3, 0.06)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.3} floatIntensity={reducedMotion ? 0 : 0.6}>
        <mesh
          ref={coreRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1, highQuality ? 4 : 2]} />
          <MeshDistortMaterial
            color="#a78bfa"
            emissive="#3d2a6b"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.5}
            distort={0.3}
            speed={1.6}
          />
        </mesh>

        {nodes.map((n, i) => (
          <OrbitNode key={i} {...n} reducedMotion={reducedMotion} />
        ))}

        <OrbitLines nodeRefs={nodes} reducedMotion={reducedMotion} />
      </Float>
    </group>
  )
}
