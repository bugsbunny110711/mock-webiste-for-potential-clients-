import Link from 'next/link';
import { coach } from '@/lib/data';

/**
 * With the header gone the site had no name on it and no way back to the home
 * page above the fold. This is the smallest thing that restores both, in the
 * same frosted treatment as the dock.
 */
export function BrandMark() {
  return (
    <div className='pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-between px-3 pt-3 sm:px-5 sm:pt-5'>
      {/* The dock sits last in the DOM, matching where it appears on screen —
          which means a keyboard user would otherwise traverse the whole page
          before reaching the navigation. This jumps them straight there. */}
      <a
        href='#site-navigation'
        className='pointer-events-auto sr-only rounded-full bg-ink px-4 py-2 text-sm text-canvas focus:not-sr-only focus:absolute focus:top-3 focus:left-3'
      >
        Skip to navigation
      </a>

      <Link
        href='/'
        className='pointer-events-auto rounded-full border border-ink/10 bg-canvas/65 px-4 py-2 shadow-[0_6px_24px_rgb(55_41_55/12%)] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-canvas/85'
      >
        <span className='font-display text-base leading-none font-light'>
          {coach.brand}
        </span>
      </Link>

      <Link
        href='/account'
        className='pointer-events-auto rounded-full border border-ink/10 bg-canvas/65 px-4 py-2 text-sm shadow-[0_6px_24px_rgb(55_41_55/12%)] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-canvas/85'
      >
        Account
      </Link>
    </div>
  );
}
