'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { authenticateStudent, registerStudent, setWeekComplete } from './students';
import { currentStudent } from './student-session';
import { endStudentSession, startStudentSession } from './student-session';

export type AccountState = {
  error: string | null;
  /** Which side of the card the error belongs to, so the right one shows it. */
  panel?: 'signin' | 'register';
};

const attempts = new Map<string, { count: number; firstAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

/** Same in-memory caveat as the coach's throttle — a speed bump, not a defence. */
function rateLimit(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return true;
  }
  record.count += 1;
  return record.count <= MAX_ATTEMPTS;
}

async function clientKey(): Promise<string> {
  const headerList = await headers();
  return headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '';
  if (!value.startsWith('/account')) return '/account';
  if (value.startsWith('//') || value.includes('\\')) return '/account';
  if (value === '/account/login') return '/account';
  return value;
}

export async function signIn(
  _previousState: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (!rateLimit(await clientKey())) {
    return { error: 'Too many attempts. Try again in fifteen minutes.', panel: 'signin' };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const student = await authenticateStudent(email, password);
  // One message for both cases, so this cannot be used to find out who has an
  // account here.
  if (!student) {
    return { error: 'That email and password do not match.', panel: 'signin' };
  }

  if (!(await startStudentSession(student.id))) {
    return { error: 'Could not start a session. Try again shortly.', panel: 'signin' };
  }

  redirect(safeNext(formData.get('next')));
}

export async function register(
  _previousState: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (!rateLimit(await clientKey())) {
    return { error: 'Too many attempts. Try again in fifteen minutes.', panel: 'register' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (name.length < 2) {
    return { error: 'Please give me a name to put on your account.', panel: 'register' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'That email address does not look right.', panel: 'register' };
  }
  if (password.length < 10) {
    return {
      error: 'Please use at least ten characters. Length beats punctuation.',
      panel: 'register',
    };
  }

  const result = await registerStudent(name, email, password);
  if (!result.ok) {
    return {
      error: 'There is already an account with that email. Try signing in.',
      panel: 'register',
    };
  }

  if (!(await startStudentSession(result.student.id))) {
    return { error: 'Account made, but sign-in failed. Try signing in.', panel: 'register' };
  }

  redirect('/account');
}

export async function signOut(): Promise<void> {
  await endStudentSession();
  redirect('/');
}

export async function toggleWeek(formData: FormData): Promise<void> {
  // Authorisation lives here, not in the page: a Server Function is reachable
  // by direct POST, so it re-establishes who is calling before it writes.
  const student = await currentStudent();
  if (!student) redirect('/account/login');

  const courseSlug = String(formData.get('courseSlug') ?? '');
  const week = Number(formData.get('week'));
  const complete = formData.get('complete') === 'true';

  if (!courseSlug || !Number.isInteger(week)) return;

  await setWeekComplete(student.id, courseSlug, week, complete);
  revalidatePath(`/account/courses/${courseSlug}`);
  revalidatePath('/account');
}
