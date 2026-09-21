import Link from 'next/link';
import { TextEffect } from '@/components/core/text-effect';
import { InView } from '@/components/core/in-view';
import { ScrollPathBackdrop } from '@/components/core/scroll-path';
import { ButtonLink } from '@/components/ui/button';
import { CourseCard } from '@/components/site/course-card';
import { TestimonialCard } from '@/components/site/testimonial-card';
import { TestimonialRail } from '@/components/site/testimonial-rail';
import { Gallery } from '@/components/site/gallery';
import { Faq } from '@/components/site/faq';
import { Photo } from '@/components/site/photo';
import { coach, courses, testimonials, sessionTypes, retreats, journal } from '@/lib/data';
import { gbp } from '@/lib/format';

export default function HomePage() {
  const featured = courses.filter((course) => course.featured);

  return (
    <>
      {/* Hero — the only text that animates on mount rather than on scroll
          (DESIGN.md §4). The canvas is flat: this system has no gradients. */}
      <section className='relative overflow-hidden'>
        <div className='relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32'>
          <p className='mb-6 text-xs tracking-[0.2em] uppercase opacity-70'>
            {coach.role} · {coach.location}
          </p>
          <TextEffect
            as='h1'
            per='word'
            preset='blur'
            className='max-w-4xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl'
          >
            Put your nervous system back in your own hands.
          </TextEffect>
          <p className='mt-8 max-w-xl text-lg leading-relaxed opacity-85'>
            Breathwork and yoga courses for people who are tired of being told to
            relax. Practical, unhurried, and short enough that you will actually
            do them.
          </p>
          <div className='mt-10 flex flex-wrap gap-3'>
            <ButtonLink href='/courses' size='lg'>
              See the courses
            </ButtonLink>
            <ButtonLink href='/book' size='lg' variant='secondary'>
              Book a one-to-one
            </ButtonLink>
          </div>

          <dl className='mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-ink/15 pt-8'>
            {[
              { label: 'Years teaching', value: coach.yearsTeaching },
              { label: 'Training hours', value: `${coach.trainedHours}+` },
              { label: 'People taught', value: `${coach.studentsTaught.toLocaleString('en-GB')}+` },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className='text-xs tracking-widest uppercase opacity-70'>
                  {stat.label}
                </dt>
                <dd className='mt-1 font-display text-3xl font-light'>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Courses */}
      <section className='border-t border-ink/10 bg-band/25 py-24' id='courses'>
        <div className='mx-auto max-w-6xl px-6'>
          <InView>
            <h2 className='max-w-2xl text-4xl sm:text-5xl'>
              Courses that fit inside a real week.
            </h2>
            <p className='mt-4 max-w-xl opacity-85'>
              Small groups, live online, always recorded. Every course is built so
              that missing a week does not mean falling behind.
            </p>
          </InView>

          <InView className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2'>
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </InView>

          <InView className='mt-10'>
            <Link href='/courses' className='text-sm underline underline-offset-4'>
              All four courses →
            </Link>
          </InView>
        </div>
      </section>

      {/* The scroll-drawn line runs behind this stretch rather than behind a
          single section: three sections give it roughly the height it was
          drawn at, where one would squash it into zigzags. */}
      <ScrollPathBackdrop>
        {/* About strip */}
        <section className='py-24'>
          <div className='mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center'>
            <InView>
              <Photo
                id='coach-portrait'
                ratio='aspect-[4/5]'
                className='rounded-card'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </InView>
            <InView>
              <h2 className='text-4xl sm:text-5xl'>I came to this the long way round.</h2>
              <div className='mt-6 space-y-4 leading-relaxed opacity-85'>
                <p>
                  I spent nine years in hospital project management, and the last two
                  of them with a heart rate that never really came down. Breathwork
                  was the thing that finally moved the needle, after a lot of things
                  that did not.
                </p>
                <p>
                  I teach the way I wish someone had taught me — plainly, without
                  mysticism, and with real attention to who should not be doing what.
                </p>
              </div>
              <Link
                href='/about'
                className='mt-8 inline-block text-sm underline underline-offset-4'
              >
                More about how I work →
              </Link>
            </InView>
          </div>
        </section>

        {/* One-to-one */}
        <section className='border-y border-ink/10 bg-surface/50 py-24'>
          <div className='mx-auto max-w-6xl px-6'>
            <InView>
              <h2 className='max-w-2xl text-4xl sm:text-5xl'>
                Or work with me directly.
              </h2>
              <p className='mt-4 max-w-xl opacity-85'>
                No course required. Book a single session and we will start with
                whatever you actually came with.
              </p>
            </InView>

            <div className='mt-12 grid gap-4 sm:grid-cols-3'>
              {sessionTypes.map((session) => (
                <InView key={session.id} className='rounded-card border border-ink/10 p-6'>
                  <div className='flex items-baseline justify-between'>
                    <h3 className='font-display text-xl font-light'>{session.name}</h3>
                    <span className='text-sm opacity-75'>{session.minutes} min</span>
                  </div>
                  <p className='mt-3 min-h-16 text-sm leading-relaxed opacity-85'>
                    {session.description}
                  </p>
                  <p className='mt-4 text-lg'>
                    {session.priceGBP === 0 ? 'Free' : gbp(session.priceGBP)}
                  </p>
                </InView>
              ))}
            </div>

            <InView className='mt-10'>
              <ButtonLink href='/book' size='lg'>
                Check availability
              </ButtonLink>
            </InView>
          </div>
        </section>

        {/* Testimonials — the only place Tilt is used */}
        <section className='py-24' id='testimonials'>
          <div className='mx-auto max-w-6xl px-6'>
            <InView>
              <h2 className='max-w-2xl text-4xl sm:text-5xl'>
                What people say afterwards.
              </h2>
            </InView>
            {/* Masonry from md up, a swipeable row below it — five cards in
                one column is a very long scroll past the same kind of thing. */}
            <div className='mt-12 hidden gap-4 md:block md:columns-2 lg:columns-3'>
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
            <TestimonialRail
              testimonials={testimonials}
              className='mt-12 md:hidden'
            />
          </div>
        </section>
      </ScrollPathBackdrop>

      {/* Retreats */}
      <section className='border-t border-ink/10 bg-surface/50 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <InView>
            <h2 className='max-w-2xl text-4xl sm:text-5xl'>
              Twice a year, somewhere quieter.
            </h2>
            <p className='mt-4 max-w-xl opacity-85'>
              Small retreats, run rarely on purpose. Both usually fill from the
              mailing list before they are advertised anywhere.
            </p>
          </InView>

          <InView className='mt-12 grid gap-6 sm:grid-cols-2'>
            {retreats.map((retreat) => (
              <Link
                key={retreat.id}
                href={`/retreats/${retreat.slug}`}
                className='group flex flex-col overflow-hidden rounded-card bg-canvas transition-colors hover:bg-canvas/60'
              >
                <Photo
                  id={retreat.photoId}
                  ratio='aspect-[3/2]'
                  sizes='(max-width: 640px) 100vw, 50vw'
                />
                <div className='flex flex-1 flex-col p-6'>
                  <p className='text-xs tracking-widest uppercase opacity-70'>
                    {retreat.location}
                  </p>
                  <h3 className='mt-3 font-display text-2xl font-light'>
                    {retreat.title}
                  </h3>
                  <p className='mt-2 flex-1 text-sm leading-relaxed opacity-85'>
                    {retreat.dates} · {retreat.nights} nights
                  </p>
                  <div className='mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4'>
                    <span className='text-lg'>{gbp(retreat.priceGBP)}</span>
                    <span className='text-sm underline-offset-4 group-hover:underline'>
                      {retreat.spacesLeft} places left →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </InView>
        </div>
      </section>

      {/* Journal */}
      <section className='py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <InView>
            <h2 className='max-w-2xl text-4xl sm:text-5xl'>
              Writing, if you want the reasoning.
            </h2>
          </InView>

          <InView className='mt-12 grid gap-6 sm:grid-cols-3'>
            {journal.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className='group border-t border-ink/15 pt-5'
              >
                <p className='text-xs tracking-widest uppercase opacity-70'>
                  {post.tag} · {post.readingMinutes} min
                </p>
                <h3 className='mt-3 font-display text-xl leading-snug font-light group-hover:underline'>
                  {post.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed opacity-85'>
                  {post.standfirst}
                </p>
              </Link>
            ))}
          </InView>

          <InView className='mt-10'>
            <Link href='/journal' className='text-sm underline underline-offset-4'>
              Everything I have written →
            </Link>
          </InView>
        </div>
      </section>

      {/* Gallery */}
      <section className='border-t border-ink/10 bg-band/25 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <InView>
            <h2 className='max-w-2xl text-4xl sm:text-5xl'>The practice, in practice.</h2>
          </InView>
          <div className='mt-12'>
            <Gallery />
          </div>
        </div>
      </section>

      {/* FAQ — deliberately no scroll animation; people are hunting here */}
      <section className='py-24' id='faq'>
        <div className='mx-auto max-w-3xl px-6'>
          <h2 className='text-4xl sm:text-5xl'>Questions people ask.</h2>
          <div className='mt-10'>
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
