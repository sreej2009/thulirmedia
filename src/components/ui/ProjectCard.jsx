import TiltCard from './TiltCard'
import ProjectScene from '../canvas/ProjectScene'

export default function ProjectCard({ project, index, className = '' }) {
  return (
    <TiltCard glowColor={project.color} follower="View Project ↗" className={`h-full ${className}`}>
      <div className="flex h-full flex-col p-6">
        <div
          className="relative h-48 overflow-hidden rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${project.color}26, transparent 70%)`,
          }}
        >
          <ProjectScene color={project.color} shape={project.shape} />

          {typeof index === 'number' && (
            <span className="pointer-events-none absolute bottom-3 right-4 font-display text-4xl text-white/10">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-ink transition-colors duration-300 group-hover:text-accent-soft">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-mist">{project.category}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-mist">{project.year}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-mist transition-colors duration-300 group-hover:border-accent-soft/30 group-hover:text-ink"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </TiltCard>
  )
}
