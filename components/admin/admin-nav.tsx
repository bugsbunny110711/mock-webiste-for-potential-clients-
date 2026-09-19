'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/calendar', label: 'Master calendar' },
  { href: '/admin/bookings', label: 'Orders & bookings' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/audience', label: 'Audience' },
];

export function AdminNav({
  variant = 'vertical',
}: {
  variant?: 'vertical' | 'horizontal';
}) {
  const pathname = usePathname();

  if (variant === 'horizontal') {
    return (
      <nav className='flex gap-1 overflow-x-auto border-b border-admin-border bg-admin-surface px-4 py-3'>
        {items.map((item) => (
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
    <nav className='mt-9 flex flex-col gap-0.5'>
      {items.map((item) => (
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
    </nav>
  );
}
