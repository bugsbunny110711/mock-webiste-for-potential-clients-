import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Tag } from '@/components/ui/field';
import { Photo } from '@/components/site/photo';
import { InView } from '@/components/core/in-view';
import { retreats } from '@/lib/data';
import { gbp } from '@/lib/format';

export function generateStaticParams() {
  return retreats.map((retreat) => ({ slug: retreat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const retreat = retreats.find((r) => r.slug === slug);
  if (!retreat) return { title: 'Retreat not found — Maya Ellison' };
  return {
    title: `${retreat.title} — Maya Ellison`,
    description: retreat.summary,
  };
}

export default async function RetreatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const retreat = retreats.find((r) => r.slug === slug);
  if (!retreat) notFound();

  return (
    <article>
      <div className='mx-auto max-w-6xl px-6 pt-12'>
        <Link href='/retreats' className='text-sm opacity-75 hover:opacity-100'>
          ← All retreats
        </Link>
      </div>

      <div className='mx-auto grid max-w-6xl gap-12 px-6 py-10 md:grid-cols-[1.2fr_1fr] md:items-start'>
        <div>
          <div className='flex flex-wrap gap-2'>
            <Tag>{retreat.location}</Tag>
            <Tag>{retreat.nights} nights</Tag>
            <Tag>Capped at {retreat.spaces}</Tag>
          </div>
          <h1 className='mt-6 text-5xl leading-tight sm:text-6xl'>
            {retreat.title}
          </h1>
          <p className='mt-3 font-display text-2xl font-light opacity-85'>
            {retreat.dates}
          </p>
          <p className='mt-8 max-w-xl leading-relaxed opacity-85'>
            {retreat.description}
          </p>

          <Photo
            id={retreat.photoId}
            ratio='aspect-[3/2]'
            className='mt-10 rounded-card'
            sizes='(max-width: 768px) 100vw, 60vw'
          />

          <h2 className='mt-14 text-3xl'>A day, roughly</h2>
          <ol className='mt-6 divide-y divide-ink/10 border-y border-ink/10'>
            {retreat.day.map((entry) => (
              <li key={entry.time} className='flex gap-6 py-4'>
                <span className='w-28 shrink-0 text-sm tabular-nums opacity-70'>
                  {entry.time}
                </span>
                <span className='text-sm'>{entry.what}</span>
              </li>
            ))}
          </ol>
          <p className='mt-4 text-sm opacity-70'>
            Nothing on this list is compulsory. People who sleep through the
            morning practice are not in trouble.
          </p>
        </div>

        <aside className='rounded-card bg-surface p-7 md:sticky md:top-24'>
          <p className='font-display text-4xl font-light'>
            {gbp(retreat.priceGBP)}
          </p>
          <p className='mt-1 text-sm opacity-75'>
            Per person, everything included
          </p>

          <ul className='mt-6 space-y-2.5 text-sm'>
            {retreat.includes.map((item) => (
              <li key={item} className='flex gap-3'>
                <span aria-hidden className='opacity-60'>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ButtonLink href='/contact' size='lg' className='mt-7 w-full'>
            Ask about a place
          </ButtonLink>
          <p className='mt-3 text-center text-xs opacity-70'>
            {retreat.spacesLeft} of {retreat.spaces} places left
          </p>
          <p className='mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed opacity-75'>
            Retreats are booked by conversation rather than a checkout button —
            I want to know a little about you first, and you should be able to
            ask me things before committing to a week.
          </p>
        </aside>
      </div>

      <section className='border-t border-ink/10 bg-band/25 py-20'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <InView>
            <h2 className='text-4xl'>Not ready for a whole week?</h2>
            <p className='mt-4 opacity-85'>
              Most people arrive at a retreat having done a course first. That is
              the usual order, and it works better.
            </p>
            <ButtonLink href='/courses' size='lg' variant='secondary' className='mt-8'>
              See the courses
            </ButtonLink>
          </InView>
        </div>
      </section>
    </article>
  );
}
