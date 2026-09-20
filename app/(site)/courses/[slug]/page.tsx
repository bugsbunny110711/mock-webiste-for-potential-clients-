import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Tag } from '@/components/ui/field';
import { Photo } from '@/components/site/photo';
import { InView } from '@/components/core/in-view';
import { courses } from '@/lib/data';
import { gbp } from '@/lib/format';

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: 'Course not found — Maya Ellison' };
  return {
    title: `${course.title} — Maya Ellison`,
    description: course.tagline,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <article>
      <div className='mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:items-start'>
        <div>
          <div className='flex flex-wrap gap-2'>
            <Tag>{course.level}</Tag>
            <Tag>{course.weeks} weeks</Tag>
            <Tag>{course.sessionsCount} sessions</Tag>
          </div>
          <h1 className='mt-6 text-5xl leading-tight sm:text-6xl'>{course.title}</h1>
          <p className='mt-4 font-display text-2xl font-light opacity-85'>
            {course.tagline}
          </p>
          <p className='mt-8 max-w-xl leading-relaxed opacity-85'>
            {course.description}
          </p>

          <h2 className='mt-14 text-3xl'>What we cover</h2>
          <ol className='mt-6 divide-y divide-ink/10 border-y border-ink/10'>
            {course.modules.map((module) => (
              <li key={module.title} className='py-4'>
                <p className='font-medium'>{module.title}</p>
                <p className='mt-1 text-sm opacity-80'>{module.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Pricing panel — no scroll animation; this is what people came for. */}
        <aside className='rounded-card bg-surface p-7 md:sticky md:top-24'>
          <Photo
            id={course.photoId}
            ratio='aspect-[3/2]'
            className='mb-6 rounded-xl'
            sizes='(max-width: 768px) 100vw, 380px'
          />
          <p className='font-display text-4xl font-light'>{gbp(course.priceGBP)}</p>
          <p className='mt-1 text-sm opacity-75'>{course.format}</p>

          <ul className='mt-6 space-y-2.5 text-sm'>
            {course.includes.map((item) => (
              <li key={item} className='flex gap-3'>
                <span aria-hidden className='opacity-60'>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ButtonLink
            href={`/checkout?course=${course.slug}`}
            size='lg'
            className='mt-7 w-full'
          >
            Enrol — {gbp(course.priceGBP)}
          </ButtonLink>
          <p className='mt-3 text-center text-xs opacity-70'>
            Full refund up to seven days after we begin.
          </p>
          <p className='mt-5 border-t border-ink/10 pt-4 text-xs opacity-75'>
            {course.enrolled.toLocaleString('en-GB')} people have taken this course.
          </p>
        </aside>
      </div>

      <section className='border-t border-ink/10 bg-band/25 py-20'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <InView>
            <h2 className='text-4xl'>Not sure this is the right one?</h2>
            <p className='mt-4 opacity-85'>
              Book a free twenty-minute call. If a different course fits better, or
              none of them do, I will say so.
            </p>
            <ButtonLink href='/book' size='lg' variant='secondary' className='mt-8'>
              Book a discovery call
            </ButtonLink>
          </InView>
        </div>
      </section>
    </article>
  );
}
