import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Html, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../../components/canvas/ParticleField'
import MouseLight from '../../components/canvas/MouseLight'
import PostFX from '../../components/canvas/PostFX'
import { useIsMobile, useIsTouch } from '../../hooks/useIsMobile'
import { useCanvasInView } from '../../hooks/useCanvasInView'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'
import { capabilities } from '../data'

// A ring network, not a hub-and-spoke: every node connects to the center
// AND to its two neighbours, so hovering one node visibly lights up the
// capabilities next to it — "related services illuminate" from the brief.

const worldPosScratch = new THREE.Vector3()

function Node({ item, index, radius, angle, active, onHover, onNavigate, reducedMotion }) {
  const meshRef = useRef(null)
  const labelRef = useRef(null)
  const isTouch = useIsTouch()
  const highlighted = active.hovered === index || active.neighbors.includes(index)

  const position = useMemo(
    () => [Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.32, Math.sin(angle) * radius],
    [angle, radius]
  )

  useFrame((state, delta) => {
    if (!meshRef.current) return
    if (!reducedMotion) meshRef.current.rotation.y += delta * 0.3
    const targetScale = active.hovered === index ? 1.4 : highlighted ? 1.12 : 1
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12))

    if (labelRef.current) {
      // drei's Html renders a real DOM node projected from 3D space — it
      // isn't clipped by this scene's CSS container the way WebGL content
      // is, so a node swung toward the top/bottom edge of the canvas can
      // render outside its intended box (even over the fixed nav). Fade it
      // out based on its own projected screen position instead of relying
      // on CSS overflow/clip-path, which doesn't reliably catch this.
      meshRef.current.getWorldPosition(worldPosScratch)
      worldPosScratch.project(state.camera)
      const screenY = ((1 - worldPosScratch.y) / 2) * state.size.height
      const margin = state.size.height * 0.22
      let edgeFade = 1
      if (screenY < margin) edgeFade = THREE.MathUtils.clamp(screenY / margin, 0, 1)
      else if (screenY > state.size.height - margin) {
        edgeFade = THREE.MathUtils.clamp((state.size.height - screenY) / margin, 0, 1)
      }

      const baseOpacity = active.hovered === null ? 0.85 : highlighted ? 1 : 0.3
      labelRef.current.style.opacity = String(baseOpacity * edgeFade)
      labelRef.current.style.pointerEvents = edgeFade < 0.4 ? 'none' : 'auto'
    }
  })

  const handleClick = async (e) => {
    e.preventDefault()
    const rect = labelRef.current?.getBoundingClientRect()
    if (rect) setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    await coverTransition(item.accent)
    onNavigate(item.path)
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(index)}
        onPointerOut={() => onHover(null)}
      >
        <icosahedronGeometry args={[0.22, 1]} />
        <meshBasicMaterial color={item.accent} toneMapped={false} />
      </mesh>
      <Html center distanceFactor={8.5} occlude={false} zIndexRange={[10, 0]} position={[0, -0.55, 0]}>
        <a
          href={item.path}
          ref={labelRef}
          onClick={handleClick}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          data-cursor="hover"
          data-cursor-text="Explore"
          className="pointer-events-auto flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-center backdrop-blur-sm transition-all duration-300"
          style={{
            borderColor: `${item.accent}${highlighted ? '80' : '30'}`,
            background: highlighted ? `${item.accent}1a` : 'rgba(10,10,12,0.55)',
          }}
        >
          <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.1em]" style={{ color: item.accent }}>
            {item.label}
          </span>
          {(highlighted || isTouch) && (
            <span className="max-w-[10rem] whitespace-normal text-[10px] leading-snug text-mist">{item.blurb}</span>
          )}
        </a>
      </Html>
    </group>
  )
}

function Network({ reducedMotion, onNavigate }) {
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const count = capabilities.length

  const nodes = useMemo(
    () =>
      capabilities.map((item, i) => ({
        item,
        angle: (i / count) * Math.PI * 2,
        radius: 2.15,
      })),
    [count]
  )

  const neighbors = useMemo(() => {
    if (hovered === null) return []
    return [(hovered - 1 + count) % count, (hovered + 1) % count]
  }, [hovered, count])

  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      const { pointer } = state
      // Y-axis (horizontal orbit sway) only — no vertical tilt. The Html
      // node labels are screen-space DOM elements projected from 3D, so
      // any vertical swing here moves them close to (or past) the frame's
      // edges since they aren't clipped the way WebGL content would be.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.06, 0.03)
    }
  })

  const active = { hovered, neighbors }

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshBasicMaterial color="#f5f4f2" transparent opacity={0.35} toneMapped={false} />
      </mesh>

      {nodes.map((n, i) => {
        const highlighted = active.hovered === i || active.neighbors.includes(i)
        return (
          <group key={n.item.path}>
            <QuadraticBezierLine
              start={[0, 0, 0]}
              end={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.5) * 0.32, Math.sin(n.angle) * n.radius]}
              mid={[Math.cos(n.angle) * n.radius * 0.5, 0.16, Math.sin(n.angle) * n.radius * 0.5]}
              color={n.item.accent}
              lineWidth={highlighted ? 1.4 : 0.6}
              transparent
              opacity={highlighted ? 0.6 : 0.18}
            />
            {i < count - 1 && (
              <QuadraticBezierLine
                start={[Math.cos(n.angle) * n.radius, Math.sin(n.angle * 0.5) * 0.32, Math.sin(n.angle) * n.radius]}
                end={[
                  Math.cos(nodes[i + 1].angle) * nodes[i + 1].radius,
                  Math.sin(nodes[i + 1].angle * 0.5) * 0.32,
                  Math.sin(nodes[i + 1].angle) * nodes[i + 1].radius,
                ]}
                mid={[0, -0.3, 0]}
                color="#3a3a42"
                lineWidth={0.4}
                transparent
                opacity={0.25}
              />
            )}
          </group>
        )
      })}

      {nodes.map((n, i) => (
        <Node
          key={n.item.path}
          item={n.item}
          index={i}
          radius={n.radius}
          angle={n.angle}
          active={active}
          onHover={setHovered}
          onNavigate={onNavigate}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}

export default function CapabilityNetworkScene({ reducedMotion = false, onNavigate }) {
  const [degraded, setDegraded] = useState(false)
  const isMobile = useIsMobile()
  const highQuality = !isMobile && !degraded
  const dpr = useMemo(() => (degraded ? [1, 1] : [1, 1.6]), [degraded])
  const { containerRef, inView } = useCanvasInView()

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.3, 7.5], fov: 38 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0c', 4, 12]} />
          <ambientLight intensity={0.45} />
          <MouseLight intensity={highQuality ? 5 : 2.5} color="#a78bfa" />
          <Network reducedMotion={reducedMotion} onNavigate={onNavigate} />
          <ParticleField count={highQuality ? 300 : 160} radius={5} sparkles={false} />
          <PostFX highQuality={highQuality} />
        </Suspense>
      </Canvas>
    </div>
  )
}
