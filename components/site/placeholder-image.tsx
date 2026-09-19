import { cn } from '@/lib/utils';

/**
 * Stand-in for real photography. Rendered locally as SVG so nothing depends on
 * an image host, and tinted from the brand palette so layouts read correctly.
 * Replace every use of this with real photographs before launch — see README.
 */
export function PlaceholderImage({
  seed,
  className,
  label,
  ratio = 'aspect-[4/5]',
}: {
  seed: number;
  className?: string;
  label?: string;
  ratio?: string;
}) {
  const tints = [
    ['#e1d0bc', '#b9a287'],
    ['#c8c2a9', '#e9e4d9'],
    ['#b9a287', '#e1d0bc'],
    ['#e9e4d9', '#c8c2a9'],
    ['#d6c6b0', '#a8937a'],
  ];
  const [from, to] = tints[seed % tints.length];
  const rotation = (seed * 37) % 180;
  const cx = 30 + ((seed * 17) % 40);
  const cy = 25 + ((seed * 29) % 45);

  return (
    <div className={cn('relative overflow-hidden bg-surface', ratio, className)}>
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid slice'
        className='h-full w-full'
        role='img'
        aria-label={label ?? 'Placeholder image'}
      >
        <defs>
          <linearGradient id={`grad-${seed}`} gradientTransform={`rotate(${rotation} 0.5 0.5)`}>
            <stop offset='0%' stopColor={from} />
            <stop offset='100%' stopColor={to} />
          </linearGradient>
          <radialGradient id={`glow-${seed}`}>
            <stop offset='0%' stopColor='#fff' stopOpacity='0.55' />
            <stop offset='100%' stopColor='#fff' stopOpacity='0' />
          </radialGradient>
        </defs>
        <rect width='100' height='100' fill={`url(#grad-${seed})`} />
        <circle cx={cx} cy={cy} r='38' fill={`url(#glow-${seed})`} />
        <circle cx={cx} cy={cy} r='16' fill='#57401e' opacity='0.06' />
      </svg>
    </div>
  );
}
