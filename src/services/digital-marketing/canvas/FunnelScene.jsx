import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const STAGES = [
  { label: 'Attention', color: '#8b5cf6', radius: 2.3 },
  { label: 'Engagement', color: '#a78bfa', radius: 1.9 },
  { label: 'Traffic', color: '#60a5fa', radius: 1.5 },
  { label: 'Lead', color: '#22d3ee', radius: 1.1 },
  { label: 'Customer', color: '#34d399', radius: 0.7 },
  { label: 'Growth', color: '#f5f4f2', radius: 0.35 },
]

const SPACING = 1.5
const TOP_Y = ((STAGES.length - 1) * SPACING) / 2

function StageRing({ stage, index, total, progressRef, reducedMotion }) {
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const activation = useRef(0)
  const y = TOP_Y - index * SPACING

  useFrame(() => {
    const band = index / (total - 1)
    const target = THREE.MathUtils.clamp((progressRef.current - band * 0.78) / 0.22, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.08)

    if (ringRef.current) {
      const scale = 0.7 + activation.current * 0.4
      ringRef.current.scale.setScalar(scale)
      if (ringRef.current.material) ringRef.current.material.opacity = 0.25 + activation.current * 0.65
      if (!reducedMotion) ringRef.current.rotation.z += 0.003
    }
    if (labelRef.current) {
      labelRef.current.style.opacity = String(0.2 + activation.current * 0.8)
    }
  })

  const isLast = index === total - 1

  return (
    <group position={[0, y, 0]}>
      <mesh ref={ringRef}>
        {isLast ? (
          <sphereGeometry args={[stage.radius, 24, 24]} />
        ) : (
          <torusGeometry args={[stage.radius, 0.03, 12, 64]} />
        )}
        <meshBasicMaterial color={stage.color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]}>
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

function FlowParticle({ offset, speed, progressRef }) {
  const ref = useRef(null)
  const bottomY = TOP_Y - (STAGES.length - 1) * SPACING

  useFrame((state) => {
    if (!ref.current) return
    const visibility = THREE.MathUtils.clamp(progressRef.current * 1.6, 0, 1)
    const t = (state.clock.elapsedTime * speed + offset) % 1
    const y = TOP_Y - t * (TOP_Y - bottomY)
    const bandIndex = Math.min(STAGES.length - 1, Math.floor(t * STAGES.length))
    const radius = THREE.MathUtils.lerp(STAGES[bandIndex]?.radius ?? 0.3, 0.05, t)
    const angle = t * Math.PI * 6 + offset * 10
    ref.current.position.set(Math.cos(angle) * radius * 0.6, y, Math.sin(angle) * radius * 0.6)
    if (ref.current.material) ref.current.material.opacity = visibility * 0.8
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#e9d5ff" transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function Scene({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const targetY = TOP_Y - progressRef.current * (TOP_Y - (TOP_Y - (STAGES.length - 1) * SPACING)) * 0.85
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY * 0.4, 0.05)
    state.camera.lookAt(0, state.camera.position.y, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, -4, 2]} intensity={1.2} color="#34d399" />
      {STAGES.map((stage, i) => (
        <StageRing key={stage.label} stage={stage} index={i} total={STAGES.length} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
      {!reducedMotion &&
        Array.from({ length: 10 }).map((_, i) => (
          <FlowParticle key={i} offset={i / 10} speed={0.08 + (i % 3) * 0.02} progressRef={progressRef} />
        ))}
    </>
  )
}

export default function FunnelScene({ progressRef, reducedMotion = false }) {
  const { containerRef, inView } = useCanvasInView()
  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
