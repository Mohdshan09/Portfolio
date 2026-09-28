import type { Project } from '../../content/types';
import { formatMonthYear } from '../../lib/date';
import { Tag } from './Tag';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noreferrer"
      className="brut group flex h-full flex-col bg-surface"
    >
      <div className="flex items-center justify-between border-b-2 border-line px-4 py-2 font-mono text-meta text-ink-mute">
        <span>
          {String(index).padStart(2, '0')} / {project.featured ? 'FEATURED' : 'PROJECT'}
        </span>
        {project.liveUrl && (
          <span className="flex items-center gap-1.5 text-signal">
            <span className="h-1.5 w-1.5 bg-signal" /> LIVE
          </span>
        )}
      </div>

      <div className="relative aspect-[16/10] grayscale transition-[filter] duration-200 group-hover:grayscale-0">
        <div
          className="absolute inset-0 border-b-2 border-line"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, var(--surface-2) 0 10px, var(--surface) 10px 20px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center border-b-2 border-line font-mono text-meta text-ink-mute">
          [ COVER PENDING ]
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-3xl text-ink">{project.title}</h3>
        <p className="text-sm text-ink-dim">{project.shortDescription}</p>
        <p className="font-mono text-meta text-ink-mute">
          ROLE: {project.role.toUpperCase()} · {formatMonthYear(project.startDate)} —{' '}
          {project.endDate ? formatMonthYear(project.endDate) : 'NOW'}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Tag key={tech}>[{tech.toUpperCase()}]</Tag>
          ))}
        </div>
        <div className="mt-auto pt-2 font-mono text-sm text-ink group-hover:text-acid-hover">
          VIEW LIVE →
        </div>
      </div>
    </a>
  );
}
