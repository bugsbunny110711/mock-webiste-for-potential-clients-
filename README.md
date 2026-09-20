# Still Point — breathwork & yoga coaching site

A demonstration site for a life coach who teaches breathwork and yoga: a public
site that sells courses and one-to-one sessions, and a private admin panel where
the coach can see what is selling, why people are arriving, and everything she is
committed to in one calendar.

Built with Next.js 16 (App Router), React 19, Tailwind v4 and Motion.

## Running it

```bash
npm install
cp .env.example .env.local   # optional in development, required in production
npm run dev                  # http://localhost:3000
```

The coach's panel at `/admin` is password protected. In development, with no
`ADMIN_PASSWORD` set, the password is `breathe` and the sign-in page says so.
In production there is no fallback: without `ADMIN_PASSWORD` and `AUTH_SECRET`
sign-in fails closed and nobody can reach the panel.

```bash
# Generating a secret for .env.local
openssl rand -base64 32
```

```bash
npm run build && npm start   # production build
npm run lint
npx tsc --noEmit
```

Those three checks also run automatically on every push and pull request — see
`.github/workflows/ci.yml`. They need no secrets: the build does not read
`ADMIN_PASSWORD` or `AUTH_SECRET`.

## What is here

**Public site**

| Route | What it is |
|---|---|
| `/` | Hero, featured courses, about strip, one-to-one pricing, testimonials, gallery, FAQ |
| `/courses` | All four courses |
| `/courses/[slug]` | Course detail with syllabus and a sticky enrolment panel |
| `/about` | Long-form about page, training history, gallery |
| `/retreats`, `/retreats/[slug]` | Two retreats, with itinerary and what is included |
| `/workshops` | Workshops for teams — three formats and indicative pricing |
| `/journal`, `/journal/[slug]` | Three long-form articles |
| `/book` | Three session types, each opening a booking dialog |
| `/checkout` | Order summary and payment form (stubbed) |
| `/contact` | Enquiry form, handled by a Server Function |
| `/account` | Student area — courses bought, progress, recordings |
| `/account/login` | Sign in and registration, on a sliding card |
| `/terms`, `/privacy` | Refund policy, health disclaimer, UK GDPR wording |

Plus `not-found.tsx`, `sitemap.xml` and `robots.txt` (which keeps `/admin` and
`/checkout` out of search results).

**Admin panel** — `/admin`

| Route | What it is |
|---|---|
| `/admin` | Revenue, KPIs, today's schedule, course sales, traffic, recent orders |
| `/admin/calendar` | Master calendar — courses, one-to-ones, admin time and personal blocks together |
| `/admin/bookings` | Every order, filterable by status |
| `/admin/enquiries` | Contact form messages, unanswered first |
| `/admin/students` | Everyone who has bought, with health-form status and notes |
| `/admin/courses` | Course performance by volume and by revenue |
| `/admin/retreats` | Who is booked on each retreat, and whose balance is outstanding |
| `/admin/audience` | Traffic sources, stated reasons, and the mailing list |
| `/admin/availability` | Working hours, blocked dates, and the booking rules |
| `/admin/photos` | The photo shot list — what is still needed and where it goes |

The palette is White Rock `#F1E4DB`, Grey Goose `#D2CADF`, Pink Daisy `#E1A49A`,
Lotus `#92333C` and Thunder `#372937`, with no gradients anywhere. The design
system — palette,
motion rules, chart rules — is documented in
[`DESIGN.md`](./DESIGN.md), which is the source of truth for the build.

## What is real and what is not

This is a demonstration build. Everything renders and behaves correctly, but the
data underneath it is seeded, not stored.

- **`lib/data.ts`** and **`lib/admin-data.ts`** are hand-written fixtures.
  Nothing persists; a refresh resets everything.
- **The contact form and mailing list sign-up** (`lib/actions.ts`) validate
  properly and return real acknowledgements, but nothing is stored or emailed.
  A real mailing list also needs double opt-in — a confirmation email that
  subscribes only on the click — which UK PECR expects and which keeps the list
  clean.
- **`lib/payments.ts`** is a stub. No card details are collected and nothing is
  charged. In production this becomes a Stripe Checkout Session created on the
  server.
- **Student accounts are real but not persistent.** Passwords are hashed with
  PBKDF2-HMAC-SHA512 at 210,000 iterations and sessions are signed, but the
  account store is an in-memory Map (`lib/students.ts`): accounts created at
  runtime vanish on restart and are not shared between instances. Swapping the
  Map for a database table is the whole migration.
- **The admin panel is password protected**, with a signed HTTP-only session
  cookie, a constant-time password comparison, and basic attempt throttling.
  It is genuine, but it is single-user and deliberately simple: one shared
  password, no reset flow, no second factor, and the attempt counter lives in
  memory so it resets on restart and does not span instances.
- **Photographs can be uploaded from the panel**, by dropping a file onto any
  slot at `/admin/photos`. This works when the site is run locally: the file is
  written to `public/photos/` and `lib/photo-overlay.ts` is regenerated to point
  at it. On a hosted deployment the filesystem is read-only, so the upload fails
  with an explanation — making it work live needs object storage (Vercel Blob)
  plus a database row for the mapping.
- **Every image is a labelled photo slot.** All seventeen live in
  `lib/photos.ts`, and each renders a placeholder carrying its shot brief until a
  real photograph exists. The coach's shot list is at `/admin/photos`.
  To add a photograph: save it to `public/photos/`, set `src` on that slot, and
  it is served through `next/image` automatically. This is the largest content
  gap — the five portraits and teaching shots matter most.
- **Slot holds are described but not enforced.** The checkout page tells the
  customer their slot is held for ten minutes; making that true needs a server
  with a lock and a TTL, or two people can buy the same time.

## Before this goes live

1. Set `ADMIN_PASSWORD` and `AUTH_SECRET` in the deployment environment, and
   move attempt throttling out of memory if more than one instance runs.
2. Replace the two data modules with a real database.
3. Wire Stripe properly — Checkout Sessions server-side, webhooks for
   fulfilment, and never a secret key in client code.
4. Implement the slot hold, or accept double bookings.
5. Shoot the photography and fill in the slots — start with the five in the
   "You" group at `/admin/photos`.
6. Add the health screening form referenced at checkout, and decide where those
   answers are stored — they are health data and carry obligations under UK GDPR.
7. Replace the placeholder copy with the coach's own words.
8. Have a solicitor review `/terms` and `/privacy` — both are plausible
   placeholder wording, not advice, and the site handles health data.
9. Point `SITE_URL` in `lib/site.ts` at the real domain so the sitemap and
   canonical URLs are correct.
