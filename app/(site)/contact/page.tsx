import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/site/contact-form';
import { Photo } from '@/components/site/photo';
import { coach } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Get in touch — Still Point',
  description:
    'Ask about a course, a one-to-one session, a retreat, or teacher training. Maya reads every message herself.',
};

export default function ContactPage() {
  return (
    <div className='mx-auto max-w-6xl px-6 py-20'>
      <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
        Ask me anything.
      </h1>
      <p className='mt-6 max-w-xl text-lg opacity-85'>
        If you are not sure which course fits, or whether any of this is right
        for you at all, this is the place to ask. I would rather talk you out of
        something than take your money for the wrong thing.
      </p>

      <div className='mt-14 grid gap-12 md:grid-cols-[1fr_340px] md:items-start'>
        <ContactForm />

        <aside className='space-y-6'>
          <Photo
            id='coach-portrait-seated'
            ratio='aspect-[4/5]'
            className='rounded-card'
            sizes='(max-width: 768px) 100vw, 340px'
          />

          <div className='rounded-card bg-surface p-6 text-sm'>
            <p className='text-xs tracking-widest uppercase opacity-70'>
              Other ways
            </p>
            <p className='mt-3'>{coach.email}</p>
            <p className='mt-1 opacity-80'>{coach.location} — and online</p>

            <p className='mt-5 border-t border-ink/10 pt-4 leading-relaxed opacity-85'>
              Prefer to talk? A{' '}
              <Link href='/book' className='underline underline-offset-4'>
                discovery call
              </Link>{' '}
              is twenty minutes, free, and there is no pitch at the end of it.
            </p>
          </div>

          <div className='rounded-card border border-ink/15 p-6 text-sm leading-relaxed opacity-85'>
            <p className='font-medium opacity-100'>If this is urgent</p>
            <p className='mt-2'>
              I am not a crisis service and I cannot respond quickly. If you are
              in acute distress please contact your GP, or call Samaritans on
              116 123 — free, any time.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
