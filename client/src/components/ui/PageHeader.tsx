import type { ReactNode } from 'react';

interface PageHeaderProps {
  kicker: string;
  command?: string;
  children: ReactNode; // serif title; wrap the emphasis word in <em>
  meta?: ReactNode;
}

/** Top-of-page header for standalone pages — the h1 counterpart of SectionHeader. */
export function PageHeader({ kicker, command, children, meta }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-4">
        <span className="font-mono text-meta text-ink-mute">{kicker}</span>
        <span className="h-px flex-grow bg-line-soft" />
      </div>
      <h1 className="mt-3 font-serif text-display-l text-ink [&>em]:text-acid">{children}</h1>
      {command && <p className="mt-3 font-mono text-sm text-ink-dim">{command}</p>}
      {meta && <div className="mt-4 font-mono text-meta text-ink-mute">{meta}</div>}
    </header>
  );
}
