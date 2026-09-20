'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { coach } from '@/lib/data';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/retreats', label: 'Retreats' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-40 border-b border-ink/10 bg-canvas/85 backdrop-blur-md'>
      <nav className='mx-auto flex h-18 max-w-6xl items-center justify-between px-6'>
        <Link href='/' className='flex items-baseline gap-2'>
          <span className='font-display text-xl font-light tracking-tight'>
            {coach.brand}
          </span>
          <span className='hidden text-xs tracking-widest text-ink/70 uppercase sm:inline'>
            {coach.name}
          </span>
        </Link>

        <div className='hidden items-center gap-7 lg:flex'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-opacity hover:opacity-100',
                pathname === link.href ? 'opacity-100' : 'opacity-75',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href='/account'
            className='text-sm opacity-75 transition-opacity hover:opacity-100'
          >
            Account
          </Link>
          <ButtonLink href='/book' size='sm'>
            Book a session
          </ButtonLink>
        </div>

        <button
          type='button'
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label='Menu'
          className='lg:hidden'
        >
          <svg viewBox='0 0 24 24' className='size-6' aria-hidden>
            <path
              d={isOpen ? 'M5 5l14 14M19 5L5 19' : 'M3 7h18M3 16h18'}
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className='border-t border-ink/10 px-6 pb-6 pt-2 lg:hidden'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className='block border-b border-ink/10 py-3 text-sm'
            >
              {link.label}
            </Link>
          ))}
          <Link
            href='/account'
            onClick={() => setIsOpen(false)}
            className='block border-b border-ink/10 py-3 text-sm'
          >
            Account
          </Link>
          <ButtonLink href='/book' className='mt-4 w-full' onClick={() => setIsOpen(false)}>
            Book a session
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
