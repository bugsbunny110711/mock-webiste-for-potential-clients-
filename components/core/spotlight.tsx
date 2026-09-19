'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
};

/**
 * Ambient warm light for the hero (DESIGN.md §4) — the grid pattern from the
 * source reference is deliberately gone; it reads as a developer tool.
 * Touch devices have no cursor, so they get the light parked off-centre-left
 * rather than a dead flat panel.
 */
export function Spotlight({ className, size = 640 }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isPointerFine = useMediaQuery('(pointer: fine)');
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 110, damping: 26 });
  const springY = useSpring(y, { stiffness: 110, damping: 26 });

  const handleMove = useCallback(
    (event: MouseEvent) => {
      const parent = ref.current?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      x.set(event.clientX - rect.left - size / 2);
      y.set(event.clientY - rect.top - size / 2);
    },
    [size, x, y],
  );

  useEffect(() => {
    if (!isPointerFine || shouldReduceMotion) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    parent.addEventListener('mousemove', handleMove);
    return () => parent.removeEventListener('mousemove', handleMove);
  }, [handleMove, isPointerFine, shouldReduceMotion]);

  const isStatic = !isPointerFine || shouldReduceMotion;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none absolute rounded-full mix-blend-multiply',
        className,
      )}
      style={{
        width: size,
        height: size,
        left: isStatic ? '8%' : undefined,
        top: isStatic ? '10%' : undefined,
        x: isStatic ? undefined : springX,
        y: isStatic ? undefined : springY,
        // A soft falloff with no intermediate stop, so it reads as light across
        // a wall rather than a drawn circle.
        opacity: 0.5,
        filter: 'blur(40px)',
        background:
          'radial-gradient(circle at center, var(--color-muted) 0%, transparent 68%)',
      }}
    />
  );
}
