import { coach } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * The Maya Ellison identity, from the design handoff.
 *
 * Direction 1A: the ME ligature monogram — an M and an E sharing a stem, drawn
 * as one continuous breath stroke. The handoff offered a second direction (1B,
 * an enclosed breath circle); everything here draws from `markPaths`, so
 * swapping directions is a change to that one constant.
 *
 * The mark is stroke-only and inherits `currentColor`, so it takes the colour
 * of whatever it sits in rather than carrying its own. The handoff's palette is
 * close to this site's but not the same, and a second near-identical red would
 * read as a mistake rather than a brand.
 */

const markPaths = [
  // The M: up the left stem, over the two peaks, down the shared right stem.
  'M18 74 V38 C18 30 27 28 31 36 L38 50 C40 54 44 54 46 50 L53 36 C57 28 66 30 66 38 V74',
  // The E's three arms, hung off the stem the M ends on.
  'M66 38 H88',
  'M66 56 H82',
  'M66 74 C74 74 80 73 90 67',
];

/**
 * Optical compensation, carried over from the handoff: it draws the mark at
 * 5.5 when large and 6.5 at its 34px small-size test, because a hairline that
 * reads as elegant at 100px reads as broken at 24px.
 */
function strokeFor(size: number) {
  return size < 40 ? 6.5 : 5.5;
}

export function BrandMark({
  size = 34,
  strokeWidth,
  className,
  title,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Only set this where the mark is the sole naming of the link. */
  title?: string;
}) {
  return (
    <svg
      viewBox='0 0 100 100'
      width={size}
      height={size}
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth ?? strokeFor(size)}
      strokeLinecap='round'
      strokeLinejoin='round'
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn('shrink-0', className)}
    >
      {markPaths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * The wordmark on its own — the light serif at wide tracking, as drawn.
 */
export function BrandWordmark({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-display leading-none font-light tracking-[0.1em] whitespace-nowrap',
        className,
      )}
    >
      {coach.brand}
    </span>
  );
}

/**
 * The tagline that sits under the wordmark in the stacked lockups.
 *
 * The handoff tracks this at .34em. That is 41 characters of very open spacing,
 * so it is stepped down on a phone rather than allowed to wrap mid-discipline.
 *
 * The space before each separator is made non-breaking, because the default
 * break opportunity there lets a line start with a dangling '· mindfulness'.
 * Bound this way a line can only end after a separator, which is how a run-in
 * list is meant to break, and `text-balance` keeps the two lines even.
 */
export function BrandTagline({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-[10px] text-balance uppercase tracking-[0.2em] sm:tracking-[0.34em]',
        className,
      )}
    >
      {coach.tagline.replace(/ · /g, '\u00a0· ')}
    </span>
  );
}

/**
 * Horizontal lockup: mark, hairline rule, wordmark over tagline.
 *
 * `rule` and `tagline` are the parts the handoff drops as the lockup gets
 * smaller, so both are opt-in rather than always drawn.
 */
export function BrandLockup({
  size = 34,
  rule = false,
  tagline = false,
  wordmarkClassName,
  className,
}: {
  size?: number;
  rule?: boolean;
  tagline?: boolean;
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center gap-3.5', className)}>
      <BrandMark size={size} />
      {rule && (
        <span
          aria-hidden
          className='w-px self-stretch bg-current opacity-20'
        />
      )}
      <span className='flex flex-col gap-1.5'>
        <BrandWordmark className={wordmarkClassName} />
        {tagline && <BrandTagline className='opacity-80' />}
      </span>
    </span>
  );
}

/**
 * Stacked lockup, centred — the handoff's card treatment, for the auth screens
 * where the identity is the only thing on the page above the form.
 */
export function BrandStack({
  size = 64,
  tagline = true,
  className,
}: {
  size?: number;
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('flex flex-col items-center gap-5 text-center', className)}>
      <BrandMark size={size} />
      <span className='flex flex-col items-center gap-3'>
        <BrandWordmark className='text-3xl' />
        {tagline && <BrandTagline className='opacity-75' />}
      </span>
    </span>
  );
}

/**
 * The round badge — the mark reversed out of a filled disc. Used where the
 * identity has to hold a fixed square: the admin rail and the app icon.
 */
export function BrandBadge({
  size = 34,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-accent text-canvas',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <BrandMark size={Math.round(size * 0.62)} />
    </span>
  );
}
