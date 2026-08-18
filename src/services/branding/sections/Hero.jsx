import HeroShell from '../../shared/components/HeroShell'
import StudioHeroScene from '../canvas/StudioHeroScene'
import { hero } from '../data'

export default function Hero() {
  return <HeroShell id="br-hero" hero={hero} Scene={StudioHeroScene} />
}
