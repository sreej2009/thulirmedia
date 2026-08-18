import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import PhoneObject from './PhoneObject'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const FEATURES = [
  { label: 'Authentication', color: '#8b5cf6' },
  { label: 'Push Notifications', color: '#ec4899' },
  { label: 'Payments', color: '#34d399' },
  { label: 'Maps', color: '#60a5fa' },
  { label: 'Chat', color: '#22d3ee' },
  { label: 'File Upload', color: '#f59e0b' },
  { label: 'Analytics', color: '#f472b6' },
]

function FeatureNode({ label, color, radius, angle, speed, progressRef, order, total, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const activation = useRef(0)

  useFrame((state) => {
    const band = order / (total - 1)
    const target = THREE.MathUtils.clamp((progressRef.current - band * 0.7) / 0.28, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.08)

    if (ref.current) {
      const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
      ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.5) * 0.6, Math.sin(t) * radius)
      ref.current.scale.setScalar(0.7 + activation.current * 0.5)
    }
    if (labelRef.current) labelRef.current.style.opacity = String(0.15 + activation.current * 0.85)
  })

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.11, 0]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={8} occlude={false} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] backdrop-blur-sm transition-opacity"
          style={{ borderColor: `${color}55`, background: 'rgba(10,10,12,0.55)', color }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function Scene({ progressRef, reducedMotion }) {
  const nodes = useMemo(
    () =>
      FEATURES.map((f, i) => ({
        ...f,
        radius: 2.1 + (i % 3) * 0.3,
        angle: (i / FEATURES.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.08 + (i % 3) * 0.025,
      })),
    [reducedMotion]
  )

  useFrame((state) => {
    const targetZ = 6.5 - progressRef.current * 1.3
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#f9a8d4" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#8b5cf6" />
      <PhoneObject progress={progressRef} mouseReactive={!reducedMotion} reducedMotion={reducedMotion} />
      {nodes.map((n, i) => (
        <FeatureNode key={n.label} {...n} order={i} total={nodes.length} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
    </>
  )
}

export default function AppArchitectureScene({ progressRef, reducedMotion = false }) {
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
