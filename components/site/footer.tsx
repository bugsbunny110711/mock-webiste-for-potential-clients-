import Link from 'next/link';
import { coach } from '@/lib/data';

const columns = [
  {
    heading: 'Work with me',
    links: [
      { href: '/courses', label: 'Courses' },
      { href: '/book', label: 'One-to-one sessions' },
      { href: '/retreats', label: 'Retreats' },
      { href: '/courses/breathwork-for-teachers', label: 'Teacher training' },
    ],
  },
  {
    heading: 'Read',
    links: [
      { href: '/journal', label: 'Journal' },
      { href: '/about', label: 'About Maya' },
      { href: '/#testimonials', label: 'What people say' },
      { href: '/#faq', label: 'Questions' },
    ],
  },
  {
    heading: 'Practical',
    links: [
      { href: '/contact', label: 'Get in touch' },
      { href: '/terms', label: 'Terms & refunds' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className='border-t border-ink/10 bg-surface/40'>
      <div className='mx-auto max-w-6xl px-6 py-14'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='font-display text-2xl font-light'>{coach.brand}</p>
            <p className='mt-2 max-w-xs text-sm opacity-80'>
              Breathwork and yoga with {coach.name}. {coach.location}, and
              online.
            </p>
            <p className='mt-4 text-sm'>{coach.email}</p>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className='text-sm'>
              <p className='mb-3 text-xs tracking-widest uppercase opacity-70'>
                {column.heading}
              </p>
              <ul className='space-y-2'>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className='hover:underline'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 text-xs opacity-60'>
          <p>© 2026 {coach.brand}. Demonstration site — not a real business.</p>
          <Link href='/admin' className='hover:opacity-100'>
            Coach sign in →
          </Link>
        </div>
      </div>
    </footer>
  );
}
