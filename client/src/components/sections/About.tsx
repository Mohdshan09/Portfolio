import { StatBlock } from '../ui/StatBlock';
import type { EducationEntry, Profile } from '../../content/types';

interface AboutProps {
  profile: Profile;
  education: EducationEntry[];
  projectCount: number;
  experienceCount: number;
}

export function About({ profile, education, projectCount, experienceCount }: AboutProps) {
  const latestEducation = education[0];

  return (
    <section className="border-b-2 border-line">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12">
        <p className="text-[1.0625rem] leading-[1.65] text-ink-dim first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-acid lg:col-span-7">
          {profile.summary}
        </p>

        <div className="space-y-4 font-mono text-meta text-ink-mute lg:col-span-4 lg:col-start-9">
          {latestEducation && (
            <div>
              EDU: {latestEducation.degree.replace('B.Tech in ', 'B.TECH ')} &apos;
              {String(latestEducation.endYear).slice(2)}
            </div>
          )}
          <div>BASE: {profile.location.toUpperCase()}</div>
          <div>STACK: MERN / NEXT.JS</div>
        </div>
      </div>

      <StatBlock
        stats={[
          { value: String(projectCount), label: 'PRODUCTS SHIPPED' },
          { value: String(experienceCount), label: 'INTERNSHIPS' },
          { value: '1', label: 'PUBLISHED PAPER' },
          { value: latestEducation?.score?.split(' ')[0] ?? '—', label: 'CGPA' },
        ]}
      />
    </section>
  );
}
