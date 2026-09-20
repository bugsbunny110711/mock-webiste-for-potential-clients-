'use client';

import { useActionState } from 'react';
import { subscribe, type SubscribeState } from '@/lib/actions';
import { TextShimmer } from '@/components/core/text-shimmer';
import { cn } from '@/lib/utils';

const initialState: SubscribeState = { status: 'idle', message: '' };

/**
 * Mailing list capture. `source` is recorded so the audience view can show
 * which part of the site actually grows the list.
 */
export function SubscribeForm({
  source,
  className,
  tone = 'light',
}: {
  source: string;
  className?: string;
  tone?: 'light' | 'onSurface';
}) {
  const [state, formAction, isPending] = useActionState(subscribe, initialState);

  if (state.status === 'subscribed') {
    return (
      <p className={cn('text-sm leading-relaxed', className)} aria-live='polite'>
        <span aria-hidden>✓</span> {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={cn('w-full', className)}>
      <input type='hidden' name='source' value={source} />

      <div className='flex flex-col gap-2 sm:flex-row'>
        <label htmlFor={`subscribe-${source}`} className='sr-only'>
          Email address
        </label>
        <input
          id={`subscribe-${source}`}
          name='email'
          type='email'
          required
          placeholder='you@example.com'
          className={cn(
            'h-11 flex-1 rounded-full px-5 text-sm text-ink placeholder:text-ink/45 focus:outline-none',
            tone === 'light'
              ? 'border border-ink/20 bg-canvas focus:border-ink'
              : 'border border-ink/15 bg-canvas focus:border-ink',
          )}
        />
        <button
          type='submit'
          disabled={isPending}
          className='inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-canvas transition-colors hover:bg-accent-hover disabled:opacity-50'
        >
          {isPending ? <TextShimmer>Adding…</TextShimmer> : 'Keep me posted'}
        </button>
      </div>

      {state.status === 'error' && (
        <p role='alert' className='mt-2 text-sm text-danger'>
          {state.message}
        </p>
      )}

      <p className='mt-2 text-xs opacity-65'>
        Retreat dates and the occasional piece of writing. No more than monthly,
        and one click to leave.
      </p>
    </form>
  );
}
