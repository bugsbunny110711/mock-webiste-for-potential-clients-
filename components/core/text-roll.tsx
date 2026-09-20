'use client';

import { motion, type TargetAndTransition, type Transition } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Text that rolls character by character, after motion-primitives' TextRoll.
 *
 * Each character sits on its own horizontal axis and rotates about it, so the
 * word turns edge-on and vanishes rather than fading. A per-character delay
 * makes the roll travel along the word.
 *
 * Two modes:
 *
 * - **Uncontrolled** (no `rolled`), the documented behaviour: the roll plays
 *   once on mount, two faces deep — the top face rolls away as the bottom face
 *   rolls in, which is what gives the characters their thickness.
 * - **Controlled** (`rolled` passed): the word rolls away and back as that prop
 *   changes. One face is enough here, since the word is returning to a state it
 *   already held rather than arriving for the first time.
 *
 * A rotated character keeps its layout width, so a word rolling away never
 * resizes what it sits in — which is the property the site dock depends on.
 */

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: { initial: TargetAndTransition; animate: TargetAndTransition };
    exit: { initial: TargetAndTransition; animate: TargetAndTransition };
  };
  onAnimationComplete?: () => void;
  /** Controlled mode: true rolls the word away, false rolls it back. */
  rolled?: boolean;
  /**
   * Set where something else already names this text — the dock's links carry
   * an aria-label — so the per-character markup is not announced twice.
   */
  srOnlyHidden?: boolean;
};

const NBSP = ' ';

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (index) => index * 0.1,
  getExitDelay = (index) => index * 0.1 + 0.2,
  className,
  transition = { ease: 'easeIn' },
  variants,
  onAnimationComplete,
  rolled,
  srOnlyHidden = false,
}: TextRollProps) {
  const letters = children.split('');
  const isControlled = rolled !== undefined;

  const defaultVariants = {
    enter: { initial: { rotateX: 0 }, animate: { rotateX: 90 } },
    exit: { initial: { rotateX: 90 }, animate: { rotateX: 0 } },
  } satisfies TextRollProps['variants'];

  return (
    <span className={cn('inline-flex', className)} aria-hidden={srOnlyHidden}>
      {letters.map((letter, index) => {
        const character = letter === ' ' ? NBSP : letter;
        const isLast = index === letters.length - 1;

        if (isControlled) {
          return (
            <span
              key={`${letter}-${index}`}
              className='relative inline-block [perspective:600px] [transform-style:preserve-3d]'
            >
              <motion.span
                className='inline-block [backface-visibility:hidden] [transform-origin:50%_50%]'
                initial={false}
                animate={{ rotateX: rolled ? 90 : 0, opacity: rolled ? 0 : 1 }}
                transition={{
                  ...transition,
                  duration,
                  delay: rolled ? getExitDelay(index) : getEnterDelay(index),
                }}
                onAnimationComplete={isLast ? onAnimationComplete : undefined}
              >
                {character}
              </motion.span>
            </span>
          );
        }

        return (
          <span
            key={`${letter}-${index}`}
            className='relative inline-block [perspective:10000px] [transform-style:preserve-3d]'
          >
            <motion.span
              className='absolute inline-block [backface-visibility:hidden] [transform-origin:50%_25%]'
              initial={variants?.enter.initial ?? defaultVariants.enter.initial}
              animate={variants?.enter.animate ?? defaultVariants.enter.animate}
              transition={{ ...transition, duration, delay: getEnterDelay(index) }}
            >
              {character}
            </motion.span>
            <motion.span
              className='inline-block [backface-visibility:hidden] [transform-origin:50%_100%]'
              initial={variants?.exit.initial ?? defaultVariants.exit.initial}
              animate={variants?.exit.animate ?? defaultVariants.exit.animate}
              transition={{ ...transition, duration, delay: getExitDelay(index) }}
              onAnimationComplete={isLast ? onAnimationComplete : undefined}
            >
              {character}
            </motion.span>
          </span>
        );
      })}
      {!srOnlyHidden && <span className='sr-only'>{children}</span>}
    </span>
  );
}
