import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckoutForm } from '@/components/site/checkout-form';
import { courses, sessionTypes } from '@/lib/data';
import { gbp, longDate } from '@/lib/format';
import { SLOT_HOLD_MINUTES } from '@/lib/booking';

export const metadata: Metadata = {
  title: 'Checkout — Still Point',
  robots: { index: false },
};

type SearchParams = {
  course?: string;
  type?: string;
  date?: string;
  time?: string;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { course: courseSlug, type, date, time } = await searchParams;

  const course = courseSlug ? courses.find((c) => c.slug === courseSlug) : undefined;
  const session = type ? sessionTypes.find((s) => s.id === type) : undefined;

  if (!course && !session) notFound();

  const itemName = course?.title ?? session!.name;
  const amountGBP = course?.priceGBP ?? session!.priceGBP;
  const summaryDetail = course
    ? course.format
    : `${session!.minutes} minutes, one to one`;

  return (
    <div className='mx-auto max-w-5xl px-6 py-16'>
      <Link href={course ? `/courses/${course.slug}` : '/book'} className='text-sm opacity-75 hover:opacity-100'>
        ← Back
      </Link>

      <h1 className='mt-6 text-4xl sm:text-5xl'>Checkout</h1>

      <div className='mt-12 grid gap-10 md:grid-cols-[1fr_380px] md:items-start'>
        <div className='order-2 md:order-1'>
          <CheckoutForm
            itemName={itemName}
            amountGBP={amountGBP}
            detail={
              course
                ? 'Full refund up to seven days after the course begins.'
                : 'Free to reschedule up to 24 hours beforehand.'
            }
            date={date}
            time={time}
          />
        </div>

        <aside className='order-1 rounded-card bg-surface p-7 md:order-2 md:sticky md:top-24'>
          <p className='text-xs tracking-widest uppercase opacity-70'>
            Your order
          </p>
          <h2 className='mt-2 font-display text-2xl font-light'>{itemName}</h2>
          <p className='mt-1 text-sm opacity-80'>{summaryDetail}</p>

          {date && time && (
            <div className='mt-5 rounded-xl bg-canvas p-4 text-sm'>
              <p className='font-medium'>{longDate(date)}</p>
              <p className='mt-1 opacity-80'>{time} · UK time</p>
              <p className='mt-3 border-t border-ink/10 pt-3 text-xs opacity-75'>
                This slot is held for you for {SLOT_HOLD_MINUTES} minutes so
                nobody else can take it while you finish.
              </p>
            </div>
          )}

          <dl className='mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm'>
            <div className='flex justify-between'>
              <dt className='opacity-80'>Subtotal</dt>
              <dd>{gbp(amountGBP)}</dd>
            </div>
            <div className='flex justify-between'>
              <dt className='opacity-80'>VAT</dt>
              <dd className='opacity-80'>Not applicable</dd>
            </div>
            <div className='flex justify-between border-t border-ink/10 pt-3 text-lg'>
              <dt>Total</dt>
              <dd>{amountGBP === 0 ? 'Free' : gbp(amountGBP)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
