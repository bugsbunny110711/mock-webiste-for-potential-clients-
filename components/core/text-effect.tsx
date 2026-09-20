'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

type Preset = 'blur' | 'fade' | 'slide';

const presets: Record<Preset, { container: Variants; item: Variants }> = {
  blur: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.055 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
      },
    },
  },
  fade: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.045 } } },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    },
  },
  slide: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.045 } } },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    },
  },
};

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char';
  as?: React.ElementType;
  preset?: Preset;
  className?: string;
  delay?: number;
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  preset = 'blur',
  className,
  delay = 0,
}: TextEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = as as React.ElementType;

  // The text is always in the DOM as real text — screen readers and crawlers
  // read it whether or not it has animated in yet.
  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const units = per === 'word' ? children.split(' ') : children.split('');
  const { container, item } = presets[preset];
  const MotionComponent = motion[
    as as keyof typeof motion
  ] as typeof motion.div;

  return (
    <MotionComponent
      initial='hidden'
      animate='visible'
      variants={{
        ...container,
        visible: {
          ...container.visible,
          transition: {
            ...(container.visible as { transition?: object })?.transition,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
      aria-label={children}
    >
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          variants={item}
          aria-hidden
          className='inline-block whitespace-pre'
        >
          {unit}
          {per === 'word' && i < units.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
