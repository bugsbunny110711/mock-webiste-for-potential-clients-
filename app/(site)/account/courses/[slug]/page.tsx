import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { currentStudent } from '@/lib/student-session';
import { toggleWeek } from '@/lib/student-actions';
import { courses } from '@/lib/data';
import { Photo } from '@/components/site/photo';
import { Tag } from '@/components/ui/field';
import { longDate } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Auth-gated: never prerender a signed-out version of this. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your course — Still Point',
  robots: { index: false, follow: false },
};

export default async function AccountCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const student = await currentStudent();
  if (!student) redirect('/account/login');

  const course = courses.find((item) => item.slug === slug);
  const enrolment = student.enrolments.find(
    (item) => item.courseSlug === slug,
  );

  // Not enrolled reads the same as not existing, so the account area cannot be
  // used to discover what other courses are running.
  if (!course || !enrolment) notFound();

  const completed = new Set(enrolment.completedWeeks);
  const nextUp = course.modules.findIndex(
    (_, index) => index < enrolment.weeksReleased && !completed.has(index + 1),
  );

  return (
    <div className='mx-auto max-w-4xl px-6 py-14'>
      <Link href='/account' className='text-sm opacity-75 hover:opacity-100'>
        ← Your account
      </Link>

      <div className='mt-7 flex flex-wrap items-start justify-between gap-6'>
        <div>
          <div className='flex flex-wrap gap-2'>
            <Tag>{course.level}</Tag>
            <Tag>
              {enrolment.weeksReleased} of {course.modules.length} weeks released
            </Tag>
          </div>
          <h1 className='mt-5 text-4xl sm:text-5xl'>{course.title}</h1>
          <p className='mt-3 opacity-80'>
            Started {longDate(enrolment.startedOn)} · {course.format}
          </p>
        </div>

        <Photo
          id={course.photoId}
          ratio='aspect-[3/2]'
          className='w-full max-w-56 rounded-card'
          sizes='224px'
        />
      </div>

      <div className='mt-10 rounded-card bg-surface p-6'>
        <p className='text-sm font-medium'>
          {nextUp === -1
            ? 'You are up to date. The next week unlocks after the live session.'
            : `Next up — ${course.modules[nextUp].title}`}
        </p>
        <p className='mt-1 text-sm opacity-80'>
          {enrolment.completedWeeks.length} of {course.modules.length} weeks
          watched.
        </p>
      </div>

      <h2 className='mt-12 text-2xl'>Sessions</h2>

      <ol className='mt-6 space-y-4'>
        {course.modules.map((module, index) => {
          const week = index + 1;
          const released = week <= enrolment.weeksReleased;
          const isDone = completed.has(week);

          return (
            <li
              key={module.title}
              className={cn(
                'rounded-card border p-5',
                released ? 'border-ink/15' : 'border-dashed border-ink/15',
              )}
            >
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <p
                    className={cn(
                      'font-display text-xl font-light',
                      !released && 'opacity-55',
                    )}
                  >
                    {module.title}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-sm leading-relaxed',
                      released ? 'opacity-85' : 'opacity-50',
                    )}
                  >
                    {module.detail}
                  </p>
                </div>

                {isDone && (
                  <span className='shrink-0 rounded-full bg-band/70 px-3 py-1 text-xs font-medium'>
                    <span aria-hidden>✓</span> Watched
                  </span>
                )}
              </div>

              {released ? (
                <>
                  {/* Stands in for the video player. A real build embeds the
                      hosted recording here, with signed, expiring URLs so a
                      link cannot be passed around. */}
                  <div className='mt-4 grid aspect-video place-items-center rounded-xl bg-ink/90 text-canvas'>
                    <div className='text-center'>
                      <span
                        aria-hidden
                        className='mx-auto grid size-14 place-items-center rounded-full border border-canvas/40'
                      >
                        <svg viewBox='0 0 24 24' className='size-6 translate-x-0.5'>
                          <path d='M8 5v14l11-7z' fill='currentColor' />
                        </svg>
                      </span>
                      <p className='mt-3 text-sm opacity-85'>
                        Recording — week {week}
                      </p>
                      <p className='mt-1 text-xs opacity-60'>
                        Video player goes here
                      </p>
                    </div>
                  </div>

                  <div className='mt-4 flex flex-wrap items-center gap-3'>
                    <form action={toggleWeek}>
                      <input type='hidden' name='courseSlug' value={course.slug} />
                      <input type='hidden' name='week' value={week} />
                      <input
                        type='hidden'
                        name='complete'
                        value={String(!isDone)}
                      />
                      <button
                        type='submit'
                        className='rounded-full border border-ink/25 px-4 py-2 text-sm transition-colors hover:bg-surface'
                      >
                        {isDone ? 'Mark unwatched' : 'Mark watched'}
                      </button>
                    </form>

                    <span className='text-sm opacity-70'>
                      Workbook, week {week} (PDF)
                    </span>
                  </div>
                </>
              ) : (
                <p className='mt-4 text-sm opacity-60'>
                  Unlocks after the live session in week {week}.
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <p className='mt-12 border-t border-ink/10 pt-6 text-sm opacity-75'>
        Available to you until{' '}
        {longDate(
          `${Number(enrolment.startedOn.slice(0, 4)) + 1}${enrolment.startedOn.slice(4)}`,
        )}
        .
      </p>
    </div>
  );
}
