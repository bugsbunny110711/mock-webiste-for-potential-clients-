import { cn } from '@/lib/utils';

/** Amie's rule: a shadow ring integrates the surface; a border separates it. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-admin-surface p-5 shadow-[0_0_0_1px_rgba(55,41,55,0.08),0_1px_2px_rgba(55,41,55,0.05)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className='mb-4 flex items-baseline justify-between gap-4'>
      <h2 className='font-sans text-sm font-semibold tracking-tight'>{children}</h2>
      {hint && <span className='text-xs opacity-60'>{hint}</span>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  change,
  direction,
  compare = false,
}: {
  label: string;
  value: string;
  change: string;
  /** Omit for a plain footnote. Supplying it adds an arrow and a semantic tone. */
  direction?: 'up' | 'down';
  /** True only when `change` really is a movement against the previous period. */
  compare?: boolean;
}) {
  if (!direction) {
    return (
      <Card>
        <p className='text-xs tracking-wide opacity-65'>{label}</p>
        <p className='mt-2 text-3xl font-semibold tracking-tight tabular-nums'>
          {value}
        </p>
        <p className='mt-1.5 text-xs opacity-60'>{change}</p>
      </Card>
    );
  }

  const isGood = direction === 'up';
  return (
    <Card>
      <p className='text-xs tracking-wide opacity-65'>{label}</p>
      <p className='mt-2 text-3xl font-semibold tracking-tight tabular-nums'>
        {value}
      </p>
      {/* Direction is carried by an arrow glyph and the words, never by colour
          alone — DESIGN.md §2. */}
      <p
        className={cn(
          'mt-1.5 text-xs font-medium',
          isGood ? 'text-success' : 'text-danger',
        )}
      >
        <span aria-hidden>{isGood ? '↑' : '↓'}</span> {change}
        {compare ? ' on last period' : ''}
      </p>
    </Card>
  );
}

const statusStyles = {
  paid: { label: 'Paid', className: 'bg-success/12 text-success', glyph: '✓' },
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning', glyph: '•' },
  failed: { label: 'Failed', className: 'bg-danger/12 text-danger', glyph: '✕' },
  refunded: { label: 'Refunded', className: 'bg-danger/10 text-danger', glyph: '↩' },
} as const;

export function StatusChip({ status }: { status: keyof typeof statusStyles }) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        style.className,
      )}
    >
      <span aria-hidden>{style.glyph}</span>
      {style.label}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='mb-7 flex flex-wrap items-end justify-between gap-4'>
      <div>
        <h1 className='font-sans text-2xl font-semibold tracking-tight'>{title}</h1>
        {subtitle && <p className='mt-1 text-sm opacity-65'>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
