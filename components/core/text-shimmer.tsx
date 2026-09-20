'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type TextShimmerProps = {
  children: string;
  className?: string;
  duration?: number;
};

/**
 * Loading state only — never decoration (DESIGN.md §4). It loops, so it must
 * stop when the thing it describes finishes.
 *
 * Originally a gradient sweep across the text. This design system has no
 * gradients, so it pulses opacity instead: same "something is happening"
 * signal, one flat colour.
 */
export function TextShimmer({
  children,
  className,
  duration = 1.4,
}: TextShimmerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span className={cn('text-ink/70', className)} aria-live='polite'>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn('inline-block text-ink', className)}
      animate={{ opacity: [1, 0.45, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      aria-live='polite'
      aria-busy='true'
    >
      {children}
    </motion.span>
  );
}
