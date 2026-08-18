import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Float, Html, MeshDistortMaterial, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { servicesRegistry } from '../../services/shared/registry'

// The "Digital Growth Core" — a layered, translucent core (outer wireframe
// shell, distorted glass-like body, inner glowing point) with the six
// service disciplines orbiting as small spatial labels, not pills. Scroll
// drives the camera forward through it rather than just fading it out.

const worldPosScratch = new THREE.Vector3()

function ServiceNode({ label, color, radius, depth, angle, speed, reducedMotion }) {
  const ref = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? angle : angle + state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.5) * radius * 0.3, Math.sin(t) * radius * 0.6 - depth)

    const targetScale = hovered ? 1.6 : 1
    if (dotRef.current) dotRef.current.scale.setScalar(THREE.MathUtils.lerp(dotRef.current.scale.x, targetScale, 0.12))

    if (labelRef.current) {
      // Small, elegant labels — but still fade near dead-center so they
      // never collide with the large headline sitting over this scene.
      ref.current.getWorldPosition(worldPosScratch)
      worldPosScratch.project(state.camera)
      const centerFade = THREE.MathUtils.smoothstep(Math.abs(worldPosScratch.x), 0.08, 0.5)
      const depthFade = THREE.MathUtils.clamp(1 - depth / 6, 0.35, 1)
      labelRef.current.style.opacity = String((hovered ? 1 : 0.55) * centerFade * depthFade)
    }
  })

  return (
    <group ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[5, 0]} position={[0, -0.22, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em] transition-opacity"
          style={{ color, textShadow: '0 1px 6px rgba(10,10,12,0.9)' }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

function GrowthCore({ highQuality, reducedMotion, progressRef }) {
  const groupRef = useRef(null)
  const coreRef = useRef(null)
  const shellRef = useRef(null)
  const ringRef = useRef(null)
  const distortRef = useRef(0.28)

  const nodes = useMemo(
    () =>
      servicesRegistry.map((s, i) => ({
        label: s.label,
        color: s.accent,
        radius: 2.1 + (i % 3) * 0.5,
        depth: (i % 2) * 1.6,
        angle: (i / servicesRegistry.length) * Math.PI * 2,
        speed: reducedMotion ? 0 : 0.07 + (i % 3) * 0.02,
      })),
    [reducedMotion]
  )

  useFrame((state, delta) => {
    const { pointer } = state
    const progress = progressRef?.current ?? 0

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.22, 0.03)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.14, 0.03)
    }

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += delta * 0.1
        coreRef.current.rotation.x += delta * 0.03
      }
      distortRef.current = THREE.MathUtils.lerp(distortRef.current, 0.3 + progress * 0.25, 0.04)
      if (coreRef.current.material) coreRef.current.material.distort = distortRef.current
      const growScale = 1 + progress * 0.6
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, growScale, 0.06))
    }
    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= delta * 0.06
      shellRef.current.rotation.z += delta * 0.02
    }
    if (ringRef.current && !reducedMotion) {
      ringRef.current.rotation.x += delta * 0.08
      ringRef.current.rotation.y -= delta * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 0.9} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.35}>
        {/* outer wireframe shell — the "layered" dimensional read */}
        <mesh ref={shellRef} scale={1.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.09} toneMapped={false} />
        </mesh>

        {/* thin accent ring, off-axis, opposite rotation */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[1.65, 0.006, 8, 96]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.22} toneMapped={false} />
        </mesh>

        {/* main translucent, distorted core body */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, highQuality ? 5 : 2]} />
          <MeshDistortMaterial
            color="#8f7bdc"
            emissive="#2f2260"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.35}
            transparent
            opacity={0.72}
            distort={0.3}
            speed={1.3}
          />
        </mesh>

        {/* inner glowing point */}
        <mesh scale={0.22}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={4} color="#c4b5fd" distance={4} decay={2} />

        {/* flowing data particles, contained inside the shell */}
        <ParticleField count={highQuality ? 220 : 100} radius={1.15} sparkles={false} />

        {nodes.map((n, i) => (
          <group key={i}>
            <QuadraticBezierLine
              start={[0, 0, 0]}
              end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.5) * n.radius * 0.3, Math.sin(n.angle) * n.radius * 0.6 - n.depth]}
              mid={[Math.cos(n.angle) * n.radius * 0.5, 0.25, Math.sin(n.angle) * n.radius * 0.3]}
              color={n.color}
              lineWidth={0.5}
              transparent
              opacity={0.16}
            />
            <ServiceNode {...n} reducedMotion={reducedMotion} />
          </group>
        ))}
      </Float>
    </group>
  )
}

export default function DigitalGrowthCoreScene({ reducedMotion = false, progressRef }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.8]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 5, 15]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 4, 4]} intensity={1} color="#c4b5fd" />
          <pointLight position={[-4, -3, -4]} intensity={0.9} color="#7c5cd6" />
          <MouseLight intensity={highQuality ? 5 : 2.5} color="#a78bfa" />

          <GrowthCore highQuality={highQuality} reducedMotion={reducedMotion} progressRef={progressRef} />
          <ParticleField count={highQuality ? 380 : 180} radius={7} sparkles={highQuality && !reducedMotion} />

          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
