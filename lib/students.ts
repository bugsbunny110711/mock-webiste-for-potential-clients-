import 'server-only';

import { hashPassword, verifyPassword } from './crypto';

/**
 * Student accounts.
 *
 * THIS STORE IS IN MEMORY. Accounts created at runtime live until the server
 * restarts and are not shared between instances. Passwords are hashed properly
 * (PBKDF2-HMAC-SHA512, see lib/crypto.ts) rather than kept in plain text, so
 * the shape is right — only the persistence is missing. Replacing the Map with
 * a database table is the whole migration.
 */

export type Enrolment = {
  courseSlug: string;
  startedOn: string;
  /** Weeks unlocked so far. A course drips week by week as it is taught. */
  weeksReleased: number;
  completedWeeks: number[];
};

export type StudentAccount = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  enrolments: Enrolment[];
};

export type PublicStudent = Omit<StudentAccount, 'passwordHash'>;

/** The demo password for every seeded account. Development convenience only. */
export const DEMO_PASSWORD = 'practice';

const SEED: Omit<StudentAccount, 'passwordHash'>[] = [
  {
    id: 'stu-aditi',
    name: 'Aditi Raman',
    email: 'aditi.raman@example.com',
    createdAt: '2026-03-11',
    enrolments: [
      {
        courseSlug: 'breath-foundations',
        startedOn: '2026-09-08',
        weeksReleased: 2,
        completedWeeks: [1, 2],
      },
      {
        courseSlug: 'deep-rest',
        startedOn: '2026-09-20',
        weeksReleased: 1,
        completedWeeks: [],
      },
    ],
  },
  {
    id: 'stu-dev',
    name: 'Dev Patel',
    email: 'dev.patel@example.com',
    createdAt: '2025-11-04',
    enrolments: [
      {
        courseSlug: 'slow-yoga',
        startedOn: '2026-08-13',
        weeksReleased: 6,
        completedWeeks: [1, 2, 3, 4, 5],
      },
      {
        courseSlug: 'deep-rest',
        startedOn: '2026-09-20',
        weeksReleased: 1,
        completedWeeks: [],
      },
    ],
  },
  {
    id: 'stu-grace',
    name: 'Grace Okafor',
    email: 'grace.okafor@example.com',
    createdAt: '2026-09-16',
    enrolments: [
      {
        courseSlug: 'breath-foundations',
        startedOn: '2026-09-08',
        weeksReleased: 2,
        completedWeeks: [1],
      },
    ],
  },
];

let storePromise: Promise<Map<string, StudentAccount>> | null = null;

async function store(): Promise<Map<string, StudentAccount>> {
  if (!storePromise) {
    storePromise = (async () => {
      const hash = await hashPassword(DEMO_PASSWORD);
      const map = new Map<string, StudentAccount>();
      for (const student of SEED) {
        map.set(student.email.toLowerCase(), { ...student, passwordHash: hash });
      }
      return map;
    })();
  }
  return storePromise;
}

function toPublic(account: StudentAccount): PublicStudent {
  // Never let the hash out of this module.
  const { passwordHash: _ignored, ...rest } = account;
  void _ignored;
  return rest;
}

export async function findStudentById(
  id: string,
): Promise<PublicStudent | null> {
  const map = await store();
  for (const account of map.values()) {
    if (account.id === id) return toPublic(account);
  }
  return null;
}

export type RegisterResult =
  | { ok: true; student: PublicStudent }
  | { ok: false; reason: 'taken' };

export async function registerStudent(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResult> {
  const map = await store();
  const key = email.toLowerCase();
  if (map.has(key)) return { ok: false, reason: 'taken' };

  const account: StudentAccount = {
    id: `stu-${crypto.randomUUID().slice(0, 8)}`,
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString().slice(0, 10),
    // A new account owns nothing until a purchase is attached to it.
    enrolments: [],
  };
  map.set(key, account);
  return { ok: true, student: toPublic(account) };
}

export async function authenticateStudent(
  email: string,
  password: string,
): Promise<PublicStudent | null> {
  const map = await store();
  const account = map.get(email.toLowerCase());

  if (!account) {
    // Hash anyway so a missing account does not answer faster than a wrong
    // password, which would let someone enumerate who has an account.
    await verifyPassword(
      password,
      'pbkdf2-sha512$210000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAA',
    );
    return null;
  }

  const valid = await verifyPassword(password, account.passwordHash);
  return valid ? toPublic(account) : null;
}

/**
 * Marks a week watched, or unmarks it. In-memory like everything else here, so
 * it survives navigation but not a restart.
 */
export async function setWeekComplete(
  studentId: string,
  courseSlug: string,
  week: number,
  complete: boolean,
): Promise<void> {
  const map = await store();
  for (const account of map.values()) {
    if (account.id !== studentId) continue;
    const enrolment = account.enrolments.find(
      (item) => item.courseSlug === courseSlug,
    );
    if (!enrolment) return;
    // Silently ignore weeks that have not been released — the UI does not offer
    // them, but a form post could still name one.
    if (week < 1 || week > enrolment.weeksReleased) return;

    const done = new Set(enrolment.completedWeeks);
    if (complete) {
      done.add(week);
    } else {
      done.delete(week);
    }
    enrolment.completedWeeks = [...done].sort((a, b) => a - b);
    return;
  }
}
