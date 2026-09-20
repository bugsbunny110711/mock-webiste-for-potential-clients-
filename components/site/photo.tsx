import Image from 'next/image';
import { getPhoto, SHOW_BRIEFS, type PhotoId } from '@/lib/photos';
import { cn } from '@/lib/utils';

/**
 * Flat brand tints, one per slot, so a placeholder looks deliberate rather than
 * broken. Solid fills only — no gradients anywhere in this design system.
 */
const TINTS = ['#c0d5d6', '#d3dbda', '#a58d66', '#407e8c', '#083a4f'];

/** Tints dark enough that the brief needs light text over them. */
const DARK_TINTS = new Set(['#407e8c', '#083a4f']);

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
  hideBrief = false,
}: {
  id: PhotoId;
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** For decorative uses where something is layered on top of the image. */
  hideBrief?: boolean;
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
  const tint = TINTS[seed % TINTS.length];
  const isDark = DARK_TINTS.has(tint);

  return (
    <div
      className={cn('relative overflow-hidden', ratio, className)}
      style={{ backgroundColor: tint }}
      role='img'
      aria-label={`Placeholder for: ${slot.alt}`}
    >
      {SHOW_BRIEFS && !hideBrief && (
        <div className='absolute inset-0 flex flex-col justify-end p-4'>
          <div
            className={cn(
              'rounded-xl p-3',
              isDark ? 'bg-ink/80 text-canvas' : 'bg-canvas/85 text-ink',
            )}
          >
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
