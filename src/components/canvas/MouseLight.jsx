import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function MouseLight({ color = '#c4b5fd', intensity = 6 }) {
  const lightRef = useRef(null)

  useFrame((state) => {
    if (!lightRef.current) return
    const { pointer, viewport } = state
    const targetX = (pointer.x * viewport.width) / 2.4
    const targetY = (pointer.y * viewport.height) / 2.4

    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.06)
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.06)
  })

  return <pointLight ref={lightRef} position={[0, 0, 2.5]} color={color} intensity={intensity} distance={6} decay={2} />
}
