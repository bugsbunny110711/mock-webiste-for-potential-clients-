'use client';

import { useActionState, useState } from 'react';
import { submitEnquiry, type EnquiryState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/field';
import { TextShimmer } from '@/components/core/text-shimmer';

const initialState: EnquiryState = { status: 'idle', message: '' };

const SUBJECTS = [
  'A course',
  'One-to-one sessions',
  'A retreat',
  'Teacher training',
  'Something else',
];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialState,
  );
  // Controlled, because React 19 resets uncontrolled fields once the action
  // settles — losing a long message to one validation error is unforgivable.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (state.status === 'sent') {
    return (
      <div className='rounded-card bg-surface p-8'>
        <p className='text-xs tracking-widest uppercase opacity-70'>Sent</p>
        <h2 className='mt-2 font-display text-3xl font-light'>
          That has reached me.
        </h2>
        <p className='mt-4 leading-relaxed opacity-85'>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Your name</Label>
        <Input
          id='name'
          name='name'
          required
          placeholder='Jane Fielding'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {state.fieldErrors?.name && (
          <p className='text-sm text-danger' aria-live='polite'>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          required
          placeholder='you@example.com'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {state.fieldErrors?.email && (
          <p className='text-sm text-danger' aria-live='polite'>
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='subject'>What is it about?</Label>
        <select
          id='subject'
          name='subject'
          defaultValue={SUBJECTS[0]}
          className='h-11 w-full rounded-xl border border-ink/20 bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none'
        >
          {SUBJECTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='message'>Your message</Label>
        <textarea
          id='message'
          name='message'
          rows={6}
          required
          placeholder='Tell me what you are looking for, and anything I should know.'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className='w-full rounded-xl border border-ink/20 bg-canvas p-4 text-sm leading-relaxed text-ink placeholder:text-ink/45 focus:border-ink focus:outline-none'
        />
        {state.fieldErrors?.message && (
          <p className='text-sm text-danger' aria-live='polite'>
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.status === 'error' && !state.fieldErrors && (
        <p role='alert' className='text-sm text-danger'>
          {state.message}
        </p>
      )}

      <Button type='submit' size='lg' className='w-full' disabled={isPending}>
        {isPending ? <TextShimmer>Sending…</TextShimmer> : 'Send message'}
      </Button>

      <p className='text-center text-xs opacity-70'>
        I read every message myself. Usually a reply within two working days.
      </p>
    </form>
  );
}
