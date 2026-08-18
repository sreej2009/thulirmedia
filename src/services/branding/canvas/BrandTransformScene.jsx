import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const STAGES = [
  { label: 'Idea', color: '#6b7280' },
  { label: 'Identity', color: '#f59e0b' },
  { label: 'Creative', color: '#ec4899' },
  { label: 'Campaign', color: '#8b5cf6' },
  { label: 'Brand', color: '#f5f4f2' },
]

function Satellite({ index, total, angle, progressRef, color }) {
  const ref = useRef(null)
  const activation = useRef(0)
  const band = (index + 1) / total

  useFrame((state) => {
    const target = THREE.MathUtils.clamp((progressRef.current - band * 0.75) / 0.2, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.08)
    if (!ref.current) return
    const t = angle + state.clock.elapsedTime * 0.08
    const radius = 1.7
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * 0.5, Math.sin(t) * radius)
    ref.current.scale.setScalar(activation.current * 0.9)
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.16, 0]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function CoreShape({ progressRef, reducedMotion }) {
  const meshRef = useRef(null)
  const labelRef = useRef(null)

  useFrame((state, delta) => {
    const p = progressRef.current
    if (!meshRef.current) return
    if (!reducedMotion) meshRef.current.rotation.y += delta * (0.08 + p * 0.2)
    const scale = 0.75 + p * 0.55
    meshRef.current.scale.setScalar(scale)
    if (meshRef.current.material) {
      meshRef.current.material.distort = 0.05 + p * 0.35
      meshRef.current.material.emissiveIntensity = 0.1 + p * 0.6
    }
    if (labelRef.current) {
      const idx = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length))
      labelRef.current.textContent = STAGES[idx].label
      labelRef.current.style.color = STAGES[idx].color
      labelRef.current.style.borderColor = `${STAGES[idx].color}55`
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.9, 3]} />
        <MeshDistortMaterial color="#f5f4f2" emissive="#f59e0b" emissiveIntensity={0.1} roughness={0.2} metalness={0.5} distort={0.05} speed={1.6} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} position={[0, -1.4, 0]} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border bg-void/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.15em] backdrop-blur-sm"
        >
          Idea
        </div>
      </Html>
    </group>
  )
}

function Scene({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const targetZ = 6.5 - progressRef.current * 1.4
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#f59e0b" />
      <pointLight position={[0, -2, -3]} intensity={0.7} color="#ec4899" />
      <CoreShape progressRef={progressRef} reducedMotion={reducedMotion} />
      {STAGES.slice(1).map((stage, i) => (
        <Satellite key={stage.label} index={i} total={STAGES.length - 1} angle={(i / (STAGES.length - 1)) * Math.PI * 2} progressRef={progressRef} color={stage.color} />
      ))}
    </>
  )
}

export default function BrandTransformScene({ progressRef, reducedMotion = false }) {
  const { containerRef, inView } = useCanvasInView()
  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
