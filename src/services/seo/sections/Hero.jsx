import HeroShell from '../../shared/components/HeroShell'
import SearchHeroScene from '../canvas/SearchHeroScene'
import { hero } from '../data'

export default function Hero() {
  return <HeroShell id="seo-hero" hero={hero} Scene={SearchHeroScene} />
}
