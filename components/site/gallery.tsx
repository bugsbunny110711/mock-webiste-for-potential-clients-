'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { PlaceholderImage } from './placeholder-image';

const captions = [
  'Morning practice, studio',
  'Breath workshop, Bristol',
  'Restorative shapes',
  'Retreat, Portugal',
  'One-to-one session',
  'Teacher training cohort',
  'Slow Yoga, week six',
  'Winter retreat',
];

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
      className='columns-2 gap-4 sm:columns-3'
    >
      {captions.map((caption, index) => (
        <motion.figure
          key={caption}
          variants={{
            hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.5, ease: 'easeOut' },
            },
          }}
          className='mb-4 break-inside-avoid'
        >
          <PlaceholderImage
            seed={index + 2}
            ratio={index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'}
            className='rounded-card'
            label={caption}
          />
          <figcaption className='mt-2 text-xs opacity-70'>{caption}</figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}
