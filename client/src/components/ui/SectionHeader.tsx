import type { ReactNode } from 'react';

interface SectionHeaderProps {
  index: string;
  command?: string;
  children: ReactNode; // serif title; wrap the emphasis word in <em>
}

export function SectionHeader({ index, command, children }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-meta text-ink-mute">§{index}</span>
        <span className="h-px flex-grow bg-line-soft" />
      </div>
      <h2 className="mt-3 font-serif text-display-l text-ink [&>em]:text-acid">{children}</h2>
      {command && <p className="mt-2 font-mono text-sm text-ink-dim">{command}</p>}
    </div>
  );
}
