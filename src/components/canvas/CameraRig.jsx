import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig({ amplitude = 0.6 }) {
  useFrame((state) => {
    const { camera, pointer } = state
    const targetX = pointer.x * amplitude
    const targetY = pointer.y * amplitude * 0.6

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.035)
    camera.lookAt(0, 0, 0)
  })

  return null
}
