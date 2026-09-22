import Link from 'next/link';
import { TextEffect } from '@/components/core/text-effect';
import { InView } from '@/components/core/in-view';
import { ScrollPathBackdrop } from '@/components/core/scroll-path';
import { ButtonLink } from '@/components/ui/button';
import { CourseCard } from '@/components/site/course-card';
import { TestimonialCard } from '@/components/site/testimonial-card';
import { HeroPortrait } from '@/components/site/hero-portrait';
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
      {/* The hero's own top padding tapers as the screen widens. The main
          element already pads to clear the fixed bar, so the section's own
          padding is all gap: at its old value that was 156px of nothing under
          the navigation on a laptop. Trimmed at lg, and eased in the middle
          range too, or narrowing a laptop window would jump the gap from 76px
          back to 154px at a single pixel. */}
      <section className='relative overflow-hidden'>
        <div className='relative mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-16 sm:pb-24 lg:pt-8 lg:pb-20'>
          {/* Two columns from lg up: the words carry the weight, the portrait
              gives the page a face above the fold. Below lg the portrait sits
              under the copy rather than beside it, where it would be too small
              to be worth the height. */}
          {/* On a phone the reference interleaves: eyebrow and heading, then
              her picture, then the copy and the buttons. `contents` lets that
              one wrapper vanish on a phone so its two halves become grid items
              that can be ordered around the portrait, and become a single
              column again from lg. */}
          <div className='grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16'>
            <div className='contents lg:block'>
              <div className='order-1 text-center lg:order-none lg:text-left'>
                {/* A pill on a phone and plain small caps on a laptop, which is how the
                    two references each draw it. */}
                <p className='inline-flex items-center rounded-full border border-ink/12 bg-canvas/70 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.18em] uppercase opacity-75 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-[11px]'>
                  {coach.role}
                </p>
                <TextEffect
                  as='h1'
                  per='word'
                  preset='blur'
                  className='mt-5 text-[2.15rem] leading-[1.1] sm:text-[2.7rem] lg:mt-6 lg:text-[3.6rem] lg:leading-[1.08] xl:text-[4.2rem]'
                >
                  Put your nervous system back in your own hands.
                </TextEffect>
              </div>

              <div className='order-3 text-center lg:order-none lg:mt-8 lg:text-left'>
                <p className='mx-auto max-w-xl text-[17px] leading-relaxed opacity-85 lg:mx-0 lg:text-lg'>
                  Breathwork and yoga courses for people who are tired of being
                  told to relax. Practical, unhurried, and short enough that you
                  will actually do them.
                </p>
                <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start'>
                  <ButtonLink href='/courses' size='lg' className='w-full sm:w-auto'>
                    See the courses
                  </ButtonLink>
                  <ButtonLink
                    href='/book'
                    size='lg'
                    variant='secondary'
                    className='w-full sm:w-auto'
                  >
                    Book a one-to-one
                  </ButtonLink>
                </div>
              </div>
            </div>

            <HeroPortrait className='order-2 lg:order-none' />
          </div>

        </div>
      </section>

      {/* The numbers get their own band rather than sitting inside the hero.
          Three claims in a row read as a credential strip; buried under the
          buttons they read as an afterthought. */}
      <section className='border-y border-ink/10 bg-band/30'>
        <dl className='mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 py-10 text-center sm:py-12'>
          {[
            { label: 'Years teaching', value: coach.yearsTeaching },
            { label: 'Training hours', value: `${coach.trainedHours}+` },
            {
              label: 'People taught',
              value: `${coach.studentsTaught.toLocaleString('en-GB')}+`,
            },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className='text-[10px] tracking-[0.18em] uppercase opacity-65 sm:text-xs'>
                {stat.label}
              </dt>
              <dd className='mt-1.5 font-display text-3xl font-light sm:text-4xl'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
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
              {/* The tighter crop, not the hero's frame: the same picture
                  twice within two screens reads as a mistake. */}
              <Photo
                id='coach-portrait-seated'
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
