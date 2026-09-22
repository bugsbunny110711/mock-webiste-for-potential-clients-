'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Photo } from './photo';
import { coach, heroCohort } from '@/lib/data';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import styles from './hero-portrait.module.css';

/**
 * The coach's portrait in the hero, with the two things a visitor most wants
 * to know pinned to it: where she is, and when the next course starts.
 *
 * The picture is oversized inside a fixed frame and moved within it, rather
 * than the frame being moved. Translating the frame itself would drag a gap in
 * behind it at one end of the travel; this way the frame is always full.
 */
export function HeroPortrait({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const cohort = heroCohort();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });
  // The picture has 12% of slack in the frame, so it travels without ever
  // showing an edge.
  const y = useTransform(progress, [0, 1], ['-4%', '6%']);

  return (
    <div
      ref={ref}
      className={cn(
        'relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-none',
        className,
      )}
    >
      {/* The pale ring is a band of canvas, not a border colour, so the frame
          reads as lifted off the page rather than outlined on it. */}
      <div
        className={cn(
          styles.frame,
          'relative bg-canvas p-1.5 shadow-[0_18px_48px_rgb(55_41_55/13%)] sm:p-2',
        )}
      >
        <div
          className={cn(styles.frame, 'relative overflow-hidden bg-surface')}
          style={{ aspectRatio: '4 / 5' }}
        >
          <motion.div
            style={shouldReduceMotion ? undefined : { y }}
            className='absolute inset-x-0 -top-[6%] h-[112%]'
          >
            <Photo
              id='coach-portrait'
              ratio='h-full'
              priority
              hideBrief
              sizes='(max-width: 1023px) 85vw, 40vw'
              className='h-full'
            />
          </motion.div>
        </div>
      </div>

      {/* Where she is. Sat across the frame's right edge, clear of her face. */}
      <span className='absolute top-[9%] right-0 flex translate-x-1 items-center gap-2 rounded-full bg-ink/88 px-3 py-1.5 text-[11px] font-medium text-canvas shadow-[0_4px_14px_rgb(55_41_55/18%)] backdrop-blur-sm'>
        <span aria-hidden className='size-1.5 rounded-full bg-muted' />
        {coach.location}
      </span>

      {/* The next cohort, read from the course data rather than typed here, so
          the places-left claim cannot quietly go stale. Absent entirely once
          the cohort fills. */}
      {cohort && (
        <Link
          href={`/courses/${cohort.course.slug}`}
          className='absolute bottom-[9%] left-0 flex -translate-x-2 items-center gap-3 rounded-2xl border border-ink/8 bg-canvas px-3 py-2.5 shadow-[0_10px_30px_rgb(55_41_55/16%)] transition-colors hover:bg-band/60 sm:-translate-x-3 sm:px-3.5 sm:py-3'
        >
          <span
            aria-hidden
            className='grid size-9 shrink-0 place-items-center rounded-xl bg-muted/40 font-display text-sm font-medium text-ink'
          >
            {cohort.capacity}
          </span>
          <span className='leading-tight'>
            <span className='block text-[9.5px] font-medium tracking-[0.15em] text-ink/60 uppercase'>
              Live autumn cohort
            </span>
            <span className='mt-0.5 block text-[13px] font-medium whitespace-nowrap text-ink'>
              Starts {cohort.starts} · {cohort.left} spots left
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}
