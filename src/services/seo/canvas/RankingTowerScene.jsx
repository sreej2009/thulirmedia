import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

const POSITIONS = 10
const SPACING = 0.85
const TOP_Y = ((POSITIONS - 1) * SPACING) / 2

function RankCard({ index, progressRef }) {
  const meshRef = useRef(null)
  const y = TOP_Y - index * SPACING
  const rank = index + 1

  useFrame(() => {
    if (!meshRef.current) return
    const target = THREE.MathUtils.clamp((progressRef.current - index / POSITIONS * 0.5) * 2, 0, 1)
    meshRef.current.material.opacity = 0.12 + target * 0.16
  })

  return (
    <group position={[-0.4, y, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[2.6, 0.5]} />
        <meshBasicMaterial color="#1c1c22" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[5, 0]} position={[-1.55, 0, 0]}>
        <span className="pointer-events-none font-mono text-[11px] text-mist/50">#{rank}</span>
      </Html>
    </group>
  )
}

function YourSiteMarker({ progressRef, reducedMotion }) {
  const ref = useRef(null)
  const labelRef = useRef(null)

  useFrame(() => {
    if (!ref.current) return
    // climbs from position 10 (bottom) to position 1 (top) as progress advances
    const rankFloat = THREE.MathUtils.lerp(POSITIONS - 1, 0, THREE.MathUtils.clamp(progressRef.current * 1.05, 0, 1))
    const targetY = TOP_Y - rankFloat * SPACING
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.08)
    if (!reducedMotion) ref.current.rotation.y += 0.01

    if (labelRef.current) {
      const rank = Math.max(1, Math.round(POSITIONS - rankFloat))
      labelRef.current.textContent = `Your site — position #${rank}`
    }
  })

  return (
    <group ref={ref} position={[-0.4, TOP_Y, 0.15]}>
      <mesh>
        <planeGeometry args={[2.7, 0.56]} />
        <meshBasicMaterial color="#f5f4f2" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]} position={[1.9, 0, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border border-emerald-300/50 bg-void/70 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-sm"
        >
          Your site — position #10
        </div>
      </Html>
    </group>
  )
}

function Scene({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const targetY = -progressRef.current * TOP_Y * 1.5
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.06)
    state.camera.lookAt(0, state.camera.position.y, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#34d399" />
      {Array.from({ length: POSITIONS }).map((_, i) => (
        <RankCard key={i} index={i} progressRef={progressRef} />
      ))}
      <YourSiteMarker progressRef={progressRef} reducedMotion={reducedMotion} />
    </>
  )
}

export default function RankingTowerScene({ progressRef, reducedMotion = false }) {
  const { containerRef, inView } = useCanvasInView()
  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, TOP_Y, 6.5], fov: 45 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
