import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../../lib/gsap'

export default function CentralObject({ highQuality = true }) {
  const groupRef = useRef(null)
  const coreRef = useRef(null)
  const shellRef = useRef(null)
  const glowRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const distortRef = useRef({ value: 0.32 })
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    const { pointer, clock } = state
    const t = clock.elapsedTime

    if (groupRef.current) {
      const targetX = (pointer.y * Math.PI) / 9
      const targetY = (pointer.x * Math.PI) / 8
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.045)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.045)
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.16
      coreRef.current.rotation.z += delta * 0.06
      const targetScale = hovered ? 1.08 : 1
      coreRef.current.scale.setScalar(
        THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 0.08)
      )
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.08
      shellRef.current.rotation.x += delta * 0.03
    }

    if (ringARef.current) {
      ringARef.current.rotation.z += delta * 0.22
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.x += delta * -0.16
    }

    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.12
      glowRef.current.scale.setScalar(pulse)
    }

    distortRef.current.value = THREE.MathUtils.lerp(
      distortRef.current.value,
      hovered ? 0.5 : 0.32,
      0.06
    )
    if (coreRef.current?.material && 'distort' in coreRef.current.material) {
      coreRef.current.material.distort = distortRef.current.value
    }
  })

  const handlePointerDown = () => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.scale, {
      x: 1.12,
      y: 1.12,
      z: 1.12,
      duration: 0.4,
      ease: 'power3.out',
      yoyo: true,
      repeat: 1,
    })
  }

  const scale = Math.min(1.6, Math.max(1, viewport.width / 12))

  return (
    <group ref={groupRef} scale={scale}>
      <Float speed={1.3} rotationIntensity={0.45} floatIntensity={0.75}>
        {/* inner emissive glow core */}
        <mesh ref={glowRef} scale={0.55}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.55} toneMapped={false} />
        </mesh>

        {/* main body */}
        <mesh
          ref={coreRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={handlePointerDown}
        >
          <icosahedronGeometry args={[1.4, highQuality ? 6 : 3]} />
          {highQuality ? (
            <MeshTransmissionMaterial
              color="#8f6ff2"
              thickness={0.55}
              roughness={0.08}
              transmission={1}
              ior={1.25}
              chromaticAberration={0.035}
              anisotropy={0.25}
              distortion={0.32}
              distortionScale={0.4}
              temporalDistortion={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.4}
              resolution={256}
              samples={6}
            />
          ) : (
            <MeshDistortMaterial
              color="#7c5cd6"
              emissive="#3d2a6b"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.6}
              distort={0.35}
              speed={1.8}
            />
          )}
        </mesh>

        {/* outer wireframe shell */}
        <mesh ref={shellRef} scale={1.55}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial
            color="#c4b5fd"
            wireframe
            transparent
            opacity={0.12}
            toneMapped={false}
          />
        </mesh>

        {/* orbiting accent rings */}
        <mesh ref={ringARef} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.1, 0.006, 8, 128]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.4} toneMapped={false} />
        </mesh>
        <mesh ref={ringBRef} rotation={[0, Math.PI / 3, Math.PI / 5]}>
          <torusGeometry args={[2.4, 0.005, 8, 128]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.25} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  )
}
