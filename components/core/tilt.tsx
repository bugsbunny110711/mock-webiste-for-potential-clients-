'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type SpringOptions,
} from 'motion/react';
import { cn } from '@/lib/utils';

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rotationFactor?: number;
  isRevese?: boolean;
  springOptions?: SpringOptions;
};

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 15,
  isRevese = false,
  springOptions = { stiffness: 260, damping: 26 },
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, springOptions);
  const ySpring = useSpring(y, springOptions);

  const scale = isRevese ? -rotationFactor : rotationFactor;

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [scale, -scale]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-scale, scale]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // Coarse pointers have no hover, and a tap would snap the card sideways.
    if (shouldReduceMotion || event.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        ...style,
      }}
      animate={{ scale: isHovered && !shouldReduceMotion ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
