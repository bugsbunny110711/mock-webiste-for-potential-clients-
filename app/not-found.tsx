import Link from 'next/link';
import { SiteDock } from '@/components/site/site-dock';
import { Footer } from '@/components/site/footer';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteDock />
      <main className='flex flex-1 items-center pt-24 sm:pt-28'>
        <div className='mx-auto w-full max-w-3xl px-6 py-24'>
          <p className='text-xs tracking-[0.2em] uppercase opacity-70'>
            Page not found
          </p>
          <h1 className='mt-5 text-5xl leading-tight sm:text-6xl'>
            There is nothing here. Breathe out anyway.
          </h1>
          <p className='mt-6 max-w-xl text-lg leading-relaxed opacity-85'>
            The page you were after has either moved or never existed. Neither is
            worth your cortisol.
          </p>

          <div className='mt-10 flex flex-wrap gap-3'>
            <ButtonLink href='/' size='lg'>
              Back to the start
            </ButtonLink>
            <ButtonLink href='/courses' size='lg' variant='secondary'>
              See the courses
            </ButtonLink>
          </div>

          <div className='mt-14 border-t border-ink/10 pt-8'>
            <p className='text-sm opacity-70'>Or try one of these:</p>
            <ul className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
              {[
                { href: '/book', label: 'Book a one-to-one session' },
                { href: '/retreats', label: 'Retreats' },
                { href: '/journal', label: 'Journal' },
                { href: '/contact', label: 'Get in touch' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className='underline underline-offset-4'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
