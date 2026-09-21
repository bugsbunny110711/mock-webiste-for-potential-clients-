'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CalendarHeart } from 'lucide-react';
import { BrandMark } from './logo';
import { isActiveHref, siteNavItems } from './nav-items';
import { coach } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * Navigation below 1120px: a pinned bar of three lines, the mark and Book,
 * and a panel that drops down over the page.
 *
 * The bar it replaces put all eight destinations in one row, which on a phone
 * meant eight 34px targets four pixels apart, each an unlabelled symbol. The
 * people with the least room were the only ones navigating by guesswork. Here
 * every destination is a 54px row with its name written out.
 *
 * The bar itself stays put at every scroll position. What the row of options
 * cost was the width, not the strip of screen — so the three lines remain, and
 * navigation is one tap away from anywhere on a very long page.
 */
export function MobileNav() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // The panel is open only for the route it was opened on, so following a link
  // closes it without an effect watching the pathname.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn !== null && openedOn === pathname;

  const close = () => setOpenedOn(null);

  // Escape closes, as it does for any overlay.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenedOn(null);
      buttonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Hold the page still underneath. Without this the page scrolls behind the
  // panel, which on a touch screen is what happens the moment a finger moves.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Move the reading position into the panel when it opens, so the next thing
  // a screen reader or keyboard lands on is the navigation, not the page.
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  const duration = shouldReduceMotion ? 0 : 0.22;

  return (
    <>
      <div
        className={cn(
          // Equal outer columns, so the mark sits on the bar's true centre.
          // Sizing them to their contents instead puts it wherever the wider
          // of the two pushes it — 20px off, with Book being the wider.
          'pointer-events-auto relative z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 rounded-[26px] border border-ink/10 py-1 pr-2 pl-1.5',
          'bg-canvas/75 shadow-[0_8px_30px_rgb(55_41_55/13%)] backdrop-blur-xl backdrop-saturate-150',
        )}
      >
        <button
          ref={buttonRef}
          type='button'
          onClick={() => setOpenedOn(isOpen ? null : pathname)}
          aria-expanded={isOpen}
          aria-controls='mobile-nav-panel'
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className='grid h-11 w-11 shrink-0 place-items-center justify-self-start rounded-full text-accent transition-colors hover:bg-ink/8'
        >
          {/* Three lines that fold into a cross: the outer two meet in the
              middle and cross, the middle one gets out of the way. */}
          <span aria-hidden className='relative block h-[13px] w-[19px]'>
            {[
              { top: 0, rotate: 45 },
              { top: 5.5, rotate: 0 },
              { top: 11, rotate: -45 },
            ].map((line, index) => (
              <motion.span
                key={line.top}
                className='absolute left-0 block h-[1.9px] w-full rounded-full bg-current'
                initial={false}
                animate={
                  isOpen
                    ? {
                        top: 5.5,
                        rotate: line.rotate,
                        opacity: index === 1 ? 0 : 1,
                      }
                    : { top: line.top, rotate: 0, opacity: 1 }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              />
            ))}
          </span>
        </button>

        <Link
          href='/'
          aria-label={`${coach.brand} — home`}
          onClick={close}
          className='flex justify-center text-accent'
        >
          <BrandMark size={30} />
        </Link>

        {/* Booking stays out of the panel. It is what the site sells, and two
            taps behind a closed menu is where a booking goes to die. */}
        <Link
          href='/book'
          onClick={close}
          aria-current={isActiveHref(pathname, '/book') ? 'page' : undefined}
          className='flex items-center gap-1.5 justify-self-end rounded-full bg-accent px-3.5 py-2.5 text-[13.5px] font-medium text-canvas'
        >
          <CalendarHeart size={15} strokeWidth={1.7} aria-hidden />
          Book
        </Link>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type='button'
              tabIndex={-1}
              aria-label='Close menu'
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
              className='pointer-events-auto fixed inset-0 z-40 cursor-default bg-ink/35'
            />

            <motion.div
              id='mobile-nav-panel'
              ref={panelRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration, ease: [0.22, 0.61, 0.36, 1] }}
              className={cn(
                'pointer-events-auto relative z-50 mt-2 overflow-hidden rounded-[22px] border border-ink/10 outline-none',
                'bg-canvas/97 shadow-[0_22px_50px_rgb(55_41_55/26%)] backdrop-blur-xl',
              )}
            >
              <nav aria-label='Site'>
                <ul>
                  {siteNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveHref(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex h-[54px] items-center gap-3.5 border-b border-ink/8 px-[18px] text-base text-ink',
                            active && 'bg-ink/6 font-medium',
                          )}
                        >
                          <Icon
                            size={19}
                            strokeWidth={1.6}
                            aria-hidden
                            className={cn(
                              'shrink-0',
                              active ? 'text-accent' : 'opacity-85',
                            )}
                          />
                          {item.title}
                          {active && (
                            <span className='ml-auto text-[10px] tracking-[0.16em] uppercase opacity-50'>
                              You are here
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className='border-t border-ink/10 px-[18px] pt-3.5 pb-4'>
                <Link
                  href='/book'
                  onClick={close}
                  className='flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent text-[15px] font-medium text-canvas'
                >
                  <CalendarHeart size={17} strokeWidth={1.7} aria-hidden />
                  Book a 1-1 session
                </Link>
                <p className='mt-2.5 text-center text-[9px] tracking-[0.16em] uppercase opacity-55'>
                  {coach.tagline}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
