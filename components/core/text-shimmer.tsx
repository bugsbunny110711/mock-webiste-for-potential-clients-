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
      className={cn(
        'inline-block bg-clip-text text-transparent',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--color-muted) 0%, var(--color-muted) 35%, var(--color-ink) 50%, var(--color-muted) 65%, var(--color-muted) 100%)',
        backgroundSize: '250% 100%',
      }}
      animate={{ backgroundPosition: ['150% 0%', '-50% 0%'] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      aria-live='polite'
      aria-busy='true'
    >
      {children}
    </motion.span>
  );
}
