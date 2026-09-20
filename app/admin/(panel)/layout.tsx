import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { coach } from '@/lib/data';
import { AdminNav } from '@/components/admin/admin-nav';
import { SignOutButton } from '@/components/admin/sign-out-button';
import { verifySession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Admin — Still Point',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The authoritative check. proxy.ts only looks for a cookie; this verifies
  // the signature and the expiry, and everything below it is gated on it.
  const session = await verifySession();
  if (!session) redirect('/admin/login');

  return (
    <div className='min-h-screen bg-admin-canvas font-sans'>
      <div className='mx-auto flex max-w-[1400px]'>
        <aside className='sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-admin-border px-5 py-7 lg:flex'>
          <Link href='/admin' className='px-2'>
            <p className='font-display text-xl font-light'>{coach.brand}</p>
            <p className='mt-0.5 text-xs opacity-60'>Coach panel</p>
          </Link>

          <AdminNav />

          <div className='mt-auto px-2'>
            <div className='flex items-center gap-3 border-t border-admin-border pt-5'>
              <span
                aria-hidden
                className='grid size-9 place-items-center rounded-full bg-surface text-sm font-medium'
              >
                {coach.name.charAt(0)}
              </span>
              <span className='min-w-0 text-sm leading-tight'>
                <span className='block truncate font-medium'>{coach.name}</span>
                <Link href='/' className='block text-xs opacity-60 hover:opacity-100'>
                  View site →
                </Link>
              </span>
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div className='min-w-0 flex-1'>
          <div className='lg:hidden'>
            <AdminNav variant='horizontal' />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
