'use client';

import { useRef, type RefObject } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * A stroke that draws itself as the section behind it scrolls past.
 *
 * Motion animates `pathLength` natively — it writes stroke-dasharray and
 * stroke-dashoffset from the path's own measured length, so the line fills in
 * from its start. Setting strokeDashoffset alongside it, as the reference
 * implementation does, applies the same maths a second time and fights it.
 *
 * The progress is run through a spring so the line keeps moving for a moment
 * after a trackpad flick stops, rather than freezing the instant the wheel
 * does. `restDelta` is small because pathLength lives in 0–1, not pixels.
 *
 * Under reduced motion the line is simply drawn in full and never animates:
 * it is decoration, and decoration should not be the thing that moves when
 * someone has asked for less movement.
 */
export function ScrollPath({
  d,
  viewBox,
  target,
  className,
  strokeWidth = 2,
  opacity = 0.5,
  offset = ['start end', 'end start'],
}: {
  d: string;
  viewBox: string;
  /** The section whose scroll drives the drawing. */
  target?: RefObject<HTMLElement | null>;
  className?: string;
  strokeWidth?: number;
  opacity?: number;
  offset?: [string, string];
}) {
  const fallback = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: target ?? fallback,
    // Starts drawing as the section's top reaches the bottom of the viewport
    // and finishes as its bottom leaves the top, so the whole pass is used
    // rather than only the part where the section is already centred.
    offset: offset as never,
  });

  const pathLength: MotionValue<number> | number = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });

  return (
    <svg
      viewBox={viewBox}
      fill='none'
      preserveAspectRatio='none'
      aria-hidden
      className={cn('pointer-events-none', className)}
    >
      <motion.path
        d={d}
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeOpacity={opacity}
        style={shouldReduceMotion ? { pathLength: 1 } : { pathLength }}
      />
    </svg>
  );
}

/**
 * The house path: a slow serpentine that descends without ever crossing or
 * knotting itself. The reference drew a tangle of loops, which reads as
 * energy — the wrong thing entirely on a site whose subject is settling a
 * nervous system down.
 */
export const BREATH_PATH =
  'M 210.0 0.0 C 210.0 157.1, 340.9 128.6, 340.9 285.7 C 340.9 442.8, 210.0 414.3, 210.0 571.4 C 210.0 728.5, 81.9 700.0, 81.9 857.1 C 81.9 1014.3, 210.0 985.7, 210.0 1142.9 C 210.0 1300.0, 241.4 1271.5, 241.4 1428.6 C 241.4 1585.7, 210.0 1557.2, 210.0 1714.3 C 210.0 1871.4, 170.1 1842.9, 170.1 2000.0';
export const BREATH_VIEWBOX = '0 0 420 2000';
