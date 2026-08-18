import HeroShell from '../../shared/components/HeroShell'
import PhoneHeroScene from '../canvas/PhoneHeroScene'
import { hero } from '../data'

export default function Hero() {
  return <HeroShell id="ad-hero" hero={hero} Scene={PhoneHeroScene} />
}
