import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';
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
    <main className='flex min-h-screen items-center justify-center bg-admin-canvas px-6 py-16'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 text-center'>
          <p className='font-display text-2xl font-light'>{coach.brand}</p>
          <p className='mt-1 text-xs tracking-widest uppercase opacity-60'>
            Coach panel
          </p>
        </div>

        <div className='rounded-2xl bg-admin-surface p-7 shadow-[0_0_0_1px_rgba(87,64,30,0.06),0_1px_2px_rgba(87,64,30,0.04)]'>
          <h1 className='font-sans text-lg font-semibold tracking-tight'>
            Sign in
          </h1>
          <p className='mt-1 mb-6 text-sm opacity-65'>
            This panel is for {coach.name} only.
          </p>

          <LoginForm isDev={isDev} next={next} />
        </div>

        <p className='mt-6 text-center text-xs opacity-60'>
          <Link href='/' className='hover:opacity-100'>
            ← Back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}
