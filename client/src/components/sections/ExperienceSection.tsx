import { SectionHeader } from '../ui/SectionHeader';
import { Timeline } from '../ui/Timeline';
import type { Experience } from '../../content/types';

export function ExperienceSection({ items }: { items: Experience[] }) {
  return (
    <section id="experience" className="border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader index="02" command="$ cat experience.log">
          Work <em>History</em>
        </SectionHeader>
        <Timeline items={items} />
      </div>
    </section>
  );
}
