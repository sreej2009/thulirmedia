import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BrowserObject from './BrowserObject'
import { useCanvasInView } from '../../../hooks/useCanvasInView'

function RigCamera({ progressRef }) {
  useFrame((state) => {
    const targetZ = 6.5 - progressRef.current * 1.6
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function BrowserMorphScene({ progressRef, reducedMotion = false }) {
  const { containerRef, inView } = useCanvasInView()
  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 3, 4]} intensity={1.1} color="#93c5fd" />
          <pointLight position={[-3, -2, -2]} intensity={1} color="#8b5cf6" />
          <RigCamera progressRef={progressRef} />
          <BrowserObject progress={progressRef} mouseReactive={!reducedMotion} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}
