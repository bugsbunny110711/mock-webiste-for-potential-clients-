'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarHeart } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockText } from '@/components/core/dock';
import { BrandMark } from '@/components/site/logo';
import { MobileNav } from '@/components/site/mobile-nav';
import { isActiveHref, siteNavItems } from '@/components/site/nav-items';
import { coach } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * The site's navigation, pinned to the top of the viewport in two shapes.
 *
 * At 1120px and up it is the horizontal bar: the mark, then every destination
 * as a word, each trading its word for its symbol as the pointer reaches it.
 * Measured, that bar is 1030px wide, so it needs a 1070px viewport — this is
 * the width at which it stops being cramped.
 *
 * Below that it is three lines and a panel (see MobileNav), because the same
 * eight destinations in one row on a phone means eight 34px targets four
 * pixels apart with no words on them.
 *
 * Which one shows is decided in CSS rather than by a media query hook. A hook
 * reports false until it has run, so the first paint would be the phone bar on
 * every machine, and a desktop would visibly swap after hydration.
 */
export function SiteDock() {
  const pathname = usePathname();
  const isActive = (href: string) => isActiveHref(pathname, href);

  return (
    <header
      id='site-navigation'
      className='pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4'
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto hidden w-fit max-w-full items-center justify-between gap-4 rounded-[30px] border border-ink/10 px-4 min-[1120px]:flex',
          // The frosted panel: translucent fill plus a heavy blur, so whatever
          // scrolls beneath shows through as colour rather than detail.
          'bg-canvas/65 shadow-[0_8px_36px_rgb(55_41_55/14%)] backdrop-blur-xl backdrop-saturate-150',
        )}
      >
        {/* The mark alone. The wordmark repeated the brand the page already
            states, and next to eight nav words it read as a ninth; the
            monogram reads as the identity instead. The link keeps its
            aria-label, which is now the only place the name is given here. */}
        <Link
          href='/'
          aria-label={`${coach.brand} — home`}
          className='flex shrink-0 items-center px-1.5 text-accent'
        >
          <BrandMark size={30} />
        </Link>

        <Dock className='mx-auto gap-2' magnification={66} distance={150} panelSize={58}>
          {siteNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <DockItem
                key={item.href}
                baseSize={44}
                sizeContainer={false}
                className={cn(
                  'rounded-full px-4 py-2.5 transition-colors',
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
                  <DockText className='text-[15px] text-ink'>
                    {item.title}
                  </DockText>
                </Link>
              </DockItem>
            );
          })}

          {/* Kept visually distinct: in a row of equal items the one thing the
              site exists to sell would read as just another page. */}
          <DockItem
            baseSize={44}
            sizeContainer={false}
            className='rounded-full bg-accent px-5 py-2.5 text-canvas'
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
              <DockText className='text-[15px] font-medium'>Book</DockText>
            </Link>
          </DockItem>
        </Dock>
      </div>

      <div className='mx-auto w-full max-w-2xl min-[1120px]:hidden'>
        <MobileNav />
      </div>
    </header>
  );
}
