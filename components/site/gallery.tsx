'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Photo } from './photo';
import type { PhotoId } from '@/lib/photos';

const SLOTS: { id: PhotoId; ratio: string }[] = [
  { id: 'studio-wide', ratio: 'aspect-[3/2]' },
  { id: 'coach-teaching', ratio: 'aspect-[4/5]' },
  { id: 'studio-detail', ratio: 'aspect-square' },
  { id: 'class-group', ratio: 'aspect-[3/2]' },
  { id: 'coach-demonstrating', ratio: 'aspect-[4/5]' },
  { id: 'coach-adjusting', ratio: 'aspect-[3/2]' },
  { id: 'retreat-portugal', ratio: 'aspect-square' },
  { id: 'retreat-devon', ratio: 'aspect-[4/5]' },
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
      className='columns-1 gap-4 sm:columns-2 lg:columns-3'
    >
      {SLOTS.map((slot) => (
        <motion.div
          key={slot.id}
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
          <Photo
            id={slot.id}
            ratio={slot.ratio}
            className='rounded-card'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
