import { cn } from '@/lib/utils';

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-sm font-medium text-ink', className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-ink/20 bg-canvas px-4 text-sm text-ink',
        'placeholder:text-ink/45 focus:border-ink focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}

export function Tag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-band/70 px-3 py-1 text-xs font-medium tracking-wide text-ink',
        className,
      )}
    >
      {children}
    </span>
  );
}
