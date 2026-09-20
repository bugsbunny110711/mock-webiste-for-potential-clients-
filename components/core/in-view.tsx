'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
  type Variants,
  type Transition,
} from 'motion/react';

type InViewProps = {
  children: React.ReactNode;
  variants?: Variants;
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  className?: string;
};

// DESIGN.md §4: entrances are ~24px of travel, easeOut, and fire once.
const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: 'easeOut' },
  viewOptions = { once: true, margin: '0px 0px -120px 0px' },
  as = 'div',
  className,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const shouldReduceMotion = useReducedMotion();

  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  if (shouldReduceMotion) {
    const Component = as as React.ElementType;
    return (
      <Component ref={ref} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
