import type { Metadata } from 'next';
import { AccountAuthCard } from '@/components/account/account-auth-card';
import { DEMO_PASSWORD } from '@/lib/students';

export const metadata: Metadata = {
  title: 'Your account — Maya Ellison',
  robots: { index: false, follow: false },
};

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl sm:text-5xl'>Your practice, wherever you are.</h1>
        <p className='mx-auto mt-4 max-w-lg opacity-85'>
          Every course you have taken, every recording, for a year from the day
          it started.
        </p>
      </div>

      <AccountAuthCard
        next={next}
        demoPassword={process.env.NODE_ENV !== 'production' ? DEMO_PASSWORD : undefined}
      />
    </div>
  );
}
