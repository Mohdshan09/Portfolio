import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import type { SkillGroup } from '../../content/types';

const CATEGORY_LABELS: Record<SkillGroup['category'], string> = {
  language: 'LANGUAGES',
  framework: 'FRAMEWORKS',
  database: 'DATABASES',
  tool: 'TOOLS',
  concept: 'CONCEPTS',
};

export function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <section className="border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader index="01" command="$ cat skills.json | jq">
          Tool<em>kit</em>
        </SectionHeader>

        <div className="divide-y-2 divide-line-soft border-2 border-line">
          {skills.map((group) => (
            <div
              key={group.category}
              className="grid gap-4 p-5 sm:grid-cols-[160px_1fr] sm:items-center"
            >
              <div className="font-mono text-meta text-ink-mute">
                {CATEGORY_LABELS[group.category]}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
