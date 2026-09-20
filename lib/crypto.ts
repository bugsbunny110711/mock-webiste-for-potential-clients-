import 'server-only';

/**
 * Shared signing and password primitives.
 *
 * The coach's panel and student accounts both sign their session cookies here,
 * so there is one implementation to get right rather than two.
 */

export function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Buffer.from(view).toString('base64url');
}

/** Constant-time comparison, so a value cannot be discovered byte by byte. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function authSecret(): string | null {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;

  if (process.env.NODE_ENV !== 'production') {
    // Development only. Production has no fallback and every caller fails closed.
    return 'dev-only-insecure-secret-not-for-production-use';
  }
  return null;
}

export async function hmacSign(data: string, key: string): Promise<string> {
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

/** `payload.signature`, where the payload is base64url JSON. */
export async function signToken(
  payload: object,
  key: string,
): Promise<string> {
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await hmacSign(body, key)}`;
}

export async function readToken<T>(
  token: string,
  key: string,
): Promise<T | null> {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = await hmacSign(body, key);
  if (!safeEqual(signature, expected)) return null;

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

/*
 * Password hashing.
 *
 * PBKDF2-HMAC-SHA512 at 210,000 iterations, which is the OWASP figure for this
 * construction. Argon2id would be preferable but needs a native dependency;
 * PBKDF2 is available through Web Crypto everywhere this runs.
 *
 * The stored format carries its own parameters, so the iteration count can be
 * raised later and old hashes still verify against the count they were made
 * with.
 */
const PBKDF2_ITERATIONS = 210_000;
const KEY_BITS = 512;

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-512',
    },
    keyMaterial,
    KEY_BITS,
  );
  return base64url(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2-sha512$${PBKDF2_ITERATIONS}$${base64url(salt)}$${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split('$');
  if (scheme !== 'pbkdf2-sha512' || !iterations || !salt || !hash) return false;

  const candidate = await derive(
    password,
    new Uint8Array(Buffer.from(salt, 'base64url')),
    Number(iterations),
  );
  return safeEqual(candidate, hash);
}
