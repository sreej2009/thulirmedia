import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealWords } from '../../lib/textReveal'
import SectionHeading from '../../components/ui/SectionHeading'

export default function Challenge({ project }) {
  const rootRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = revealWords(textRef.current)
      return () => split?.revert()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="cs-challenge" ref={rootRef} className="relative bg-void py-20 md:py-28">
      <div className="container-px">
        <SectionHeading eyebrow="The Challenge" title="What problem needed solving." align="left" />
        <p ref={textRef} className="mt-10 max-w-3xl text-lg leading-relaxed text-mist md:text-xl">
          {project.challenge}
        </p>
      </div>
    </section>
  )
}
