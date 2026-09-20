import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';

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

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Buffer.from(view).toString('base64url');
}

function secret(): string | null {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;

  if (process.env.NODE_ENV !== 'production') {
    // Development only. Production has no fallback and fails closed below.
    return 'dev-only-insecure-secret-not-for-production-use';
  }
  return null;
}

async function sign(data: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(data),
  );
  return base64url(signature);
}

/** Constant-time comparison, so a wrong signature cannot be found byte by byte. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(
  days = SESSION_DAYS,
): Promise<string | null> {
  const key = secret();
  if (!key) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: 'coach',
    iat: now,
    exp: now + days * 24 * 60 * 60,
  };

  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(body, key);
  return `${body}.${signature}`;
}

async function readToken(token: string): Promise<SessionPayload | null> {
  const key = secret();
  if (!key) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = await sign(body, key);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as SessionPayload;

    if (payload.sub !== 'coach') return null;
    if (typeof payload.exp !== 'number') return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * The authoritative check. Memoised per render pass so a layout and the pages
 * beneath it share one verification.
 */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readToken(token);
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
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}
