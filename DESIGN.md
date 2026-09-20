# DESIGN.md — Maya Ellison

Design system for a breathwork & yoga coaching site with a private coach admin panel.
This file is the single source of truth. When code and this file disagree, this file wins.

## 1. References

| Reference | What it governs | What it does NOT govern |
|---|---|---|
| **Ease Health** (Refero) | Typography, layout rhythm, flat shadowless surfaces, generous padding, ~14px radii, pill tags | Colour — superseded by the palette below |
| **Amie** (Refero) | Admin panel only: near-achromatic density, shadow-ring instead of borders, weight range 400–700, one accent doing all the work | Anything on the public site |
| **Motion Primitives** | The motion vocabulary (§4) | Its default colours, all of which are replaced |

## 2. Colour

Five client-supplied tones. This palette is the most flexible of those tried: it
gives **two** body-safe text colours and **three** usable surfaces.

| Token | Hex | Name | Role | Contrast on canvas |
|---|---|---|---|---|
| `canvas` | `#F1E4DB` | White Rock | Page background | — |
| `surface` | `#D2CADF` | Grey Goose | Raised: cards, dialogs, panels | 1.3:1 ❌ never text |
| `band` | `#E2D7DD` | — | Section bands (rock/goose midpoint) | — |
| `muted` | `#E1A49A` | Pink Daisy | Decorative fills, secondary surfaces | 1.7:1 ❌ never text |
| `accent` | `#92333C` | Lotus | Every primary action, and a second text colour | **6.1:1** |
| `accent-hover` | `#782A31` | — | Primary button hover | — |
| `ink` | `#372937` | Thunder | Body text, selected states | **11.0:1** (AAA) |
| `ink-hover` | `#291F29` | — | Pressed states | — |

Measured pairings:

- Thunder on White Rock — **11.0:1**, AAA
- Thunder on Grey Goose — **8.6:1**, AAA
- Thunder on Pink Daisy — **6.5:1**, so even the pink carries body text
- Thunder on band — **9.8:1**
- Lotus on White Rock — **6.1:1**, a genuine second text colour
- Lotus on Grey Goose — **4.8:1**, still passes body
- White Rock on Lotus — **6.1:1**, so Lotus works as a button fill
- White Rock on Thunder — **11.0:1**, for inverted panels

**Lotus carries every primary action** — buttons, submits, the sidebar's active
nub. Thunder carries text and selected states (filter pills, today's date, the
active nav row), which are not calls to action and should not compete with them.
Grey Goose and Pink Daisy are surfaces, never text.

**No gradients anywhere.** No linear, radial or conic gradients, and no colour
fades. Every surface is a flat fill; depth comes from the steps between rock,
band, goose, daisy and thunder. This is why the hero has no ambient light, the
dialog scrim is a single wash, the photo placeholders are solid blocks, and the
loading indicator pulses opacity rather than sweeping a gradient across text.

### Semantic — admin panel only
| Token | Hex | Meaning | Contrast on admin canvas |
|---|---|---|---|
| `success` | `#35634A` | Paid, confirmed, completed | 6.2:1 |
| `danger` | `#92333C` | Failed payment, cancellation, refund | 6.9:1 |
| `warning` | `#7E5516` | Pending, awaiting, expiring hold | 5.9:1 |

Danger is Lotus itself — the palette already contains the right red, so
introducing a second one would only muddy it. Never on the public site, and
always paired with an icon or a text label.

### Admin surfaces
`admin-canvas #F7F2EF` · `admin-surface #FFFFFF` · `admin-border #E9E5EF`

Thunder on the admin canvas is 12.3:1.

## 3. Charts

Revalidated against surface `#F7F2EF` after the palette change. A pair checked
against a different surface says nothing about this one.

| Series | Colours | Status |
|---|---|---|
| 1 series | `#B04552` | — |
| 2 series | `#B04552` + `#5B4FA8` | all checks PASS, all-pairs (ΔE 15.2 protan, 22.4 tritan, 20.2 normal) |
| 3+ series | **not allowed** | 3-colour sets in this family fail deutan separation |

Both chart colours are drawn from the palette — rose from Lotus, violet from
Grey Goose — rather than imported from outside it. The obvious pairing of a red
with a green was tested first and **failed**: red and green is precisely the pair
deuteranopes confuse, and the validator put it at ΔE 3.3.

**A chart never carries more than two colours.** Anything with more categories
becomes a sorted horizontal bar chart in a single hue, where position and a
direct label carry identity and colour carries nothing. Hence no pie or donut
anywhere in the admin panel.

Marks: 2px lines, 4px rounded bar ends, 2px surface gap between bars, recessive
`band`-coloured gridlines, tooltips on every plotted chart, and a table view
behind every one.

## 4. Motion

One library (Motion Primitives), one component per job, no overlaps.

| Component | Used for | Never used for |
|---|---|---|
| `TextEffect` `per="word"` `preset="blur"` | Hero `h1` only, on mount | Anything repeated |
| `InView` reveal-text | Section headings + intro copy below the fold | Pricing, FAQ, checkout, admin |
| `InView` reveal-grid | Gallery masonry, course grid | Testimonials |
| `Tilt` | Testimonial cards only | Course cards |
| `Spotlight` | Hero ambient light, once | Everywhere else |
| `MorphingDialog` | 1-1 booking step 1 | Payment (own route) |
| `TextShimmer` | Loading states only | Decoration |
| Sliding auth card | The coach's sign-in card only | Anywhere else |
| Sidebar indicator | The admin rail's active row | The public site |
| Dock magnification | The public site's floating dock | The admin panel |

The public site has no header. Navigation is a frosted dock fixed to the bottom
of the viewport, whose icons magnify as the pointer passes — each item measures
its distance from the pointer and maps it to a width, so the row rests flat when
the pointer is away. Booking keeps the accent fill rather than becoming another
equal icon, because selling sessions is what the site is for. Since the dock has
no visible text, every item carries an `aria-label`, the current page carries
`aria-current`, and a skip link jumps keyboard users to it — it sits last in the
DOM, matching where it appears on screen.

The admin sidebar's active indicator is a single element moved by a CSS custom
property, following the same idea as its reference implementation. The reference
computes the position as `--active-row * --row`, which assumes every row is the
same height; this nav is grouped under headings, so the component measures the
active row and writes `--indicator-y` and `--indicator-h` instead. It is also
set optimistically on click, so the indicator leaves before the route resolves.

The sign-in card is the one motion in the build that is not Motion Primitives.
Its four panels slide past a fixed photograph using compound state selectors
(`.flipped .form.signIn`), which CSS expresses directly and a JS animation
library does not. It lives in `components/admin/auth-card.module.css`, and the
global reduced-motion rule below flattens it to an instant swap for free.

**Global rules**
- Every component checks `prefers-reduced-motion` and falls back to a static state.
- Entrances use `easeOut` ~0.5s. Travel is ~24px, never 100px.
- `InView` is always `once: true`.
- Nothing above the fold waits on a scroll trigger.
- Hero animation resolves in under 600ms (LCP budget).

## 5. Identity

The mark is direction **1A** from the Maya Ellison handoff: an ME ligature
monogram, the M and E sharing a stem, drawn as one continuous breath stroke.
The handoff also offered 1B (an enclosed breath circle); everything draws from
`markPaths` in `components/site/logo.tsx`, so changing direction is a change to
that one constant.

Rules carried over from the handoff:

- **Stroke weight is optically compensated** — 5.5 at large sizes, 6.5 below
  40px. A hairline that reads as elegant at 100px reads as broken at 24px.
- **The mark takes `currentColor`.** The handoff ships its own palette
  (`#6B1F2A` / `#F5EFE6` / `#9A4A46` / `#E4C9BE`) which is close to, but not the
  same as, this site's. A second near-identical red would read as a mistake
  rather than a brand, so the mark is drawn in `accent` / `ink` / `canvas` and
  the handoff's colours are not introduced.
- **Lockups**: horizontal (mark + optional rule + wordmark + tagline) in the
  dock and footer; stacked and centred on the admin sign-in; reversed out of a
  filled badge in the admin rail and the app icon.
- **The wordmark is the existing display face**, Newsreader 300 at .1em
  tracking. The handoff specifies Cormorant Garamond; Newsreader is a close
  stand-in and already loaded, and two more families for the logo alone is not
  a trade worth making.
- **The tagline binds its separators.** The space before each `·` is
  non-breaking, so a line can never start with a dangling `· mindfulness`.

## 6. Typography

- **Display** — Newsreader, weight 300, for `h1`/`h2`. Editorial, unhurried.
- **Body** — Inter, 400–600.
- No mono anywhere on the public site.
- Admin uses Inter only, 400–700 (Amie's range), no display serif.

## 7. Surfaces

Flat and shadowless on the public site — depth comes from layered tints and padding,
never drop shadows. Radius 14px on cards, 999px on tags and slot pills.
Admin inverts this: white cards on warm off-white, separated by a 0.06-opacity shadow
ring rather than a border (Amie's rule).

## 8. Payments & booking

- Booking step 1 (date/time) is a morphing dialog. Step 2 (payment) is a real route
  at `/checkout` — payment never lives in a dismissible overlay.
- A selected slot is held server-side for 10 minutes while checkout runs, so two
  people cannot buy the same time.
- Stripe is stubbed in this build (`lib/payments.ts`); no live keys.

## 9. Photography

Every image on the site is a named slot in `lib/photos.ts`, rendered by
`components/site/photo.tsx`. A slot with no `src` renders a labelled placeholder
carrying the shot brief and the minimum size; a slot with a `src` renders a real
photograph through `next/image`. Nothing else in the codebase references an
image path, so adding a photograph is a one-line change in one file.

The coach's own shot list lives at `/admin/photos`, grouped by shoot and ordered
by priority. Set `SHOW_BRIEFS` to `false` in `lib/photos.ts` to hide the briefs
when demonstrating the site to someone.

## 10. Scope of this build

A demonstration build with seeded mock data in `lib/data.ts`. No database and no live
payment processing.

The coach's panel is password protected for real: `proxy.ts` performs an optimistic
cookie check so the panel never renders for a signed-out visitor, and
`app/admin/(panel)/layout.tsx` performs the authoritative check with `verifySession()`,
which validates an HMAC-SHA256 signature and the expiry. A forged or expired cookie is
rejected there, not merely at the proxy. See README for what else to replace before this
goes live.
