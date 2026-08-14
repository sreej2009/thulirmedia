import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

const caOffset = new Vector2(0.0006, 0.0006)

export default function PostFX({ highQuality = true }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={highQuality ? 0.9 : 0.5}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      {highQuality && (
        <ChromaticAberration offset={caOffset} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
      )}
      <Vignette eskil={false} offset={0.28} darkness={0.65} />
    </EffectComposer>
  )
}
