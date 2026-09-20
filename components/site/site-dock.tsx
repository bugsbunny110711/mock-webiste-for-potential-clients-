'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CalendarHeart,
  GraduationCap,
  HomeIcon,
  Mail,
  Mountain,
  UserRound,
  UserCircle2,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockText } from '@/components/core/dock';
import { BrandMark } from '@/components/site/logo';
import { useMediaQuery } from '@/lib/hooks';
import { coach } from '@/lib/data';
import { cn } from '@/lib/utils';

const items = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Courses', href: '/courses', icon: GraduationCap },
  { title: 'Retreats', href: '/retreats', icon: Mountain },
  { title: 'Journal', href: '/journal', icon: BookOpen },
  { title: 'About', href: '/about', icon: UserRound },
  { title: 'Contact', href: '/contact', icon: Mail },
  { title: 'Account', href: '/account', icon: UserCircle2 },
];

/**
 * The site's navigation: a frosted bar pinned to the top, with the dock's
 * magnification inside it.
 *
 * Brand and dock share one panel rather than floating as separate pills —
 * separate pills either side of a centred dock collide on a phone, where the
 * three together are wider than the viewport.
 */
export function SiteDock() {
  const pathname = usePathname();
  // The words are the resting state wherever the eight of them fit. Measured,
  // the labelled bar is 1030px wide now the brand is the mark alone, so it
  // needs a 1070px viewport and this threshold leaves 90px of slack — room for
  // a font that renders wider elsewhere, rather than clearing it by a hair.
  // Under it the dock falls back to symbols with the tooltip, and the footer
  // carries the full text nav.
  const showLabels = useMediaQuery('(min-width: 1120px)');
  const isWide = useMediaQuery('(min-width: 640px)');

  // baseSize drives the symbol too (DockIcon takes 42% of it), so it sets the
  // whole bar's weight, not just the tap target.
  const base = showLabels ? 44 : isWide ? 40 : 34;
  const magnification = showLabels ? 66 : isWide ? 54 : 46;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      id='site-navigation'
      className='pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4'
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex w-fit max-w-full items-center justify-between gap-2 rounded-[30px] border border-ink/10 px-2 sm:gap-4 sm:px-4',
          // The frosted panel: translucent fill plus a heavy blur, so whatever
          // scrolls beneath shows through as colour rather than detail.
          'bg-canvas/65 shadow-[0_8px_36px_rgb(55_41_55/14%)] backdrop-blur-xl backdrop-saturate-150',
        )}
      >
        {/* The mark alone, at every width. The wordmark repeated the brand the
            page already states, and next to eight nav words it read as a ninth;
            the monogram reads as the identity instead. The link keeps its
            aria-label, which is now the only place the name is given here. */}
        <Link
          href='/'
          aria-label={`${coach.brand} — home`}
          className='flex shrink-0 items-center px-1.5 text-accent'
        >
          <BrandMark size={30} />
        </Link>

        <Dock
          className={cn('mx-auto', showLabels ? 'gap-2' : 'gap-1 sm:gap-2')}
          magnification={magnification}
          distance={showLabels ? 150 : 110}
          panelSize={showLabels ? 58 : magnification + 6}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <DockItem
                key={item.href}
                baseSize={base}
                sizeContainer={!showLabels}
                className={cn(
                  'rounded-full transition-colors',
                  showLabels && 'px-4 py-2.5',
                  active ? 'bg-ink/12' : 'hover:bg-ink/8',
                )}
              >
                <Link
                  href={item.href}
                  aria-label={item.title}
                  aria-current={active ? 'page' : undefined}
                  className='flex h-full w-full items-center justify-center'
                >
                  <DockIcon>
                    <Icon className='h-full w-full text-ink' strokeWidth={1.6} />
                  </DockIcon>
                  {showLabels && (
                    <DockText className='text-[15px] text-ink'>
                      {item.title}
                    </DockText>
                  )}
                </Link>
              </DockItem>
            );
          })}

          {/* Kept visually distinct: in a row of equal items the one thing the
              site exists to sell would read as just another page. */}
          <DockItem
            baseSize={base}
            sizeContainer={!showLabels}
            className={cn(
              'rounded-full bg-accent text-canvas',
              showLabels && 'px-5 py-2.5',
            )}
          >
            <Link
              href='/book'
              aria-label='Book a session'
              aria-current={isActive('/book') ? 'page' : undefined}
              className='flex h-full w-full items-center justify-center'
            >
              <DockIcon>
                <CalendarHeart
                  className='h-full w-full text-canvas'
                  strokeWidth={1.6}
                />
              </DockIcon>
              {showLabels && (
                <DockText className='text-[15px] font-medium'>Book</DockText>
              )}
            </Link>
          </DockItem>
        </Dock>
      </div>
    </header>
  );
}
