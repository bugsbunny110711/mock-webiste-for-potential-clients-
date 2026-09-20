import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Tag } from '@/components/ui/field';
import { Photo } from '@/components/site/photo';
import { journal } from '@/lib/data';
import { longDate } from '@/lib/format';

export function generateStaticParams() {
  return journal.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = journal.find((p) => p.slug === slug);
  if (!post) return { title: 'Not found — Still Point' };
  return {
    title: `${post.title} — Still Point`,
    description: post.standfirst,
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journal.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = journal.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article>
      <div className='mx-auto max-w-3xl px-6 pt-12'>
        <Link href='/journal' className='text-sm opacity-75 hover:opacity-100'>
          ← Journal
        </Link>

        <div className='mt-8 flex flex-wrap items-center gap-2'>
          <Tag>{post.tag}</Tag>
          <span className='text-xs opacity-70'>
            {post.readingMinutes} min read · {longDate(post.date)}
          </span>
        </div>

        <h1 className='mt-5 text-4xl leading-tight sm:text-5xl'>{post.title}</h1>
        <p className='mt-5 font-display text-xl leading-relaxed font-light opacity-85'>
          {post.standfirst}
        </p>
      </div>

      <div className='mx-auto max-w-4xl px-6'>
        <Photo
          id={post.photoId}
          ratio='aspect-[16/9]'
          className='mt-10 rounded-card'
          sizes='(max-width: 1024px) 100vw, 900px'
        />
      </div>

      <div className='mx-auto max-w-3xl px-6'>
        <div className='mt-12 space-y-6 text-lg leading-relaxed'>
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className='mt-14 rounded-card bg-surface p-7'>
          <h2 className='font-display text-2xl font-light'>
            Want to practise this properly?
          </h2>
          <p className='mt-3 text-sm leading-relaxed opacity-85'>
            Reading about breath does roughly nothing on its own. Breath
            Foundations is six weeks and assumes you know none of this.
          </p>
          <ButtonLink href='/courses/breath-foundations' className='mt-5'>
            See the course
          </ButtonLink>
        </div>

        <div className='mt-14 border-t border-ink/10 pt-8'>
          <h2 className='text-2xl'>More writing</h2>
          <ul className='mt-5 space-y-4'>
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={`/journal/${other.slug}`} className='group block'>
                  <p className='font-display text-xl font-light group-hover:underline'>
                    {other.title}
                  </p>
                  <p className='mt-1 text-sm opacity-80'>{other.standfirst}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
