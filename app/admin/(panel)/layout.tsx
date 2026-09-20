import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { coach } from '@/lib/data';
import { AdminNav } from '@/components/admin/admin-nav';
import { Sidebar } from '@/components/admin/sidebar';
import { verifySession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Admin — Maya Ellison',
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
      <div className='mx-auto flex max-w-[1500px]'>
        <Sidebar name={coach.name} />

        <div className='min-w-0 flex-1'>
          <div className='lg:hidden'>
            <AdminNav />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
