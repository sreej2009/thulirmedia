import HeroShell from '../../shared/components/HeroShell'
import BrowserHeroScene from '../canvas/BrowserHeroScene'
import { hero } from '../data'

export default function Hero() {
  return <HeroShell id="wd-hero" hero={hero} Scene={BrowserHeroScene} />
}
