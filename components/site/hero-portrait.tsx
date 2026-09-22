'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Photo } from './photo';
import { coach, heroCohort } from '@/lib/data';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';

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
        'relative mx-auto w-full max-w-[17rem] sm:max-w-sm lg:max-w-none',
        className,
      )}
    >
      <div
        className='relative overflow-hidden rounded-[2rem] border border-ink/10 bg-surface sm:rounded-[2.5rem]'
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
            sizes='(max-width: 1023px) 80vw, 40vw'
            className='h-full'
          />
        </motion.div>
      </div>

      {/* Where she is. Small, dark, out of the way of her face. */}
      <span className='absolute top-4 right-4 flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-medium text-canvas backdrop-blur-sm sm:top-5 sm:right-5'>
        <span aria-hidden className='size-1.5 rounded-full bg-muted' />
        {coach.location}
      </span>

      {/* The next cohort, read from the course data rather than typed here, so
          the places-left claim cannot quietly go stale. Absent entirely once
          the cohort fills. */}
      {cohort && (
        <Link
          href={`/courses/${cohort.course.slug}`}
          className='absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-ink/10 bg-canvas px-3.5 py-3 shadow-[0_10px_30px_rgb(55_41_55/14%)] transition-colors hover:bg-band/60 sm:left-4'
        >
          <span
            aria-hidden
            className='grid size-9 shrink-0 place-items-center rounded-xl bg-muted/45 font-display text-sm font-medium text-ink'
          >
            {cohort.capacity}
          </span>
          <span className='leading-tight'>
            <span className='block text-[9.5px] font-medium tracking-[0.16em] text-ink/60 uppercase'>
              Live autumn cohort
            </span>
            <span className='mt-0.5 block text-[13px] font-medium text-ink'>
              Starts {cohort.starts} · {cohort.left} spots left
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}
