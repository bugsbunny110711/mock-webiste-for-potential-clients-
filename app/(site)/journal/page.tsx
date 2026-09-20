import type { Metadata } from 'next';
import Link from 'next/link';
import { InView } from '@/components/core/in-view';
import { Photo } from '@/components/site/photo';
import { Tag } from '@/components/ui/field';
import { SubscribeForm } from '@/components/site/subscribe-form';
import { journal } from '@/lib/data';
import { longDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Journal — Still Point',
  description:
    'Writing on breath physiology, sleep, and teaching breathwork safely. Plainly written, no mysticism.',
};

export default function JournalPage() {
  const [lead, ...rest] = journal;

  return (
    <div className='mx-auto max-w-6xl px-6 py-20'>
      <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
        Things worth writing down.
      </h1>
      <p className='mt-6 max-w-xl text-lg opacity-85'>
        Mostly physiology, mostly practical. If you want the mystical version of
        any of this, there is plenty of it elsewhere.
      </p>

      <InView className='mt-16'>
        <Link
          href={`/journal/${lead.slug}`}
          className='group grid gap-8 overflow-hidden rounded-card bg-surface md:grid-cols-2 md:items-stretch'
        >
          <Photo
            id={lead.photoId}
            ratio='aspect-[16/9] md:aspect-auto md:h-full'
            sizes='(max-width: 768px) 100vw, 50vw'
          />
          <div className='flex flex-col justify-center p-7 md:py-12 md:pr-10 md:pl-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <Tag>{lead.tag}</Tag>
              <span className='text-xs opacity-70'>
                {lead.readingMinutes} min read
              </span>
            </div>
            <h2 className='mt-5 font-display text-3xl leading-tight font-light'>
              {lead.title}
            </h2>
            <p className='mt-3 leading-relaxed opacity-85'>{lead.standfirst}</p>
            <p className='mt-6 text-sm underline-offset-4 group-hover:underline'>
              Read it →
            </p>
          </div>
        </Link>
      </InView>

      <InView className='mt-8 grid gap-6 sm:grid-cols-2'>
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className='group flex flex-col overflow-hidden rounded-card bg-surface transition-colors hover:bg-surface/70'
          >
            <Photo
              id={post.photoId}
              ratio='aspect-[16/9]'
              sizes='(max-width: 640px) 100vw, 50vw'
            />
            <div className='flex flex-1 flex-col p-6'>
              <div className='flex flex-wrap items-center gap-2'>
                <Tag>{post.tag}</Tag>
                <span className='text-xs opacity-70'>
                  {post.readingMinutes} min read
                </span>
              </div>
              <h2 className='mt-4 font-display text-2xl leading-snug font-light'>
                {post.title}
              </h2>
              <p className='mt-2 flex-1 text-sm leading-relaxed opacity-85'>
                {post.standfirst}
              </p>
              <p className='mt-5 border-t border-ink/10 pt-4 text-xs opacity-70'>
                {longDate(post.date)}
              </p>
            </div>
          </Link>
        ))}
      </InView>

      <InView className='mt-16 rounded-card bg-surface p-8'>
        <h2 className='text-3xl'>New writing, now and then</h2>
        <p className='mt-3 mb-6 max-w-xl opacity-85'>
          Roughly monthly. Retreat dates go out here first as well.
        </p>
        <SubscribeForm source='Journal' className='max-w-lg' />
      </InView>
    </div>
  );
}
