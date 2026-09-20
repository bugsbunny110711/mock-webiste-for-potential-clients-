'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { safeEqual } from './crypto';
import { endSession, isAuthConfigured, startSession } from './session';

export type LoginState = { error: string | null };

/**
 * Only ever redirect to somewhere inside the panel.
 *
 * `next` arrives from the query string, so it is attacker-controllable. Without
 * this an attacker could send the coach a sign-in link that bounces her to
 * their own site once she authenticates.
 */
function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '';
  if (!value.startsWith('/admin')) return '/admin';
  // Rejects "//evil.com" (protocol-relative) and backslash variants browsers
  // may normalise into one.
  if (value.startsWith('//') || value.includes('\\')) return '/admin';
  if (value === '/admin/login') return '/admin';
  return value;
}

/**
 * Attempt tracking, so the password cannot be guessed at speed.
 *
 * This lives in memory: it resets when the server restarts and is per-instance,
 * so it is a speed bump rather than a real defence. A deployment running more
 * than one instance should move this to shared storage.
 */
const attempts = new Map<string, { count: number; firstAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  record.count += 1;
  return {
    allowed: record.count <= MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - record.count),
  };
}

function expectedPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) return configured;

  if (process.env.NODE_ENV !== 'production') {
    // Development convenience only. Production returns null and login fails.
    return 'breathe';
  }
  return null;
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return {
      error:
        'This deployment has no admin password set. Add ADMIN_PASSWORD and AUTH_SECRET to the environment.',
    };
  }

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const { allowed } = rateLimit(ip);
  if (!allowed) {
    return {
      error: 'Too many attempts. Wait fifteen minutes and try again.',
    };
  }

  const submitted = String(formData.get('password') ?? '');
  const expected = expectedPassword();

  // Compared in constant time, and the message never distinguishes between a
  // wrong password and an unset one.
  if (!expected || !safeEqual(submitted, expected)) {
    return { error: 'That password is not right.' };
  }

  const started = await startSession(formData.get('remember') === 'on');
  if (!started) {
    return {
      error: 'Could not start a session — AUTH_SECRET is missing or too short.',
    };
  }

  attempts.delete(ip);
  redirect(safeNext(formData.get('next')));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect('/admin/login');
}
