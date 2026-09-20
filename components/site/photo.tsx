import Image from 'next/image';
import { getPhoto, SHOW_BRIEFS, type PhotoId } from '@/lib/photos';
import { cn } from '@/lib/utils';

/** Stable warm tints so each slot looks deliberate rather than broken. */
const TINTS = [
  ['#e1d0bc', '#b9a287'],
  ['#c8c2a9', '#e9e4d9'],
  ['#b9a287', '#e1d0bc'],
  ['#e9e4d9', '#c8c2a9'],
  ['#d6c6b0', '#a8937a'],
];

function seedOf(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * A photograph, or a labelled slot waiting for one. Real photographs are set in
 * lib/photos.ts — see the note at the top of that file.
 */
export function Photo({
  id,
  ratio = 'aspect-[4/5]',
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  id: PhotoId;
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const slot = getPhoto(id);

  if (slot.src) {
    return (
      <div className={cn('relative overflow-hidden bg-surface', ratio, className)}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className='object-cover'
        />
      </div>
    );
  }

  const seed = seedOf(id);
  const [from, to] = TINTS[seed % TINTS.length];
  const rotation = (seed * 37) % 180;
  const cx = 30 + ((seed * 17) % 40);
  const cy = 25 + ((seed * 29) % 45);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface',
        ratio,
        className,
      )}
    >
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid slice'
        className='absolute inset-0 h-full w-full'
        role='img'
        aria-label={`Placeholder for: ${slot.alt}`}
      >
        <defs>
          <linearGradient
            id={`photo-grad-${seed}`}
            gradientTransform={`rotate(${rotation} 0.5 0.5)`}
          >
            <stop offset='0%' stopColor={from} />
            <stop offset='100%' stopColor={to} />
          </linearGradient>
          <radialGradient id={`photo-glow-${seed}`}>
            <stop offset='0%' stopColor='#fff' stopOpacity='0.5' />
            <stop offset='100%' stopColor='#fff' stopOpacity='0' />
          </radialGradient>
        </defs>
        <rect width='100' height='100' fill={`url(#photo-grad-${seed})`} />
        <circle cx={cx} cy={cy} r='38' fill={`url(#photo-glow-${seed})`} />
      </svg>

      {SHOW_BRIEFS && (
        <div className='absolute inset-0 flex flex-col justify-end p-4'>
          <div className='rounded-xl bg-canvas/80 p-3 backdrop-blur-sm'>
            <p className='flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase opacity-70'>
              <svg viewBox='0 0 16 16' className='size-3' aria-hidden>
                <path
                  d='M2 5.5h2.5L5.5 4h5l1 1.5H14v7H2v-7z'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.2'
                  strokeLinejoin='round'
                />
                <circle
                  cx='8'
                  cy='9'
                  r='2.2'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.2'
                />
              </svg>
              Photo slot · {slot.size}
            </p>
            <p className='mt-1 text-xs leading-snug'>{slot.brief}</p>
          </div>
        </div>
      )}
    </div>
  );
}
