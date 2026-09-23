'use client';

import { useRef } from 'react';
import { useInView } from 'motion/react';
import { AnimatedNumber } from '@/components/core/animated-number';
import { useMediaQuery } from '@/lib/hooks';

export type HeroStat = {
  label: string;
  value: number;
  /** Written after the number and never animated — '+' does not count up. */
  suffix?: string;
};

/**
 * The credential strip under the hero, counting up as it arrives.
 *
 * It counts when the band scrolls into view rather than on mount. The band
 * sits below the hero — barely peeking on a laptop, well off-screen on a
 * phone — so a count that started at load would be over before anyone looked
 * at it.
 *
 * All three share one duration so the row lands together. Scaling each to its
 * own size would have 11 finish while 1,400 was still in the hundreds, which
 * reads as three separate animations rather than one.
 */
export function HeroStats({ stats }: { stats: HeroStat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  // Motion's own useReducedMotion returns null here rather than a boolean, so
  // a falsy check would silently animate anyway; the media query is read
  // directly instead.
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Handing the final figure straight in leaves the spring initialised there,
  // so it renders settled and never animates — which is what reduced motion
  // wants, and what everyone gets before the band arrives.
  const settled = isInView || shouldReduceMotion;

  return (
    <dl
      ref={ref}
      className='mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 py-10 text-center sm:py-12'
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className='text-[10px] tracking-[0.18em] uppercase opacity-65 sm:text-xs'>
            {stat.label}
          </dt>
          <dd className='mt-1.5 font-display text-3xl font-light sm:text-4xl'>
            {/* The figure a screen reader gets: the real one, once, rather
                than a number changing forty times a second. */}
            <span className='sr-only'>
              {stat.value.toLocaleString('en-GB')}
              {stat.suffix}
            </span>
            <span aria-hidden className='inline-flex items-baseline'>
              <AnimatedNumber
                value={settled ? stat.value : 0}
                springOptions={{ bounce: 0, duration: 1600 }}
              />
              {stat.suffix}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
