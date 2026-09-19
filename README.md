# Still Point — breathwork & yoga coaching site

A demonstration site for a life coach who teaches breathwork and yoga: a public
site that sells courses and one-to-one sessions, and a private admin panel where
the coach can see what is selling, why people are arriving, and everything she is
committed to in one calendar.

Built with Next.js 16 (App Router), React 19, Tailwind v4 and Motion.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run lint
```

## What is here

**Public site**

| Route | What it is |
|---|---|
| `/` | Hero, featured courses, about strip, one-to-one pricing, testimonials, gallery, FAQ |
| `/courses` | All four courses |
| `/courses/[slug]` | Course detail with syllabus and a sticky enrolment panel |
| `/about` | Long-form about page, training history, gallery |
| `/book` | Three session types, each opening a booking dialog |
| `/checkout` | Order summary and payment form (stubbed) |

**Admin panel** — `/admin`

| Route | What it is |
|---|---|
| `/admin` | Revenue, KPIs, today's schedule, course sales, traffic, recent orders |
| `/admin/calendar` | Master calendar — courses, one-to-ones, admin time and personal blocks together |
| `/admin/bookings` | Every order, filterable by status |
| `/admin/courses` | Course performance by volume and by revenue |
| `/admin/audience` | Where people come from, and what they say brought them |

The design system — palette, motion rules, chart rules — is documented in
[`DESIGN.md`](./DESIGN.md), which is the source of truth for the build.

## What is real and what is not

This is a demonstration build. Everything renders and behaves correctly, but the
data underneath it is seeded, not stored.

- **`lib/data.ts`** and **`lib/admin-data.ts`** are hand-written fixtures.
  Nothing persists; a refresh resets everything.
- **`lib/payments.ts`** is a stub. No card details are collected and nothing is
  charged. In production this becomes a Stripe Checkout Session created on the
  server.
- **The admin panel has no authentication.** It is deliberately reachable so it
  can be demonstrated. It must be put behind a login before this is deployed
  anywhere public.
- **Every image is a generated SVG placeholder**
  (`components/site/placeholder-image.tsx`). The site needs real photography —
  around a dozen images of the coach teaching, the space, and retreat settings.
  This is the largest content gap.
- **Slot holds are described but not enforced.** The checkout page tells the
  customer their slot is held for ten minutes; making that true needs a server
  with a lock and a TTL, or two people can buy the same time.

## Before this goes live

1. Put `/admin` behind authentication.
2. Replace the two data modules with a real database.
3. Wire Stripe properly — Checkout Sessions server-side, webhooks for
   fulfilment, and never a secret key in client code.
4. Implement the slot hold, or accept double bookings.
5. Replace every placeholder image with real photography.
6. Add the health screening form referenced at checkout, and decide where those
   answers are stored — they are health data and carry obligations under UK GDPR.
7. Replace the placeholder copy with the coach's own words.
