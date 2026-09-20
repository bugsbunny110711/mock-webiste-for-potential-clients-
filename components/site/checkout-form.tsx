'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/field';
import { TextShimmer } from '@/components/core/text-shimmer';
import { createCheckout } from '@/lib/payments';
import { gbp, longDate } from '@/lib/format';

const SOURCES = [
  'Instagram',
  'Word of mouth',
  'Google search',
  'Podcast mentions',
  'Newsletter',
  'Direct',
];

const REASONS = [
  'Stress and anxiety',
  'Sleep problems',
  'Burnout / recovery',
  'Injury or chronic pain',
  'Professional development',
  'Curiosity',
];

export function CheckoutForm({
  itemName,
  amountGBP,
  detail,
  date,
  time,
  isCourse = false,
}: {
  itemName: string;
  amountGBP: number;
  detail: string;
  date?: string;
  time?: string;
  /** Courses come with recordings, so they send people to set up an account. */
  isCourse?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [source, setSource] = useState(SOURCES[0]);
  const [reason, setReason] = useState(REASONS[0]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('processing');
    setError(null);

    const result = await createCheckout({
      itemName,
      amountGBP,
      customerEmail: email,
      source,
      reason,
    });

    if (result.ok) {
      setReference(result.reference);
      setStatus('done');
    } else {
      setError(result.message);
      setStatus('idle');
    }
  }

  if (status === 'done' && reference) {
    return (
      <div className='rounded-card bg-surface p-8'>
        <p className='text-xs tracking-widest uppercase opacity-70'>Confirmed</p>
        <h2 className='mt-2 font-display text-3xl font-light'>
          You are booked in.
        </h2>
        <p className='mt-4 leading-relaxed opacity-85'>
          A confirmation is on its way to {email}, with a calendar invitation and
          the health form. Your reference is <strong>{reference}</strong>.
        </p>
        {date && time && (
          <p className='mt-4 rounded-xl bg-canvas p-4 text-sm'>
            {longDate(date)} at {time}
          </p>
        )}

        {isCourse && (
          <div className='mt-6 rounded-xl bg-canvas p-5'>
            <p className='font-medium'>Set up your account</p>
            <p className='mt-2 text-sm leading-relaxed opacity-85'>
              Your recordings live in your account. Create one with{' '}
              <strong>{email}</strong> — the same address you just used — and
              this course will be waiting inside it.
            </p>
            <Link
              href='/account/login'
              className='mt-4 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-canvas transition-colors hover:bg-ink-hover'
            >
              Create your account
            </Link>
          </div>
        )}

        <Link
          href={isCourse ? '/account/login' : '/'}
          className='mt-8 inline-block text-sm underline underline-offset-4'
        >
          {isCourse ? 'Do it later →' : 'Back to the site →'}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Your name</Label>
        <Input
          id='name'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Jane Fielding'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@example.com'
        />
        <p className='text-xs opacity-70'>
          Where the joining link and recordings go.
        </p>
      </div>

      {/* These two answers are what the admin panel's audience view is built
          from — the coach's "why are people coming here" question. */}
      <div className='space-y-2'>
        <Label htmlFor='source'>How did you find me?</Label>
        <select
          id='source'
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className='h-11 w-full rounded-xl border border-ink/20 bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none'
        >
          {SOURCES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='reason'>What brings you here?</Label>
        <select
          id='reason'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className='h-11 w-full rounded-xl border border-ink/20 bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none'
        >
          {REASONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <p className='text-xs opacity-70'>Optional, and it genuinely helps me teach.</p>
      </div>

      <div className='rounded-xl border border-dashed border-ink/25 p-4 text-sm opacity-80'>
        <p className='font-medium opacity-100'>Card details</p>
        <p className='mt-1'>
          In the live site this is a Stripe payment form. This demonstration takes
          no card details and charges nothing.
        </p>
      </div>

      {error && (
        <p role='alert' className='text-sm text-danger'>
          {error}
        </p>
      )}

      <Button
        type='submit'
        size='lg'
        className='w-full'
        disabled={status === 'processing'}
      >
        {status === 'processing' ? (
          <TextShimmer>Processing payment…</TextShimmer>
        ) : (
          `Pay ${gbp(amountGBP)}`
        )}
      </Button>

      <p className='text-center text-xs opacity-70'>{detail}</p>
    </form>
  );
}
