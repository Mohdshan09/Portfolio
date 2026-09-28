import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '../../lib/buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  if (variant === 'terminal') {
    return (
      <button
        className={cn(
          'font-mono text-ink underline-offset-4 transition-colors duration-150 hover:text-acid-hover hover:underline',
          className,
        )}
        {...props}
      >
        <span className="text-acid">$ </span>
        {children}
      </button>
    );
  }

  return (
    <button className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
    </button>
  );
}
