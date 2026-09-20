import type { Metadata } from 'next';
import { BookingDialog } from '@/components/site/booking-dialog';
import { Faq } from '@/components/site/faq';
import { sessionTypes } from '@/lib/data';
import { gbp } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Book a session — Maya Ellison',
  description:
    'Book a one-to-one breathwork or yoga session with Maya Ellison. No course required.',
};

export default function BookPage() {
  return (
    <>
      <section className='mx-auto max-w-6xl px-6 py-20'>
        <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
          Work with me directly.
        </h1>
        <p className='mt-6 max-w-xl text-lg opacity-85'>
          No course required, no package to commit to. Pick a length that suits,
          choose a time, and we will start with whatever you arrive with.
        </p>

        <div className='mt-14 grid gap-5 md:grid-cols-3'>
          {sessionTypes.map((session) => (
            <div
              key={session.id}
              className='flex flex-col rounded-card bg-surface p-7'
            >
              <div className='flex items-baseline justify-between gap-3'>
                <h2 className='font-display text-2xl font-light'>{session.name}</h2>
                <span className='shrink-0 text-sm opacity-75'>
                  {session.minutes} min
                </span>
              </div>
              <p className='mt-4 flex-1 text-sm leading-relaxed opacity-85'>
                {session.description}
              </p>
              <p className='mt-6 font-display text-3xl font-light'>
                {session.priceGBP === 0 ? 'Free' : gbp(session.priceGBP)}
              </p>
              {/* Each dialog generates its own layoutId, so three triggers on
                  one page cannot morph from each other's buttons. */}
              <BookingDialog sessionType={session} className='mt-6 w-full' />
            </div>
          ))}
        </div>

        <div className='mt-12 rounded-card border border-ink/15 p-6 text-sm leading-relaxed opacity-85'>
          <p className='font-medium opacity-100'>Before you book</p>
          <p className='mt-2'>
            Some breath practices are not suitable during pregnancy, or with
            epilepsy, uncontrolled high blood pressure, glaucoma or a recent
            cardiac event. There is a short health form after checkout, and if
            anything on it gives me pause I will contact you before we meet and
            refund you if we cannot go ahead.
          </p>
        </div>
      </section>

      <section className='border-t border-ink/10 bg-band/25 py-20'>
        <div className='mx-auto max-w-3xl px-6'>
          <h2 className='text-4xl'>Questions people ask.</h2>
          <div className='mt-10'>
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
