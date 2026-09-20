'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import { cn } from '@/lib/utils';

/**
 * The narrow-screen nav. The sidebar replaces this from `lg` up — see
 * components/admin/sidebar.tsx. Both read the same list from nav-items.ts.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className='flex gap-1 overflow-x-auto border-b border-admin-border bg-admin-surface px-4 py-3'>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
              isActive ? 'bg-ink text-canvas' : 'hover:bg-admin-canvas',
            )}
          >
            <Icon size={16} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
