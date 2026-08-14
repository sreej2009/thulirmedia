import { Environment, Lightformer } from '@react-three/drei'
import ParticleField from './ParticleField'
import CentralObject from './CentralObject'
import MouseLight from './MouseLight'
import CameraRig from './CameraRig'
import PostFX from './PostFX'

export default function HeroScene({ highQuality = true }) {
  return (
    <>
      <CameraRig amplitude={highQuality ? 0.6 : 0.3} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 4, 4]} intensity={1.1} color="#c4b5fd" />
      <pointLight position={[-4, -3, -3]} intensity={1.2} color="#3b82f6" />
      <MouseLight intensity={highQuality ? 7 : 3.5} />

      <CentralObject highQuality={highQuality} />
      <ParticleField count={highQuality ? 700 : 350} radius={5.5} sparkles={highQuality} />

      <Environment resolution={128}>
        <Lightformer intensity={2} color="#7c5cd6" position={[3, 2, -2]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.5} color="#3b82f6" position={[-3, -2, -2]} scale={[4, 4, 1]} />
        <Lightformer intensity={1} color="#ffffff" position={[0, 4, 3]} scale={[6, 2, 1]} />
      </Environment>

      <PostFX highQuality={highQuality} />
    </>
  )
}
