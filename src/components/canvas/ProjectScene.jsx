import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const GEOMETRY = {
  icosahedron: <icosahedronGeometry args={[1, 1]} />,
  octahedron: <octahedronGeometry args={[1.05, 1]} />,
  dodecahedron: <dodecahedronGeometry args={[0.95, 0]} />,
  box: <boxGeometry args={[1.3, 1.3, 1.3, 2, 2, 2]} />,
  torus: <torusGeometry args={[0.8, 0.28, 16, 64]} />,
  torusKnot: <torusKnotGeometry args={[0.62, 0.2, 128, 12]} />,
}

function Shape({ color, shape }) {
  const meshRef = useRef(null)
  const groupRef = useRef(null)
  const distortRef = useRef(0.28)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    const { pointer } = state

    if (groupRef.current) {
      const targetX = pointer.y * 0.5
      const targetY = pointer.x * 0.6
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (hovered ? 0.55 : 0.18)
      meshRef.current.rotation.x += delta * (hovered ? 0.22 : 0.07)

      const targetScale = hovered ? 1.14 : 1
      const nextScale = THREE.MathUtils.lerp(meshRef.current.scale.x || 1, targetScale, 0.09)
      meshRef.current.scale.setScalar(nextScale)

      distortRef.current = THREE.MathUtils.lerp(distortRef.current, hovered ? 0.55 : 0.28, 0.08)
      if (meshRef.current.material) meshRef.current.material.distort = distortRef.current
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2.5, 2, 3]} intensity={1.5} color={color} />
      <pointLight position={[-2, -1.5, 2]} intensity={1.1} color="#ffffff" />

      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {GEOMETRY[shape] || GEOMETRY.icosahedron}
          <MeshDistortMaterial
            color={color}
            roughness={0.2}
            metalness={0.4}
            distort={0.28}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  )
}

export default function ProjectScene({ color = '#7c5cd6', shape = 'icosahedron' }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Shape color={color} shape={shape} />
      </Suspense>
    </Canvas>
  )
}
