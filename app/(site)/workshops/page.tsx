import type { Metadata } from 'next';
import Link from 'next/link';
import { InView } from '@/components/core/in-view';
import { Photo } from '@/components/site/photo';
import { ButtonLink } from '@/components/ui/button';
import { Tag } from '@/components/ui/field';
import { coach, workshops } from '@/lib/data';
import { gbp } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Workshops for teams — Still Point',
  description:
    'Breathwork sessions for workplaces in Bristol and online. Lunchtime sessions, short series, and away-day slots.',
};

export default function WorkshopsPage() {
  return (
    <>
      <section className='mx-auto max-w-6xl px-6 py-20'>
        <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
          For teams who are closer to the edge than they let on.
        </h1>
        <p className='mt-6 max-w-xl text-lg opacity-85'>
          I spent nine years in an organisation that ran people until they broke,
          mine included. These sessions are the practical version: what is
          happening physiologically, and one thing to do about it that fits in a
          working day.
        </p>

        <div className='mt-14 grid gap-5 md:grid-cols-3'>
          {workshops.map((format) => (
            <InView
              key={format.id}
              className='flex flex-col rounded-card bg-surface p-7'
            >
              <div className='flex flex-wrap gap-2'>
                <Tag>{format.minutes} min</Tag>
                <Tag>{format.capacity}</Tag>
              </div>
              <h2 className='mt-5 font-display text-2xl font-light'>
                {format.name}
              </h2>
              <p className='mt-3 flex-1 text-sm leading-relaxed opacity-85'>
                {format.summary}
              </p>
              <ul className='mt-5 space-y-2 text-sm'>
                {format.includes.map((item) => (
                  <li key={item} className='flex gap-3'>
                    <span aria-hidden className='opacity-60'>—</span>
                    <span className='opacity-85'>{item}</span>
                  </li>
                ))}
              </ul>
              <p className='mt-6 border-t border-ink/10 pt-4 text-lg'>
                From {gbp(format.fromGBP)}
              </p>
            </InView>
          ))}
        </div>

        <p className='mt-8 max-w-2xl text-sm leading-relaxed opacity-75'>
          Prices are a starting point, not a quote. They move with group size,
          travel, and whether you want recordings. Charities and public sector
          pay less — ask.
        </p>
      </section>

      <section className='border-y border-ink/10 bg-surface/50 py-20'>
        <div className='mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center'>
          <InView>
            <h2 className='text-4xl'>What I will not do</h2>
            <div className='mt-6 space-y-4 leading-relaxed opacity-85'>
              <p>
                I will not tell your team that breathing fixes an unmanageable
                workload. If the problem is the workload, a breathing exercise is
                a sticking plaster and everyone in the room will know it.
              </p>
              <p>
                I will not run anything that requires people to lie on the floor
                in front of colleagues, or to say anything personal out loud.
                Nobody relaxes while worrying about what they are about to be
                asked to share.
              </p>
              <p>
                I will not pretend a single session changes much. If you want
                something to stick, book the four-week series; if the budget only
                covers one, I will say so and keep the aim modest.
              </p>
            </div>
          </InView>

          <InView>
            <Photo
              id='coach-teaching'
              ratio='aspect-[4/3]'
              className='rounded-card'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </InView>
        </div>
      </section>

      <section className='py-20'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <InView>
            <h2 className='text-4xl'>Tell me about your team.</h2>
            <p className='mt-4 opacity-85'>
              Roughly how many people, what the pressure is, and whether you are
              in {coach.location} or elsewhere. I will come back with something
              specific rather than a brochure.
            </p>
            <ButtonLink href='/contact' size='lg' className='mt-8'>
              Get in touch
            </ButtonLink>
            <p className='mt-6 text-sm opacity-75'>
              Or book a{' '}
              <Link href='/book' className='underline underline-offset-4'>
                discovery call
              </Link>{' '}
              and talk it through.
            </p>
          </InView>
        </div>
      </section>
    </>
  );
}
