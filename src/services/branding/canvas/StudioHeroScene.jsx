import { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial } from '@react-three/drei'
import ParticleField from '../../../components/canvas/ParticleField'
import MouseLight from '../../../components/canvas/MouseLight'
import CameraRig from '../../../components/canvas/CameraRig'
import PostFX from '../../../components/canvas/PostFX'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

// A loose "studio gallery" — independent floating objects instead of one
// hub-and-spoke cluster, so this world reads spatially different from the
// other five services' orbiting-node compositions.

function LogoMark({ reducedMotion }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.2
  })
  return (
    <Float speed={reducedMotion ? 0 : 1.3} floatIntensity={reducedMotion ? 0 : 0.6} position={[-1.6, 0.6, 0]}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[0.42, 0.14, 100, 12]} />
        <MeshDistortMaterial color="#f97316" emissive="#7c2d12" emissiveIntensity={0.4} roughness={0.2} metalness={0.5} distort={0.2} speed={1.5} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} position={[0, -0.75, 0]}>
        <span className="pointer-events-none rounded-full border border-amber-300/40 bg-void/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-amber-300 backdrop-blur-sm">
          Logo
        </span>
      </Html>
    </Float>
  )
}

function Typography({ reducedMotion }) {
  return (
    <Float speed={reducedMotion ? 0 : 1} floatIntensity={reducedMotion ? 0 : 0.5} position={[1.7, 1, -0.6]}>
      <mesh>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial color="#121215" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false}>
        <span className="pointer-events-none font-display text-4xl text-ink">Aa</span>
      </Html>
    </Float>
  )
}

function ColorCards({ reducedMotion }) {
  const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#34d399']
  return (
    <Float speed={reducedMotion ? 0 : 1.1} floatIntensity={reducedMotion ? 0 : 0.45} position={[0.3, -0.9, 0.4]}>
      <group>
        {colors.map((c, i) => (
          <mesh key={c} position={[i * 0.22 - 0.33, 0, i * 0.02]} rotation={[0, 0, -0.15 + i * 0.1]}>
            <planeGeometry args={[0.32, 0.42]} />
            <meshBasicMaterial color={c} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <Html center distanceFactor={9} occlude={false} position={[0, -0.4, 0]}>
        <span className="pointer-events-none rounded-full border border-line bg-void/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-mist backdrop-blur-sm">
          Color System
        </span>
      </Html>
    </Float>
  )
}

function Poster({ reducedMotion }) {
  return (
    <Float speed={reducedMotion ? 0 : 0.9} floatIntensity={reducedMotion ? 0 : 0.4} position={[-1.9, -0.8, -0.8]}>
      <mesh rotation={[0, 0.3, 0]}>
        <planeGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </Float>
  )
}

function Packaging({ reducedMotion }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.x += delta * 0.15
  })
  return (
    <Float speed={reducedMotion ? 0 : 1.2} floatIntensity={reducedMotion ? 0 : 0.5} position={[2, -0.5, 0.3]}>
      <mesh ref={ref}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#34d399" roughness={0.3} metalness={0.5} emissive="#0f5132" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  )
}

function MotionRing({ reducedMotion }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.z += delta * 0.3
  })
  return (
    <Float speed={reducedMotion ? 0 : 1} floatIntensity={reducedMotion ? 0 : 0.4} position={[0.2, 1.5, -1]}>
      <mesh ref={ref}>
        <torusGeometry args={[0.35, 0.03, 16, 64]} />
        <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
      </mesh>
    </Float>
  )
}

function Scene({ highQuality, reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} color="#fdba74" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#fb923c" />
      <LogoMark reducedMotion={reducedMotion} />
      <Typography reducedMotion={reducedMotion} />
      <ColorCards reducedMotion={reducedMotion} />
      <Poster reducedMotion={reducedMotion} />
      <Packaging reducedMotion={reducedMotion} />
      <MotionRing reducedMotion={reducedMotion} />
      <ParticleField count={highQuality ? 420 : 220} radius={5.5} sparkles={highQuality && !reducedMotion} />
    </>
  )
}

export default function StudioHeroScene({ reducedMotion = false }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.75]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
    <Canvas
      dpr={dpr}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <fog attach="fog" args={['#0a0a0c', 4, 12]} />
        <CameraRig amplitude={reducedMotion ? 0 : highQuality ? 0.45 : 0.22} />
        <MouseLight intensity={highQuality ? 5 : 2.5} color="#f97316" />
        <Scene highQuality={highQuality} reducedMotion={reducedMotion} />
        <PostFX highQuality={highQuality} />
      </Suspense>
    </Canvas>
    </div>
  )
}
