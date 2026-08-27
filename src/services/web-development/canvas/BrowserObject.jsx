import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// The Digital Architecture Core: a browser window built from six depth
// layers whose opacity crossfades along a single 0..1 progress value —
// structure -> design -> development -> integration -> optimization ->
// launch. The same object transforms continuously; nothing is swapped.

const BAND_WIDTH = 6.5
const bandOpacity = (p, center) => THREE.MathUtils.clamp(1 - Math.abs(p - center) * BAND_WIDTH, 0, 1)

const DB_NODES = [
  [-1.3, -1.9, 0.3],
  [0, -2.15, 0.1],
  [1.3, -1.9, -0.1],
]

export default function BrowserObject({ progress, mouseReactive = true, reducedMotion = false }) {
  const groupRef = useRef(null)
  const uiGroupRef = useRef(null)
  const wireRef = useRef(null)
  const uiRef = useRef(null)
  const codeRef = useRef(null)
  const integrationRef = useRef(null)
  const optimizationRef = useRef(null)
  const liveRef = useRef(null)
  const dbRefs = useRef([])
  const lineRefs = useRef([])

  useFrame((state, delta) => {
    const p = typeof progress === 'object' ? progress.current : progress

    if (groupRef.current) {
      if (mouseReactive && !reducedMotion) {
        const { pointer } = state
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.16, 0.05)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.09, 0.05)
      } else if (!reducedMotion) {
        groupRef.current.rotation.y += delta * 0.05
      }
    }
    // UI layers react a little more strongly than the outer frame — depth parallax.
    if (uiGroupRef.current && mouseReactive && !reducedMotion) {
      const { pointer } = state
      uiGroupRef.current.position.x = THREE.MathUtils.lerp(uiGroupRef.current.position.x, pointer.x * 0.08, 0.06)
      uiGroupRef.current.position.y = THREE.MathUtils.lerp(uiGroupRef.current.position.y, -pointer.y * 0.05, 0.06)
    }

    const structure = bandOpacity(p, 1 / 12) + (p < 1 / 12 ? (1 / 12 - p) * 4 : 0)
    const design = bandOpacity(p, 3 / 12)
    const development = bandOpacity(p, 5 / 12)
    const integration = bandOpacity(p, 7 / 12)
    const optimization = bandOpacity(p, 9 / 12)
    const launch = THREE.MathUtils.clamp((p - 10 / 12) / (2 / 12), 0, 1)

    if (wireRef.current?.material) wireRef.current.material.opacity = THREE.MathUtils.clamp(structure, 0, 1)
    if (uiRef.current) setGroupOpacity(uiRef.current, design)
    if (codeRef.current) setGroupOpacity(codeRef.current, development)
    if (integrationRef.current) setGroupOpacity(integrationRef.current, integration)
    if (optimizationRef.current) setGroupOpacity(optimizationRef.current, optimization)
    if (liveRef.current) setGroupOpacity(liveRef.current, launch)

    dbRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      if (mesh.material) mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, integration * 0.85, 0.1)
      if (!reducedMotion) mesh.rotation.y += delta * (0.3 + i * 0.1)
    })
    lineRefs.current.forEach((line) => {
      if (line?.material) line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, integration * 0.3, 0.1)
    })
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

      <group ref={uiGroupRef}>
        {/* structure: blueprint wireframe */}
        <mesh ref={wireRef} position={[0, 0, 0.02]}>
          <planeGeometry args={[3.2, 1.95]} />
          <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>

        {/* design: coloured UI/layout blocks */}
        <group ref={uiRef} position={[0, 0, 0.035]}>
          <UIBlock x={-1.05} y={0.7} w={0.9} h={0.28} color="#8b5cf6" />
          <UIBlock x={0.55} y={0.7} w={1.5} h={0.28} color="#3b3b45" />
          {[0, 1, 2].map((i) => (
            <UIBlock key={i} x={-1.05 + i * 1.1} y={0} w={0.95} h={0.75} color={['#60a5fa', '#34d399', '#f472b6'][i]} />
          ))}
          <UIBlock x={0} y={-0.75} w={3.1} h={0.22} color="#26262e" />
        </group>

        {/* development: componentized code fragments */}
        <group ref={codeRef} position={[0, 0, 0.045]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[-1.55 + (i % 2 === 0 ? 0 : 0.2), 0.85 - i * 0.24, 0]}>
              <planeGeometry args={[0.5 + ((i * 37) % 5) * 0.35, 0.09]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#34d399' : '#9a99a3'}
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        {/* optimization: small performance indicator ticks along the chrome */}
        <group ref={optimizationRef} position={[0, 1.15, 0.075]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={i} position={[-1.75 + i * 0.14, 0, 0]}>
              <planeGeometry args={[0.05, 0.05]} />
              <meshBasicMaterial color="#34d399" transparent opacity={0} toneMapped={false} />
            </mesh>
          ))}
        </group>

        {/* launch: polished live product */}
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

      {/* integration: API / database nodes connecting beneath the browser */}
      <group ref={integrationRef}>
        {DB_NODES.map((pos, i) => (
          <mesh key={i} ref={(el) => (dbRefs.current[i] = el)} position={pos}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
        {DB_NODES.map((pos, i) => (
          <Line
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            points={[
              [pos[0] * 0.4, -1.1, 0],
              pos,
            ]}
            color="#22d3ee"
            lineWidth={0.6}
            transparent
            opacity={0}
          />
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

function UIBlock({ x, y, w, h, color }) {
  return (
    <mesh position={[x, y, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
