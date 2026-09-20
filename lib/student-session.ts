import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { authSecret, readToken, signToken } from './crypto';
import { findStudentById, type PublicStudent } from './students';

/**
 * Student sessions.
 *
 * Deliberately a separate cookie from the coach's. Both are signed with the
 * same secret, but keeping them in different cookies means no bug in a role
 * check can turn a student session into a coach one — the coach's layout only
 * ever reads its own cookie.
 */

export const STUDENT_COOKIE = 'stillpoint_student';
const SESSION_DAYS = 30;

type StudentPayload = {
  sub: 'student';
  uid: string;
  iat: number;
  exp: number;
};

export async function startStudentSession(id: string): Promise<boolean> {
  const key = authSecret();
  if (!key) return false;

  const now = Math.floor(Date.now() / 1000);
  const token = await signToken(
    {
      sub: 'student',
      uid: id,
      iat: now,
      exp: now + SESSION_DAYS * 24 * 60 * 60,
    } satisfies StudentPayload,
    key,
  );

  const store = await cookies();
  store.set(STUDENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return true;
}

export async function endStudentSession(): Promise<void> {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}

/**
 * The authoritative check for the account area. Memoised per render pass, so a
 * layout and the pages beneath it share one verification and one lookup.
 */
export const currentStudent = cache(async (): Promise<PublicStudent | null> => {
  // Read the cookie FIRST. Returning before touching cookies() means Next sees
  // no dynamic signal and happily prerenders the page as static — which bakes
  // a signed-out render into the build output. An auth-gated route must never
  // be static.
  const store = await cookies();
  const token = store.get(STUDENT_COOKIE)?.value;
  if (!token) return null;

  const key = authSecret();
  if (!key) return null;

  const payload = await readToken<StudentPayload>(token, key);
  if (!payload) return null;
  if (payload.sub !== 'student' || typeof payload.uid !== 'string') return null;
  if (typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  // The account must still exist. A signed token for a deleted account is not
  // a valid session.
  return findStudentById(payload.uid);
});
