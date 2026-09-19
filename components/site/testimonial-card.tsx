'use client';

import { Tilt } from '@/components/core/tilt';

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Tilt rotationFactor={6} isRevese className='mb-4 break-inside-avoid'>
      <figure className='rounded-card border border-ink/10 bg-surface p-6'>
        <blockquote className='font-display text-lg leading-relaxed font-light'>
          “{testimonial.quote}”
        </blockquote>
        <figcaption className='mt-5 flex items-center gap-3 border-t border-ink/10 pt-4'>
          <span
            aria-hidden
            className='grid size-10 shrink-0 place-items-center rounded-full bg-muted/50 text-sm font-medium'
          >
            {testimonial.name.charAt(0)}
          </span>
          <span className='text-sm'>
            <span className='block font-medium'>{testimonial.name}</span>
            <span className='block opacity-75'>{testimonial.context}</span>
          </span>
        </figcaption>
      </figure>
    </Tilt>
  );
}
