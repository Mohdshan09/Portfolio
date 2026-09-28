import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({ title, children, className }: TerminalWindowProps) {
  return (
    <div className={cn('brut bg-surface', className)}>
      <div className="flex items-center gap-2 border-b-2 border-line px-4 py-2">
        <span className="h-2.5 w-2.5 bg-signal" />
        <span className="h-2.5 w-2.5 bg-amber" />
        <span className="h-2.5 w-2.5 bg-acid" />
        <span className="ml-2 truncate font-mono text-meta text-ink-dim">{title}</span>
      </div>
      <div className="relative overflow-hidden p-4 font-mono text-sm">
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="relative space-y-1.5">{children}</div>
      </div>
    </div>
  );
}

interface TerminalLineProps {
  prompt?: '$' | '>';
  children: ReactNode;
}

export function TerminalLine({ prompt = '$', children }: TerminalLineProps) {
  return (
    <div className="flex gap-2">
      <span className={prompt === '$' ? 'text-acid' : 'text-ink-dim'}>{prompt}</span>
      <span className={prompt === '$' ? 'text-ink' : 'text-ink-dim'}>{children}</span>
    </div>
  );
}
