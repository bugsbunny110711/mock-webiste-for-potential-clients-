'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Photo } from './photo';
import { BrandMark } from './logo';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * The coach's portrait in the hero, in an arch, drifting as the page scrolls.
 *
 * The picture is oversized inside a fixed frame and moved within it, rather
 * than the frame being moved. Translating the frame itself would drag a gap in
 * behind it at one end of the travel; this way the arch is always full.
 *
 * The arch is the shape rather than a plain rectangle because the hero had no
 * picture at all and a rectangle would have read as a stock block dropped in.
 * It also echoes the rounded vocabulary the dock and cards already use.
 */
export function HeroPortrait({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Sprung so the drift keeps easing for a moment after a flick stops, rather
  // than stopping dead with the wheel.
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });
  // The picture has 12% of slack in the frame, so it can travel 6% either way
  // without ever showing an edge.
  const y = useTransform(progress, [0, 1], ['-4%', '6%']);

  return (
    <div
      ref={ref}
      className={cn(
        'relative mx-auto w-full max-w-[16rem] sm:max-w-xs lg:max-w-none',
        className,
      )}
    >
      <div
        className='relative overflow-hidden border border-ink/10 bg-surface'
        style={{
          aspectRatio: '4 / 5',
          // The arch: a full half-round on top, barely rounded at the foot.
          borderRadius: '999px 999px 24px 24px',
        }}
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

      {/* The monogram sitting on the arch's foot, so the picture reads as part
          of the identity rather than a photograph parked beside the text. */}
      <span
        aria-hidden
        className='absolute -bottom-4 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full border border-ink/10 bg-canvas text-accent shadow-[0_6px_20px_rgb(55_41_55/12%)] lg:-bottom-5 lg:size-14'
      >
        <BrandMark size={22} />
      </span>
    </div>
  );
}
