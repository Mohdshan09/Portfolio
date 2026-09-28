import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from '../ui/ProjectCard';
import type { Project } from '../../content/types';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader index="03" command="$ ls ./projects --featured">
          Selected <em>Work</em>
        </SectionHeader>

        <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
