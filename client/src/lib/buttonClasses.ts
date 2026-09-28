import { cn } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'terminal';
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-7 text-lg',
};

/** Class list for a primary/secondary button, usable on any element (`<button>`, `<a>`, ...). */
export function buttonClasses(
  variant: Extract<ButtonVariant, 'primary' | 'secondary'>,
  size: ButtonSize = 'md',
) {
  return cn(
    'brut inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wide',
    sizeClasses[size],
    variant === 'primary' && 'border-[#111110] bg-acid text-[#E8E1D2] hover:bg-acid-hover',
    variant === 'secondary' && 'bg-transparent text-ink hover:bg-ink hover:text-bg',
  );
}
