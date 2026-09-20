import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentStudent } from '@/lib/student-session';
import { courses } from '@/lib/data';
import { Photo } from '@/components/site/photo';
import { Tag } from '@/components/ui/field';
import { ButtonLink } from '@/components/ui/button';
import { SignOutButton } from '@/components/account/sign-out-button';
import { longDate } from '@/lib/format';

/** Auth-gated: never prerender a signed-out version of this. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your account — Still Point',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const student = await currentStudent();
  if (!student) redirect('/account/login');

  const enrolled = student.enrolments
    .map((enrolment) => ({
      enrolment,
      course: courses.find((c) => c.slug === enrolment.courseSlug),
    }))
    .filter((entry) => entry.course !== undefined);

  return (
    <div className='mx-auto max-w-5xl px-6 py-16'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='text-xs tracking-[0.2em] uppercase opacity-70'>
            Your account
          </p>
          <h1 className='mt-3 text-4xl sm:text-5xl'>
            Hello, {student.name.split(' ')[0]}.
          </h1>
        </div>
        <SignOutButton />
      </div>

      {enrolled.length === 0 ? (
        <div className='mt-12 rounded-card bg-surface p-8'>
          <h2 className='font-display text-2xl font-light'>
            Nothing here yet.
          </h2>
          <p className='mt-3 max-w-lg leading-relaxed opacity-85'>
            Your account is made. When you buy a course with this email address,
            it will appear here with all of its recordings.
          </p>
          <ButtonLink href='/courses' className='mt-6'>
            See the courses
          </ButtonLink>
        </div>
      ) : (
        <>
          <h2 className='mt-14 text-2xl'>Your courses</h2>
          <div className='mt-6 grid gap-6 sm:grid-cols-2'>
            {enrolled.map(({ enrolment, course }) => {
              const total = course!.modules.length;
              const done = enrolment.completedWeeks.length;
              return (
                <Link
                  key={course!.slug}
                  href={`/account/courses/${course!.slug}`}
                  className='group flex flex-col overflow-hidden rounded-card bg-surface transition-colors hover:bg-surface/70'
                >
                  <Photo
                    id={course!.photoId}
                    ratio='aspect-[3/2]'
                    sizes='(max-width: 640px) 100vw, 50vw'
                  />
                  <div className='flex flex-1 flex-col p-6'>
                    <div className='flex flex-wrap gap-2'>
                      <Tag>
                        {enrolment.weeksReleased} of {total} weeks released
                      </Tag>
                    </div>
                    <h3 className='mt-4 font-display text-2xl font-light'>
                      {course!.title}
                    </h3>
                    <p className='mt-2 text-sm opacity-80'>
                      Started {longDate(enrolment.startedOn)}
                    </p>

                    <div className='mt-5 flex-1'>
                      <div className='flex items-baseline justify-between text-xs opacity-75'>
                        <span>Your progress</span>
                        <span className='tabular-nums'>
                          {done} / {total}
                        </span>
                      </div>
                      <div className='mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas'>
                        <div
                          className='h-full rounded-full bg-ink'
                          style={{ width: `${(done / total) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className='mt-6 border-t border-ink/10 pt-4 text-sm underline-offset-4 group-hover:underline'>
                      Continue →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className='mt-14 rounded-card border border-ink/15 p-6 text-sm leading-relaxed opacity-85'>
        <p className='font-medium opacity-100'>Keeping your recordings</p>
        <p className='mt-2'>
          Every course stays available to you for a year from the day it began.
          They are for you — please do not share or repost them, since the
          courses are priced on the assumption that people buy their own.
        </p>
      </div>
    </div>
  );
}
