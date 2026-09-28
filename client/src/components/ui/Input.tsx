import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface FieldChrome {
  label: string;
  error?: string;
}

type TerminalInputProps = FieldChrome & InputHTMLAttributes<HTMLInputElement>;
type TerminalTextareaProps = FieldChrome & TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClasses =
  'w-full border-0 border-b-2 border-line bg-transparent px-0 py-2 font-mono text-ink outline-none transition-colors focus:border-acid';

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1 font-mono text-sm text-signal">
      ERR: {error}
    </p>
  );
}

export function TerminalInput({ label, error, id, className, ...props }: TerminalInputProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block font-mono text-sm text-acid">
        {label}:
      </label>
      <input
        id={fieldId}
        className={cn(fieldClasses, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      <FieldError id={fieldId} error={error} />
    </div>
  );
}

export function TerminalTextarea({ label, error, id, className, ...props }: TerminalTextareaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block font-mono text-sm text-acid">
        {label}:
      </label>
      <textarea
        id={fieldId}
        rows={4}
        className={cn(fieldClasses, 'resize-none', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      <FieldError id={fieldId} error={error} />
    </div>
  );
}
