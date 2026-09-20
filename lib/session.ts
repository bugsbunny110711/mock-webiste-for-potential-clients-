import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { authSecret, readToken, signToken } from './crypto';

/**
 * Single-user session handling for the coach's panel.
 *
 * There is no user table here, because there is exactly one user. A successful
 * password check mints a signed, stateless token held in an HTTP-only cookie.
 * The signature is HMAC-SHA256 over the payload, so the cookie cannot be forged
 * or its expiry extended without the secret.
 *
 * When this grows a second user, replace the token payload with a session ID
 * and look it up in the database — the rest of the shape stays the same.
 */

export const SESSION_COOKIE = 'stillpoint_coach';
/** A normal sign-in lasts a week; "remember me" lasts a month. */
const SESSION_DAYS = 7;
const REMEMBERED_DAYS = 30;

type SessionPayload = {
  /** Who the session is for. One value today; a user ID later. */
  sub: 'coach';
  /** Issued at, epoch seconds. */
  iat: number;
  /** Expires at, epoch seconds. Verified server-side, not trusted from the cookie alone. */
  exp: number;
};

export async function createSessionToken(
  days = SESSION_DAYS,
): Promise<string | null> {
  const key = authSecret();
  if (!key) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: 'coach',
    iat: now,
    exp: now + days * 24 * 60 * 60,
  };

  return signToken(payload, key);
}

async function readCoachToken(token: string): Promise<SessionPayload | null> {
  const key = authSecret();
  if (!key) return null;

  const payload = await readToken<SessionPayload>(token, key);
  if (!payload) return null;

  // A student token is signed with the same secret, so the subject check is
  // what stops one being accepted here.
  if (payload.sub !== 'coach') return null;
  if (typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

/**
 * The authoritative check. Memoised per render pass so a layout and the pages
 * beneath it share one verification.
 */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readCoachToken(token);
});

export async function startSession(remember = false): Promise<boolean> {
  const days = remember ? REMEMBERED_DAYS : SESSION_DAYS;
  // The expiry is signed into the token, so trimming the cookie's own maxAge
  // cannot extend a session — both have to agree.
  const token = await createSessionToken(days);
  if (!token) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: days * 24 * 60 * 60,
  });
  return true;
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** False when the deployment has no password set — login then fails closed. */
export function isAuthConfigured(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  return Boolean(process.env.ADMIN_PASSWORD && authSecret());
}
