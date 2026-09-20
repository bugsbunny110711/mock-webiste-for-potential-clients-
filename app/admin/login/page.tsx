import type { Metadata } from 'next';
import { AuthCard } from '@/components/admin/auth-card';
import { coach } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Coach sign in — Still Point',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // A default password exists only outside production; the form says so plainly
  // rather than leaving someone guessing.
  const isDev =
    process.env.NODE_ENV !== 'production' && !process.env.ADMIN_PASSWORD;

  return (
    <main className='flex min-h-screen items-center justify-center bg-admin-canvas px-4 py-10 sm:px-6'>
      <div className='w-full max-w-4xl'>
        <div className='mb-7 text-center'>
          <p className='font-display text-2xl font-light'>{coach.brand}</p>
          <p className='mt-1 text-xs tracking-widest uppercase opacity-55'>
            Coach panel
          </p>
        </div>

        <AuthCard isDev={isDev} next={next} />
      </div>
    </main>
  );
}
