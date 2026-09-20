import { signOut } from '@/lib/student-actions';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type='submit'
        className='rounded-full border border-ink/25 px-5 py-2 text-sm transition-colors hover:bg-surface'
      >
        Sign out
      </button>
    </form>
  );
}
