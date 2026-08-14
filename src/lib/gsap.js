import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

ScrollTrigger.defaults({ markers: false })

export { gsap, ScrollTrigger, SplitText }
