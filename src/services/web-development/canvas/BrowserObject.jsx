import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The browser window itself: chrome bar + four stacked content layers
// (wireframe / UI / code / live) whose opacity crossfades based on
// `progress` (0 -> 1), so the object visibly "transforms" as you scroll.
export default function BrowserObject({ progress, mouseReactive = true, reducedMotion = false }) {
  const groupRef = useRef(null)
  const wireRef = useRef(null)
  const uiRef = useRef(null)
  const codeRef = useRef(null)
  const liveRef = useRef(null)

  useFrame((state, delta) => {
    const p = typeof progress === 'object' ? progress.current : progress

    if (groupRef.current) {
      if (mouseReactive && !reducedMotion) {
        const { pointer } = state
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.35, 0.05)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.2, 0.05)
      } else if (!reducedMotion) {
        groupRef.current.rotation.y += delta * 0.05
      }
    }

    // four bands: wireframe [0-.25] -> ui [.25-.5] -> code [.5-.75] -> live [.75-1]
    const bandOpacity = (center) => THREE.MathUtils.clamp(1 - Math.abs(p - center) * 5.2, 0, 1)

    if (wireRef.current) wireRef.current.material.opacity = bandOpacity(0.08) + (p < 0.08 ? 1 - p * 4 : 0)
    if (uiRef.current) setGroupOpacity(uiRef.current, bandOpacity(0.35))
    if (codeRef.current) setGroupOpacity(codeRef.current, bandOpacity(0.6))
    if (liveRef.current) setGroupOpacity(liveRef.current, THREE.MathUtils.clamp((p - 0.72) / 0.28, 0, 1))
  })

  return (
    <group ref={groupRef}>
      {/* browser chrome */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[3.4, 0.32, 0.12]} />
        <meshStandardMaterial color="#16161a" roughness={0.6} metalness={0.2} />
      </mesh>
      {[-1.5, -1.3, -1.1].map((x, i) => (
        <mesh key={i} position={[x, 1.15, 0.07]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#3a3a42" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0.3, 1.15, 0.07]}>
        <planeGeometry args={[2.3, 0.14]} />
        <meshBasicMaterial color="#0a0a0c" toneMapped={false} />
      </mesh>

      {/* frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.4, 2.2, 0.1]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* wireframe state */}
      <mesh ref={wireRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[3.2, 1.95]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* UI state — a small grid of coloured component blocks */}
      <group ref={uiRef} position={[0, 0, 0.035]}>
        <UIBlock x={-1.05} y={0.7} w={0.9} h={0.28} color="#8b5cf6" />
        <UIBlock x={0.55} y={0.7} w={1.5} h={0.28} color="#3b3b45" />
        {[0, 1, 2].map((i) => (
          <UIBlock key={i} x={-1.05 + i * 1.1} y={0} w={0.95} h={0.75} color={['#60a5fa', '#34d399', '#f472b6'][i]} />
        ))}
        <UIBlock x={0} y={-0.75} w={3.1} h={0.22} color="#26262e" />
      </group>

      {/* code state — monospace-style horizontal bars */}
      <group ref={codeRef} position={[0, 0, 0.045]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-1.55 + (i % 2 === 0 ? 0 : 0.2), 0.85 - i * 0.24, 0]}>
            <planeGeometry args={[0.5 + ((i * 37) % 5) * 0.35, 0.09]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#34d399' : '#9a99a3'} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* live product state — a polished gradient hero mock */}
      <group ref={liveRef} position={[0, 0, 0.055]}>
        <mesh position={[0, 0.35, 0]}>
          <planeGeometry args={[3.1, 1]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} depthWrite={false} toneMapped={false} />
        </mesh>
        <UIBlock x={-1.1} y={-0.55} w={0.85} h={0.55} color="#8b5cf6" />
        <UIBlock x={0} y={-0.55} w={0.85} h={0.55} color="#34d399" />
        <UIBlock x={1.1} y={-0.55} w={0.85} h={0.55} color="#f472b6" />
      </group>
    </group>
  )
}

function setGroupOpacity(group, value) {
  group.children.forEach((child) => {
    if (child.material) child.material.opacity = value
  })
}

function UIBlock({ x, y, w, h, color }) {
  return (
    <mesh position={[x, y, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
