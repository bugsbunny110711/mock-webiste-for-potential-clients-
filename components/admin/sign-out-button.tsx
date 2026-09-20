import { logout } from '@/lib/auth-actions';

export function SignOutButton() {
  return (
    <form action={logout} className='ml-auto'>
      <button
        type='submit'
        title='Sign out'
        aria-label='Sign out'
        className='grid size-8 place-items-center rounded-lg opacity-55 transition-opacity hover:opacity-100'
      >
        <svg viewBox='0 0 16 16' className='size-4' aria-hidden>
          <path
            d='M6 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14H6M10.5 11l3-3-3-3M13 8H6'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.3'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </form>
  );
}
