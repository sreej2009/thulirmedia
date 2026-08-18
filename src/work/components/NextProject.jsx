import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { coverTransition, setTransitionOrigin } from '../../lib/pageTransition'

export default function NextProject({ project }) {
  const linkRef = useRef(null)
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault()
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      setTransitionOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    await coverTransition(project.accent)
    navigate(`/work/${project.slug}`)
  }

  return (
    <div className="border-t border-line bg-void py-16 md:py-20">
      <div className="container-px flex flex-col items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-mist">Next Project</span>
        <a
          ref={linkRef}
          href={`/work/${project.slug}`}
          onClick={handleClick}
          data-cursor="hover"
          data-cursor-text="Next →"
          className="group font-display text-3xl text-ink transition-colors hover:text-accent-soft md:text-5xl"
        >
          {project.title}
          <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </div>
  )
}
