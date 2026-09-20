'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const groups = [
  {
    heading: 'Running the week',
    items: [
      { href: '/admin', label: 'Overview' },
      { href: '/admin/calendar', label: 'Master calendar' },
      { href: '/admin/bookings', label: 'Orders & bookings' },
      { href: '/admin/enquiries', label: 'Enquiries' },
      { href: '/admin/students', label: 'People' },
    ],
  },
  {
    heading: 'The business',
    items: [
      { href: '/admin/courses', label: 'Courses' },
      { href: '/admin/retreats', label: 'Retreats' },
      { href: '/admin/audience', label: 'Audience' },
      { href: '/admin/availability', label: 'Availability' },
      { href: '/admin/photos', label: 'Photo shot list' },
    ],
  },
];

const flat = groups.flatMap((group) => group.items);

export function AdminNav({
  variant = 'vertical',
}: {
  variant?: 'vertical' | 'horizontal';
}) {
  const pathname = usePathname();

  if (variant === 'horizontal') {
    return (
      <nav className='flex gap-1 overflow-x-auto border-b border-admin-border bg-admin-surface px-4 py-3'>
        {flat.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors',
              pathname === item.href
                ? 'bg-ink text-canvas'
                : 'hover:bg-admin-canvas',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className='mt-8 flex flex-col gap-6'>
      {groups.map((group) => (
        <div key={group.heading}>
          <p className='px-2.5 pb-2 text-[10px] font-semibold tracking-widest uppercase opacity-45'>
            {group.heading}
          </p>
          <div className='flex flex-col gap-0.5'>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-ink font-medium text-canvas'
                    : 'hover:bg-admin-surface',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
