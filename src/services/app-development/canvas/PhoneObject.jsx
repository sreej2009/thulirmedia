import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The phone: a rounded body + screen that cycles through seven states as
// `progress` (0 -> 1) advances — Idea, UI/UX, Development, API, Testing,
// Deployment, Growth — each its own small layer of content that crossfades.
export default function PhoneObject({ progress, mouseReactive = true, reducedMotion = false }) {
  const groupRef = useRef(null)
  const layerRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  const ideaDots = useMemo(
    () => Array.from({ length: 26 }).map(() => [(Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1.9]),
    []
  )

  useFrame((state, delta) => {
    const p = typeof progress === 'object' ? progress.current : progress

    if (groupRef.current) {
      if (mouseReactive && !reducedMotion) {
        const { pointer } = state
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.4, 0.05)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.25, 0.05)
      } else if (!reducedMotion) {
        groupRef.current.rotation.y += delta * 0.06
      }
    }

    const bandWidth = 1 / 7
    layerRefs.forEach((ref, i) => {
      if (!ref.current) return
      const center = bandWidth * (i + 0.5)
      const opacity = THREE.MathUtils.clamp(1 - Math.abs(p - center) / bandWidth, 0, 1)
      setGroupOpacity(ref.current, opacity)
    })
  })

  return (
    <group ref={groupRef}>
      {/* phone body */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[1.55, 2.9, 0.12]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.4, 2.75]} />
        <meshStandardMaterial color="#050506" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.3, 0.01]}>
        <planeGeometry args={[0.35, 0.05]} />
        <meshBasicMaterial color="#1c1c22" toneMapped={false} />
      </mesh>

      {/* 0 — idea: scattered wireframe dots */}
      <group ref={layerRefs[0]} position={[0, 0, 0.02]}>
        {ideaDots.map((p, i) => (
          <mesh key={i} position={[p[0], p[1], 0]}>
            <circleGeometry args={[0.012, 8]} />
            <meshBasicMaterial color="#c4b5fd" transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* 1 — UI/UX: coloured component blocks */}
      <group ref={layerRefs[1]} position={[0, 0, 0.025]}>
        <Block x={0} y={1} w={1.1} h={0.3} color="#f472b6" />
        {[0, 1].map((i) => (
          <Block key={i} x={-0.28 + i * 0.56} y={0.35} w={0.5} h={0.55} color={i === 0 ? '#8b5cf6' : '#60a5fa'} />
        ))}
        <Block x={0} y={-0.4} w={1.1} h={0.35} color="#34d399" />
        <Block x={0} y={-1.1} w={1.1} h={0.22} color="#26262e" />
      </group>

      {/* 2 — development: code bars */}
      <group ref={layerRefs[2]} position={[0, 0, 0.03]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[-0.35 + (i % 2) * 0.1, 1.1 - i * 0.24, 0]}>
            <planeGeometry args={[0.4 + ((i * 29) % 4) * 0.15, 0.07]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#60a5fa' : '#34d399'} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* 3 — API: connected nodes */}
      <group ref={layerRefs[3]} position={[0, 0, 0.035]}>
        {[[-0.4, 0.6], [0.4, 0.6], [0, 0], [-0.4, -0.6], [0.4, -0.6]].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], 0]}>
            <circleGeometry args={[0.06, 16]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* 4 — testing: checkmarks grid */}
      <group ref={layerRefs[4]} position={[0, 0, 0.04]}>
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <Block key={`${row}-${col}`} x={-0.28 + col * 0.56} y={0.8 - row * 0.6} w={0.5} h={0.42} color="#34d399" />
          ))
        )}
      </group>

      {/* 5 — deployment: upward arrow */}
      <group ref={layerRefs[5]} position={[0, 0, 0.045]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.22, 0.5, 4]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <planeGeometry args={[0.16, 0.8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* 6 — growth: rising bars */}
      <group ref={layerRefs[6]} position={[0, 0, 0.05]}>
        {[0.4, 0.7, 1.1, 1.5].map((h, i) => (
          <Block key={i} x={-0.42 + i * 0.28} y={-1.1 + h / 2} w={0.2} h={h} color="#4ade80" />
        ))}
      </group>
    </group>
  )
}

function setGroupOpacity(group, value) {
  group.children.forEach((child) => {
    if (child.material) child.material.opacity = value
  })
}

function Block({ x, y, w, h, color }) {
  return (
    <mesh position={[x, y, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
