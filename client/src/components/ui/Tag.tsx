import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TagProps {
  children: ReactNode;
  active?: boolean;
}

export function Tag({ children, active }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block border-[1.5px] px-2 py-0.5 font-mono text-[12px] uppercase tracking-wide',
        active ? 'border-[#111110] bg-amber text-[#111110]' : 'border-line-soft text-ink-dim',
      )}
    >
      {children}
    </span>
  );
}
