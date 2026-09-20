import type { Metadata } from 'next';
import { AuthCard } from '@/components/admin/auth-card';
import { BrandMark, BrandWordmark } from '@/components/site/logo';

export const metadata: Metadata = {
  title: 'Coach sign in — Maya Ellison',
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
        <div className='mb-7 flex flex-col items-center gap-4 text-center text-accent'>
          <BrandMark size={44} />
          <div>
            <BrandWordmark className='text-2xl' />
            <p className='mt-1.5 text-xs tracking-widest uppercase opacity-55'>
              Coach panel
            </p>
          </div>
        </div>

        <AuthCard isDev={isDev} next={next} />
      </div>
    </main>
  );
}
