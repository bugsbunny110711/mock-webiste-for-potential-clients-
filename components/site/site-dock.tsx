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
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { useMediaQuery } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const items = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Courses', href: '/courses', icon: GraduationCap },
  { title: 'Retreats', href: '/retreats', icon: Mountain },
  { title: 'Journal', href: '/journal', icon: BookOpen },
  { title: 'About', href: '/about', icon: UserRound },
  { title: 'Contact', href: '/contact', icon: Mail },
];

export function SiteDock() {
  const pathname = usePathname();
  // Seven items at desktop sizing fill a phone edge to edge, which reads as a
  // bottom bar rather than something floating. Smaller icons keep the margins.
  const isWide = useMediaQuery('(min-width: 640px)');
  const base = isWide ? 44 : 36;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div
      id='site-navigation'
      className='pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-5'
    >
      <div
        className={cn(
          'pointer-events-auto rounded-[26px] border border-ink/10',
          // The frosted panel. A translucent fill plus a heavy blur, so the
          // page shows through as colour rather than detail.
          'bg-canvas/65 shadow-[0_8px_36px_rgb(55_41_55/16%)] backdrop-blur-xl backdrop-saturate-150',
        )}
      >
        <Dock
          className='items-end gap-1.5 px-2 sm:gap-2 sm:px-3'
          magnification={isWide ? 58 : 46}
          distance={isWide ? 120 : 90}
          panelSize={base}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <DockItem
                key={item.href}
                baseSize={base}
                className={cn(
                  'rounded-full transition-colors',
                  active ? 'bg-ink/12' : 'hover:bg-ink/8',
                )}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <Link
                    href={item.href}
                    aria-label={item.title}
                    aria-current={active ? 'page' : undefined}
                    className='grid h-full w-full place-items-center'
                  >
                    <Icon className='h-full w-full text-ink' strokeWidth={1.6} />
                  </Link>
                </DockIcon>
              </DockItem>
            );
          })}

          {/* Kept visually distinct: in a row of equal icons a booking link
              would read as just another page, and selling sessions is what
              this site is for. */}
          <DockItem
            baseSize={base}
            className='rounded-full bg-accent text-canvas'
          >
            <DockLabel>Book a session</DockLabel>
            <DockIcon>
              <Link
                href='/book'
                aria-label='Book a session'
                aria-current={isActive('/book') ? 'page' : undefined}
                className='grid h-full w-full place-items-center'
              >
                <CalendarHeart
                  className='h-full w-full text-canvas'
                  strokeWidth={1.6}
                />
              </Link>
            </DockIcon>
          </DockItem>
        </Dock>
      </div>
    </div>
  );
}
