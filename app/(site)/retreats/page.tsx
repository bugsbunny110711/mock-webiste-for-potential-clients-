import type { Metadata } from 'next';
import Link from 'next/link';
import { InView } from '@/components/core/in-view';
import { Photo } from '@/components/site/photo';
import { Tag } from '@/components/ui/field';
import { SubscribeForm } from '@/components/site/subscribe-form';
import { retreats } from '@/lib/data';
import { gbp } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Retreats — Maya Ellison',
  description:
    'Two retreats a year: a slow week in the Alentejo and a short winter weekend on Dartmoor. Small groups, good food, nothing much scheduled.',
};

export default function RetreatsPage() {
  return (
    <div className='mx-auto max-w-6xl px-6 py-20'>
      <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
        Two retreats a year, and no more.
      </h1>
      <p className='mt-6 max-w-xl text-lg opacity-85'>
        I keep these small and I run them rarely, because a retreat that happens
        every six weeks stops being one. Both fill from the mailing list before
        they ever get advertised.
      </p>

      <div className='mt-16 space-y-8'>
        {retreats.map((retreat) => (
          <InView key={retreat.id}>
            <article className='grid gap-8 overflow-hidden rounded-card bg-surface md:grid-cols-2 md:items-stretch'>
              <Photo
                id={retreat.photoId}
                ratio='aspect-[3/2] md:aspect-auto md:h-full'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              <div className='flex flex-col p-7 md:py-10 md:pr-10 md:pl-0'>
                <div className='flex flex-wrap gap-2'>
                  <Tag>{retreat.location}</Tag>
                  <Tag>{retreat.nights} nights</Tag>
                  {retreat.spacesLeft <= 5 && (
                    <Tag>{retreat.spacesLeft} spaces left</Tag>
                  )}
                </div>
                <h2 className='mt-5 font-display text-3xl font-light'>
                  {retreat.title}
                </h2>
                <p className='mt-1 text-sm opacity-75'>{retreat.dates}</p>
                <p className='mt-4 flex-1 leading-relaxed opacity-85'>
                  {retreat.summary}
                </p>
                <div className='mt-7 flex items-baseline justify-between border-t border-ink/10 pt-5'>
                  <span className='text-xl'>{gbp(retreat.priceGBP)}</span>
                  <Link
                    href={`/retreats/${retreat.slug}`}
                    className='text-sm underline underline-offset-4'
                  >
                    The full week →
                  </Link>
                </div>
              </div>
            </article>
          </InView>
        ))}
      </div>

      <InView className='mt-16 rounded-card border border-ink/15 p-8'>
        <h2 className='text-3xl'>Hear about the next one first</h2>
        <p className='mt-3 mb-6 max-w-xl opacity-85'>
          Retreats go to the mailing list a month before they go anywhere else,
          and they usually fill from it.
        </p>
        <SubscribeForm source='Retreat page' className='max-w-lg' />
      </InView>
    </div>
  );
}
