'use client';

import { useRef, useState } from 'react';
import { TestimonialCard, type Testimonial } from './testimonial-card';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/** Matches the `gap-4` between cards, for working out which one is in view. */
const GAP = 16;

/**
 * The testimonials as a swipeable row, for phones only.
 *
 * On a phone the masonry collapses to one column, and five cards become a very
 * long scroll past the same kind of thing five times. Side by side they are one
 * card's worth of height with the next one peeking, which reads as 'there are
 * more of these' without costing five screens.
 *
 * Built on scroll-snap rather than a carousel library: the browser already does
 * momentum, rubber-banding and snapping on a touch screen, natively and better.
 * It also means no gradient slide shadows, which the house rules forbid, and no
 * dependency for one section of one page.
 */
export function TestimonialRail({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const stepWidth = () => {
    const first = railRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + GAP : 1;
  };

  // A scroll handler, not an effect: React gives this to us for free and it
  // keeps the layout read out of render.
  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const index = Math.round(rail.scrollLeft / stepWidth());
    const clamped = Math.min(Math.max(index, 0), testimonials.length - 1);
    setActive((previous) => (previous === clamped ? previous : clamped));
  };

  const goTo = (index: number) => {
    railRef.current?.scrollTo({
      left: index * stepWidth(),
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={className}>
      <ul
        ref={railRef}
        onScroll={handleScroll}
        tabIndex={0}
        role='region'
        aria-label='What people say'
        className={cn(
          // Bleeds to the screen edges so a card can sit centred with its
          // neighbour showing, rather than stopping short at the page gutter.
          '-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1',
          // The dots are the scroll indicator; a scrollbar as well is noise.
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className='w-[82%] shrink-0 snap-center'>
            <TestimonialCard testimonial={testimonial} className='h-full' />
          </li>
        ))}
      </ul>

      <div className='mt-5 flex justify-center gap-2'>
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type='button'
            onClick={() => goTo(index)}
            aria-label={`Show testimonial ${index + 1} of ${testimonials.length}`}
            aria-current={index === active}
            className='grid h-8 w-8 place-items-center rounded-full'
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-all duration-200',
                index === active ? 'w-5 bg-accent' : 'w-1.5 bg-ink/25',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
