'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/courses', label: 'Courses' },
  { href: '/breathe', label: 'Free tool' },
  { href: '/testimonials', label: 'Stories' },
  { href: '/faq', label: 'FAQ' },
];

/**
 * Site header. Transparent over the hero, then settles into a frosted
 * bar once the page scrolls — so the glass only appears where there is
 * content behind it to blur.
 */
export function Header({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-breath ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" aria-label="BreathWiz home">
          <Logo size={30} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-body text-sm text-mist transition-colors duration-300 hover:text-cream"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-aqua transition-all duration-300 ease-breath group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden rounded-full bg-aqua px-5 py-2.5 font-body text-sm font-medium text-ink transition-all duration-300 hover:shadow-[0_0_28px_-4px_var(--aqua)] sm:inline-block"
          >
            Book a session
          </Link>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-full bg-cream transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-cream transition-all duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-solid mt-3 overflow-hidden md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1 px-6 py-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/6 py-3 font-body text-base text-cream last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-aqua py-3 text-center font-body text-sm font-medium text-ink"
            >
              Book a session
            </Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
