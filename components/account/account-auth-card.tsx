'use client';

import { useActionState, useState } from 'react';
import { signIn, register, type AccountState } from '@/lib/student-actions';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Photo } from '@/components/site/photo';
import styles from '@/components/ui/sliding-card.module.css';

const initialState: AccountState = { error: null };

/**
 * Student sign-in and registration, sharing the sliding mechanism with the
 * coach's card. This is the version with a genuine second side: students do
 * register, unlike the coach.
 */
export function AccountAuthCard({
  next,
  demoPassword,
}: {
  next?: string;
  demoPassword?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''} md:h-[36rem]`}
    >
      <div className={styles.cardBg}>
        <Photo
          id='coach-teaching'
          ratio='h-full'
          className='absolute inset-0'
          sizes='(max-width: 767px) 100vw, 50vw'
          hideBrief
        />
        <div className={styles.scrim} />
      </div>

      <div className={`${styles.hero} ${styles.signIn}`}>
        <p className='font-display text-3xl font-light'>Welcome back</p>
        <p className='max-w-[24ch] text-sm leading-relaxed opacity-90'>
          Your recordings, your workbooks, and whatever week you are on. All of
          it stays yours for a year.
        </p>
        <button
          type='button'
          onClick={() => setIsFlipped(true)}
          className={styles.switch}
        >
          Create an account
        </button>
      </div>

      <div className={`${styles.hero} ${styles.recover}`}>
        <p className='font-display text-3xl font-light'>Hello there</p>
        <p className='max-w-[24ch] text-sm leading-relaxed opacity-90'>
          Already bought a course? Make an account with the same email you used
          at checkout and it will be waiting for you.
        </p>
        <button
          type='button'
          onClick={() => setIsFlipped(false)}
          className={styles.switch}
        >
          I already have one
        </button>
      </div>

      <div className={`${styles.form} ${styles.signIn}`}>
        <SignInForm next={next} disabled={isFlipped} demoPassword={demoPassword} />
      </div>

      <div className={`${styles.form} ${styles.recover}`}>
        <RegisterForm disabled={!isFlipped} />
      </div>
    </div>
  );
}

const fieldClass =
  'h-11 w-full rounded-xl bg-admin-canvas px-4 text-sm text-ink placeholder:text-ink/35 focus:ring-2 focus:ring-ink/25 focus:outline-none';

function SignInForm({
  next,
  disabled,
  demoPassword,
}: {
  next?: string;
  disabled: boolean;
  demoPassword?: string;
}) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  // Controlled, so a rejected sign-in does not clear what was typed.
  const [email, setEmail] = useState('');

  return (
    <form
      action={formAction}
      inert={disabled}
      className='mx-auto w-full max-w-xs space-y-4'
    >
      <h1 className='text-center text-2xl font-semibold tracking-tight'>
        Sign in
      </h1>

      {next && <input type='hidden' name='next' value={next} />}

      <div className='space-y-1.5'>
        <label htmlFor='signin-email' className='block text-sm font-medium'>
          Email
        </label>
        <input
          id='signin-email'
          name='email'
          type='email'
          required
          autoComplete='email'
          placeholder='hello@example.com'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className='space-y-1.5'>
        <label htmlFor='signin-password' className='block text-sm font-medium'>
          Password
        </label>
        <PasswordInput id='signin-password' autoComplete='current-password' />
      </div>

      {state.error && state.panel === 'signin' && (
        <p role='alert' className='text-sm text-danger'>
          {state.error}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-canvas transition-colors hover:bg-ink-hover disabled:opacity-50'
      >
        {isPending ? <TextShimmer>Signing in…</TextShimmer> : 'Sign in'}
      </button>

      {demoPassword && (
        <p className='rounded-xl border border-dashed border-ink/25 p-3 text-xs leading-relaxed opacity-75'>
          <span className='font-medium opacity-100'>Demonstration.</span> Try{' '}
          <code className='rounded bg-band/50 px-1'>aditi.raman@example.com</code>{' '}
          with the password{' '}
          <code className='rounded bg-band/50 px-1'>{demoPassword}</code>.
        </p>
      )}
    </form>
  );
}

function RegisterForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <form
      action={formAction}
      inert={disabled}
      className='mx-auto w-full max-w-xs space-y-4'
    >
      <h2 className='text-center text-2xl font-semibold tracking-tight'>
        Create an account
      </h2>

      <div className='space-y-1.5'>
        <label htmlFor='register-name' className='block text-sm font-medium'>
          Name
        </label>
        <input
          id='register-name'
          name='name'
          required
          autoComplete='name'
          placeholder='Jane Fielding'
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className='space-y-1.5'>
        <label htmlFor='register-email' className='block text-sm font-medium'>
          Email
        </label>
        <input
          id='register-email'
          name='email'
          type='email'
          required
          autoComplete='email'
          placeholder='hello@example.com'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className='space-y-1.5'>
        <label htmlFor='register-password' className='block text-sm font-medium'>
          Password
        </label>
        <PasswordInput id='register-password' autoComplete='new-password' />
        <p className='text-xs opacity-60'>
          Ten characters or more. A short sentence is easier to remember and
          harder to guess than a word with symbols in it.
        </p>
      </div>

      {state.error && state.panel === 'register' && (
        <p role='alert' className='text-sm text-danger'>
          {state.error}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-canvas transition-colors hover:bg-ink-hover disabled:opacity-50'
      >
        {isPending ? <TextShimmer>Creating…</TextShimmer> : 'Create account'}
      </button>
    </form>
  );
}

function PasswordInput({
  id,
  autoComplete,
}: {
  id: string;
  autoComplete: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className='relative'>
      <input
        id={id}
        name='password'
        type={shown ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        placeholder='••••••••'
        className={`${fieldClass} pr-11`}
      />
      <button
        type='button'
        onClick={() => setShown((value) => !value)}
        aria-label={shown ? 'Hide password' : 'Show password'}
        aria-pressed={shown}
        className='absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg opacity-55 transition-opacity hover:opacity-100'
      >
        <svg viewBox='0 0 20 20' className='size-4.5' aria-hidden>
          <path
            d='M1.8 10S4.9 4.6 10 4.6 18.2 10 18.2 10 15.1 15.4 10 15.4 1.8 10 1.8 10Z'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.3'
            strokeLinejoin='round'
          />
          <circle cx='10' cy='10' r='2.6' fill='none' stroke='currentColor' strokeWidth='1.3' />
          {shown && (
            <path d='M3.5 3.5l13 13' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
          )}
        </svg>
      </button>
    </div>
  );
}
