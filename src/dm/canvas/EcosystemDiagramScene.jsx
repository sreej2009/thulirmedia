import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import { ecosystemSources, ecosystemPipeline } from '../data'

// fixed world-space layout: five sources fan in above a vertical
// website -> leads -> sales -> growth pipeline. Kept as plain data so the
// DOM label styling and the 3D positions stay trivially in sync.
const SOURCE_POSITIONS = [
  [-3, 2.7, -0.6],
  [-1.5, 3.05, -0.2],
  [0, 3.2, 0],
  [1.5, 3.05, -0.2],
  [3, 2.7, -0.6],
]

const PIPELINE_POSITIONS = [
  [0, 0.9, 0.4],
  [0, -0.6, 0.3],
  [0, -2.1, 0.15],
  [0, -3.6, 0],
]

const nodes = [
  ...ecosystemSources.map((s, i) => ({ ...s, position: SOURCE_POSITIONS[i], size: 0.16 })),
  ...ecosystemPipeline.map((s, i) => ({ ...s, position: PIPELINE_POSITIONS[i], size: 0.22 + i * 0.05 })),
]

const WEBSITE_INDEX = ecosystemSources.length // first pipeline node

function Node({ node, order, total, progressRef, reducedMotion }) {
  const meshRef = useRef(null)
  const labelRef = useRef(null)
  const activation = useRef(0)

  useFrame(() => {
    const band = order / (total - 1)
    const target = THREE.MathUtils.clamp((progressRef.current - band * 0.75) / 0.22, 0, 1)
    activation.current = THREE.MathUtils.lerp(activation.current, target, 0.08)

    if (meshRef.current) {
      const scale = 0.6 + activation.current * 0.55
      meshRef.current.scale.setScalar(scale)
      if (meshRef.current.material) {
        meshRef.current.material.opacity = 0.35 + activation.current * 0.65
      }
      if (!reducedMotion) {
        meshRef.current.rotation.y += 0.004
      }
    }

    if (labelRef.current) {
      labelRef.current.style.opacity = String(0.25 + activation.current * 0.75)
      labelRef.current.style.transform = `translateY(${(1 - activation.current) * 6}px)`
    }
  })

  return (
    <group position={node.position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[node.size, 1]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={9} occlude={false} zIndexRange={[10, 0]}>
        <div
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] backdrop-blur-sm transition-opacity"
          style={{
            borderColor: `${node.color}55`,
            background: 'rgba(10,10,12,0.55)',
            color: node.color,
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  )
}

function FlowParticle({ curve, offset, speed, color, progressRef }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    const visibility = THREE.MathUtils.clamp(progressRef.current * 1.6, 0, 1)
    const t = (state.clock.elapsedTime * speed + offset) % 1
    const p = curve.getPoint(t)
    ref.current.position.copy(p)
    if (ref.current.material) ref.current.material.opacity = visibility * 0.85
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

function Connections({ progressRef, reducedMotion }) {
  const website = nodes[WEBSITE_INDEX]

  const sourceCurves = useMemo(
    () =>
      SOURCE_POSITIONS.map((pos) => {
        const start = new THREE.Vector3(...pos)
        const end = new THREE.Vector3(...website.position)
        const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.15, 0.6))
        return new THREE.QuadraticBezierCurve3(start, mid, end)
      }),
    [website.position]
  )

  const pipelineCurves = useMemo(() => {
    const pts = [website.position, ...PIPELINE_POSITIONS.slice(1)]
    const curves = []
    for (let i = 0; i < pts.length - 1; i++) {
      const start = new THREE.Vector3(...pts[i])
      const end = new THREE.Vector3(...pts[i + 1])
      const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0.25, 0, 0.1))
      curves.push(new THREE.QuadraticBezierCurve3(start, mid, end))
    }
    return curves
  }, [website.position])

  return (
    <>
      {SOURCE_POSITIONS.map((pos, i) => (
        <QuadraticBezierLine
          key={`src-${i}`}
          start={pos}
          end={website.position}
          mid={sourceCurves[i].v1.toArray()}
          color={ecosystemSources[i].color}
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}

      {pipelineCurves.map((curve, i) => (
        <Line
          key={`pipe-${i}`}
          points={curve.getPoints(24)}
          color={ecosystemPipeline[Math.min(i + 1, ecosystemPipeline.length - 1)].color}
          lineWidth={1.4}
          transparent
          opacity={0.45}
        />
      ))}

      {!reducedMotion &&
        sourceCurves.map((curve, i) => (
          <FlowParticle
            key={`fp-src-${i}`}
            curve={curve}
            offset={i / sourceCurves.length}
            speed={0.12}
            color={ecosystemSources[i].color}
            progressRef={progressRef}
          />
        ))}

      {!reducedMotion &&
        pipelineCurves.map((curve, i) => (
          <FlowParticle
            key={`fp-pipe-${i}`}
            curve={curve}
            offset={i / pipelineCurves.length}
            speed={0.16}
            color={ecosystemPipeline[i + 1].color}
            progressRef={progressRef}
          />
        ))}
    </>
  )
}

function Scene({ progressRef, reducedMotion }) {
  useFrame((state) => {
    const targetZ = 9 - progressRef.current * 1.2
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.lookAt(0, -0.3, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#a78bfa" />
      {nodes.map((node, i) => (
        <Node key={node.id} node={node} order={i} total={nodes.length} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
      <Connections progressRef={progressRef} reducedMotion={reducedMotion} />
    </>
  )
}

export default function EcosystemDiagramCanvas({ progressRef, reducedMotion = false }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, -0.3, 9], fov: 45 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
