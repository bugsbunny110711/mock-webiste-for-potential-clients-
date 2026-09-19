import Link from 'next/link';
import { coach } from '@/lib/data';

export function Footer() {
  return (
    <footer className='border-t border-ink/10 bg-surface/40'>
      <div className='mx-auto max-w-6xl px-6 py-14'>
        <div className='grid gap-10 sm:grid-cols-3'>
          <div>
            <p className='font-display text-2xl font-light'>{coach.brand}</p>
            <p className='mt-2 max-w-xs text-sm opacity-80'>
              Breathwork and yoga with {coach.name}. {coach.location}, and online.
            </p>
          </div>

          <div className='text-sm'>
            <p className='mb-3 text-xs tracking-widest uppercase opacity-70'>Explore</p>
            <ul className='space-y-2'>
              <li><Link href='/courses' className='hover:underline'>Courses</Link></li>
              <li><Link href='/book' className='hover:underline'>One-to-one sessions</Link></li>
              <li><Link href='/about' className='hover:underline'>About Maya</Link></li>
              <li><Link href='/#faq' className='hover:underline'>Questions</Link></li>
            </ul>
          </div>

          <div className='text-sm'>
            <p className='mb-3 text-xs tracking-widest uppercase opacity-70'>Get in touch</p>
            <p>{coach.email}</p>
            <Link
              href='/admin'
              className='mt-6 inline-block text-xs opacity-60 hover:opacity-100'
            >
              Coach sign in →
            </Link>
          </div>
        </div>

        <p className='mt-12 border-t border-ink/10 pt-6 text-xs opacity-60'>
          © {2026} {coach.brand}. Demonstration site — not a real business.
        </p>
      </div>
    </footer>
  );
}
