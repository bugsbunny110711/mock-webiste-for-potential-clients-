'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { login, type LoginState } from '@/lib/auth-actions';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Photo } from '@/components/site/photo';
import styles from './auth-card.module.css';

const initialState: LoginState = { error: null };

/**
 * Sign-in card with the two sides sliding past a fixed-width photograph.
 *
 * There is no sign-up side: the panel has exactly one user and no registration,
 * so the second side is account recovery instead. The sliding mechanism is the
 * same either way — see auth-card.module.css.
 */
export function AuthCard({ isDev, next }: { isDev: boolean; next?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''} md:h-[34rem]`}
      data-state={isFlipped ? 'recover' : 'signin'}
    >
      <div className={styles.cardBg}>
        <Photo
          id='studio-wide'
          ratio='h-full'
          className='absolute inset-0'
          sizes='(max-width: 767px) 100vw, 50vw'
          hideBrief
        />
        <div className={styles.scrim} />
      </div>

      {/* Hero for the sign-in side — sits opposite the sign-in form. */}
      <div className={`${styles.hero} ${styles.signIn}`}>
        <p className='font-display text-3xl font-light'>Welcome back</p>
        <p className='max-w-[22ch] text-sm leading-relaxed opacity-90'>
          Sign in to see today’s sessions, this month’s takings, and who is
          waiting on a reply.
        </p>
        <button
          type='button'
          onClick={() => setIsFlipped(true)}
          className={styles.switch}
        >
          Trouble signing in?
        </button>
      </div>

      {/* Hero for the recovery side. */}
      <div className={`${styles.hero} ${styles.recover}`}>
        <p className='font-display text-3xl font-light'>Locked out?</p>
        <p className='max-w-[24ch] text-sm leading-relaxed opacity-90'>
          There is no reset email here — the panel has one password, and it
          lives in the deployment environment.
        </p>
        <button
          type='button'
          onClick={() => setIsFlipped(false)}
          className={styles.switch}
        >
          Back to sign in
        </button>
      </div>

      <div className={`${styles.form} ${styles.signIn}`}>
        <SignInForm isDev={isDev} next={next} disabled={isFlipped} />
      </div>

      <div className={`${styles.form} ${styles.recover}`}>
        <RecoverPanel />
      </div>
    </div>
  );
}

function SignInForm({
  isDev,
  next,
  disabled,
}: {
  isDev: boolean;
  next?: string;
  disabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    // `inert` keeps the off-screen side out of the tab order and the
    // accessibility tree while it is sliding away or hidden behind the photo.
    <form
      action={formAction}
      inert={disabled}
      className='mx-auto w-full max-w-xs space-y-5'
    >
      <h1 className='text-center font-sans text-2xl font-semibold tracking-tight'>
        Sign in
      </h1>

      {/* Validated server-side in safeNext() before it is redirected to. */}
      {next && <input type='hidden' name='next' value={next} />}

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-medium'>
          Password
        </label>
        <div className='relative'>
          <input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete='current-password'
            placeholder='••••••••'
            className='h-11 w-full rounded-xl bg-admin-canvas px-4 pr-11 text-sm text-ink placeholder:text-ink/35 focus:ring-2 focus:ring-ink/25 focus:outline-none'
          />
          <button
            type='button'
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className='absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg opacity-55 transition-opacity hover:opacity-100'
          >
            <EyeIcon crossed={showPassword} />
          </button>
        </div>
      </div>

      <label className='flex cursor-pointer items-center gap-2.5 text-sm'>
        <input
          type='checkbox'
          name='remember'
          className='size-4 accent-[var(--color-ink)]'
        />
        Keep me signed in for a month
      </label>

      {state.error && (
        <p role='alert' className='text-sm text-danger'>
          {state.error}
        </p>
      )}

      <button
        type='submit'
        disabled={isPending}
        className='inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-canvas transition-colors hover:bg-ink-hover disabled:opacity-50'
      >
        {isPending ? <TextShimmer>Checking…</TextShimmer> : 'Sign in'}
      </button>

      {isDev && (
        <p className='rounded-xl border border-dashed border-ink/25 p-3 text-xs leading-relaxed opacity-75'>
          <span className='font-medium opacity-100'>Development mode.</span> No{' '}
          <code>ADMIN_PASSWORD</code> is set, so the password is{' '}
          <code className='rounded bg-band/50 px-1'>breathe</code>. Production
          has no fallback.
        </p>
      )}

      <p className='text-center text-xs opacity-60'>
        <Link href='/' className='hover:opacity-100'>
          ← Back to the site
        </Link>
      </p>
    </form>
  );
}

function RecoverPanel() {
  const steps = [
    {
      step: 'Check the environment',
      detail:
        'The password is whatever ADMIN_PASSWORD is set to where the site is deployed.',
    },
    {
      step: 'Change it',
      detail:
        'Set a new ADMIN_PASSWORD and redeploy. It takes effect immediately.',
    },
    {
      step: 'Sign out every device',
      detail:
        'Rotating AUTH_SECRET invalidates every session that already exists, including on a lost phone.',
    },
  ];

  return (
    <div className='mx-auto w-full max-w-xs'>
      <h2 className='text-center font-sans text-2xl font-semibold tracking-tight'>
        Locked out
      </h2>

      <ol className='mt-6 space-y-4 text-sm leading-relaxed'>
        {steps.map((item, index) => (
          <li key={item.step} className='flex gap-3'>
            <span className='grid size-6 shrink-0 place-items-center rounded-full bg-admin-canvas text-xs font-semibold tabular-nums'>
              {index + 1}
            </span>
            <span>
              <span className='block font-medium'>{item.step}</span>
              <span className='block opacity-70'>{item.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className='mt-7 border-t border-admin-border pt-5 text-xs leading-relaxed opacity-60'>
        Five wrong attempts within fifteen minutes locks sign-in from that
        address for the rest of the window.
      </p>
    </div>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg viewBox='0 0 20 20' className='size-4.5' aria-hidden>
      <path
        d='M1.8 10S4.9 4.6 10 4.6 18.2 10 18.2 10 15.1 15.4 10 15.4 1.8 10 1.8 10Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.3'
        strokeLinejoin='round'
      />
      <circle
        cx='10'
        cy='10'
        r='2.6'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.3'
      />
      {crossed && (
        <path
          d='M3.5 3.5l13 13'
          stroke='currentColor'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
      )}
    </svg>
  );
}
