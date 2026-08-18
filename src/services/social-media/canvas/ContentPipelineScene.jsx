import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const STAGES = [
  { label: 'Idea', color: '#8b5cf6' },
  { label: 'Create', color: '#ec4899' },
  { label: 'Publish', color: '#22d3ee' },
  { label: 'Engage', color: '#f59e0b' },
  { label: 'Analyze', color: '#60a5fa' },
  { label: 'Optimize', color: '#34d399' },
]

const SPACING = 2.6
const START_X = -((STAGES.length - 1) * SPACING) / 2

function StageCard({ stage, index, total, progressRef, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const activation = useRef(0)
  const x = START_X + index * SPACING

  useFrame(() => {
    const band = index / (total - 1)
    const target = THREE.MathUtils.clamp((progressRef.current - band * 0.78) / 0.24, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.08)

    if (ref.current) {
      const scale = 0.55 + activation.current * 0.5
      ref.current.scale.setScalar(scale)
      if (ref.current.material) ref.current.material.opacity = 0.3 + activation.current * 0.6
      if (!reducedMotion) ref.current.rotation.z += 0.006
    }
    if (labelRef.current) labelRef.current.style.opacity = String(0.2 + activation.current * 0.8)
  })

  return (
    <group position={[x, 0, 0]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color={stage.color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]} position={[0, -0.9, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] backdrop-blur-sm transition-opacity"
          style={{ borderColor: `${stage.color}55`, background: 'rgba(10,10,12,0.55)', color: stage.color }}
        >
          {stage.label}
        </div>
      </Html>
    </group>
  )
}

function ConnectorLine() {
  const points = [
    new THREE.Vector3(START_X, 0, 0),
    new THREE.Vector3(START_X + (STAGES.length - 1) * SPACING, 0, 0),
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} />
    </line>
  )
}

function Scene({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const totalWidth = (STAGES.length - 1) * SPACING
    const targetX = START_X + progressRef.current * totalWidth
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.06)
    state.camera.lookAt(state.camera.position.x, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#22d3ee" />
      <ConnectorLine />
      {STAGES.map((stage, i) => (
        <StageCard key={stage.label} stage={stage} index={i} total={STAGES.length} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
    </>
  )
}

export default function ContentPipelineScene({ progressRef, reducedMotion = false }) {
  const { containerRef, inView } = useCanvasInView()
  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [START_X, 0, 4.2], fov: 45 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
