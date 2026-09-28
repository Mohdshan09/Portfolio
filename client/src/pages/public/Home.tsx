import { Hero } from '../../components/sections/Hero';
import { About } from '../../components/sections/About';
import { Skills } from '../../components/sections/Skills';
import { ExperienceSection } from '../../components/sections/ExperienceSection';
import { Projects } from '../../components/sections/Projects';
import { Research } from '../../components/sections/Research';
import { CertificatesEducation } from '../../components/sections/CertificatesEducation';
import { Contact } from '../../components/sections/Contact';
import { LatestDispatches } from '../../components/sections/LatestDispatches';
import { dispatches } from '../../content/dispatches';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  certificates,
  education,
  experience,
  profile,
  projects,
  publication,
  skills,
} from '../../content/data';

export function Home() {
  useDocumentTitle();

  return (
    <main>
      <Hero profile={profile} />
      <About
        profile={profile}
        education={education}
        projectCount={projects.length}
        experienceCount={experience.length}
      />
      <Skills skills={skills} />
      <ExperienceSection items={experience} />
      <Projects projects={projects} />
      <Research publication={publication} />
      <CertificatesEducation certificates={certificates} education={education} />
      <LatestDispatches dispatches={dispatches} />
      <Contact profile={profile} />
    </main>
  );
}
