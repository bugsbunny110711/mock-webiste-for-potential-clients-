'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import { motion, useScroll, useSpring, type MotionValue } from 'motion/react';
import { useMediaQuery } from '@/lib/hooks';
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
  // Faint on purpose. The band is wider than the page gutter, so the line
  // runs behind roughly 300px of body copy; at any real strength that is
  // something to read through rather than past.
  opacity = 0.28,
  offset = ['start end', 'end start'],
}: {
  d: string;
  viewBox: string;
  /**
   * The section whose scroll drives the drawing. Required: a ref that is never
   * attached reports no progress at all and fails silently, so there is no
   * useful default to fall back to.
   */
  target: RefObject<HTMLElement | null>;
  className?: string;
  strokeWidth?: number;
  opacity?: number;
  offset?: [string, string];
}) {
  // Motion's own useReducedMotion returns null here rather than a boolean, so
  // a falsy check silently takes the animated branch — and Motion then
  // suppresses the spring under reduced motion, leaving the line drawn at 0%
  // and invisible. Reading the media query directly gives a real boolean.
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const { scrollYProgress } = useScroll({
    target,
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

  const stroke = {
    d,
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeOpacity: opacity,
  };

  return (
    <svg
      viewBox={viewBox}
      fill='none'
      preserveAspectRatio='none'
      aria-hidden
      className={cn('pointer-events-none', className)}
    >
      {shouldReduceMotion ? (
        // A plain path, drawn whole. Handing Motion a static pathLength of 1
        // does not do this — it still initialises the value at 0, so the line
        // never appears at all. Leaving Motion out of it entirely is what
        // actually draws the full stroke.
        <path {...stroke} />
      ) : (
        <motion.path {...stroke} style={{ pathLength }} />
      )}
    </svg>
  );
}

/**
 * The stretch of page a line is drawn behind.
 *
 * The pages are server components and the scroll target has to be a ref, so
 * the ref lives here rather than in the page. It also answers the question of
 * how tall the line is: spanning several sections keeps the path close to its
 * drawn proportions, where one 800px section would squash a 2000-unit viewBox
 * into tight zigzags.
 *
 * `isolate` puts the line above the tinted section backgrounds inside it but
 * below their text, which is the layer a background decoration belongs on.
 */
export function ScrollPathBackdrop({
  children,
  className,
  pathClassName,
  strokeWidth,
  opacity,
}: {
  children: ReactNode;
  className?: string;
  pathClassName?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={cn('relative isolate', className)}>
      <ScrollPath
        d={BREATH_PATH}
        viewBox={BREATH_VIEWBOX}
        target={ref}
        strokeWidth={strokeWidth}
        opacity={opacity}
        className={cn(
          // Hidden on a narrow screen: a third of a phone's width stretched
          // over two thousand pixels of height is not a calm line, it is a
          // zigzag down the side of the text.
          'absolute inset-y-0 right-0 -z-10 hidden h-full w-[34%] text-accent lg:block',
          pathClassName,
        )}
      />
      {children}
    </div>
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
