import HeroShell from '../../shared/components/HeroShell'
import ContentHeroScene from '../canvas/ContentHeroScene'
import { hero } from '../data'

export default function Hero() {
  return <HeroShell id="sm-hero" hero={hero} Scene={ContentHeroScene} />
}
