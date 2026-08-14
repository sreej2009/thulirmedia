import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function ParticleField({ count = 800, radius = 6, sparkles = true }) {
  const groupRef = useRef(null)
  const farRef = useRef(null)
  const nearRef = useRef(null)

  const farPositions = useMemo(() => makeSpherePositions(count, radius), [count, radius])
  const nearPositions = useMemo(
    () => makeSpherePositions(Math.round(count * 0.35), radius * 0.55),
    [count, radius]
  )

  useFrame((state, delta) => {
    if (farRef.current) {
      farRef.current.rotation.y += delta * 0.02
      farRef.current.rotation.x += delta * 0.004
    }
    if (nearRef.current) {
      nearRef.current.rotation.y -= delta * 0.035
      nearRef.current.rotation.z += delta * 0.006
    }
    if (groupRef.current) {
      const { pointer } = state
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        -pointer.x * 0.3,
        0.03
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -pointer.y * 0.2,
        0.03
      )
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farPositions.length / 3}
            array={farPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#c4b5fd"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nearPositions.length / 3}
            array={nearPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#ffffff"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {sparkles && (
        <Sparkles
          count={40}
          scale={[radius * 0.9, radius * 0.6, radius * 0.9]}
          size={2.5}
          speed={0.3}
          opacity={0.6}
          color="#e9d5ff"
          noise={1}
        />
      )}
    </group>
  )
}

function makeSpherePositions(count, radius) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * (0.4 + Math.random() * 0.6)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}
