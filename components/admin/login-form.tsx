'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/lib/auth-actions';
import { TextShimmer } from '@/components/core/text-shimmer';

const initialState: LoginState = { error: null };

export function LoginForm({
  isDev,
  next,
}: {
  isDev: boolean;
  next?: string;
}) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className='space-y-5'>
      {/* Validated server-side in safeNext() before it is ever redirected to. */}
      {next && <input type='hidden' name='next' value={next} />}

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-medium'>
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          required
          autoFocus
          autoComplete='current-password'
          className='h-11 w-full rounded-xl border border-ink/20 bg-canvas px-4 text-sm text-ink focus:border-ink focus:outline-none'
        />
      </div>

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
          <code className='rounded bg-band/60 px-1'>breathe</code>. In production
          there is no fallback — sign-in fails until the environment provides
          one.
        </p>
      )}
    </form>
  );
}
