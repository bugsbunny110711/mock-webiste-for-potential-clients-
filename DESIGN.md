# DESIGN.md — Still Point

Design system for a breathwork & yoga coaching site with a private coach admin panel.
This file is the single source of truth. When code and this file disagree, this file wins.

## 1. References

| Reference | What it governs | What it does NOT govern |
|---|---|---|
| **Ease Health** (Refero) | Typography, layout rhythm, flat shadowless surfaces, generous padding, ~14px radii, pill tags | Colour — superseded by the palette below |
| **Amie** (Refero) | Admin panel only: near-achromatic density, shadow-ring instead of borders, weight range 400–700, one accent doing all the work | Anything on the public site |
| **Motion Primitives** | The motion vocabulary (§4) | Its default colours, all of which are replaced |

## 2. Colour

Five client-supplied tones. Unlike the previous palette, this one has two
text-safe pairings and a genuine dark surface.

| Token | Hex | Name | Role | Contrast on canvas |
|---|---|---|---|---|
| `canvas` | `#E5E1DD` | SAND | Page background | — |
| `surface` | `#C0D5D6` | AQUA | Raised: cards, dialogs, panels | — |
| `band` | `#D3DBDA` | — | Section bands (sand/aqua midpoint) | — |
| `muted` | `#A58D66` | GOLD | Dividers, decoration | 2.4:1 ❌ never text |
| `accent` | `#407E8C` | TEAL | UI accents, large text only | 3.5:1 ⚠ |
| `ink` | `#083A4F` | NAVY | All body text, primary buttons | **9.3:1** (AAA) |
| `ink-hover` | `#062C3B` | — | Button hover / pressed | — |

Measured pairings:

- Navy on sand — **9.3:1**, clears AAA
- Navy on aqua — **7.9:1**, clears AAA
- Navy on band — **8.6:1**
- Sand on navy — **9.3:1**, so inverted panels and dark buttons are safe
- Teal on sand — **3.5:1**, large text (24px+) or UI only, never body copy
- Gold on sand — **2.4:1**, decorative only

**Navy is the only body-text colour.** Teal is legal for headings and UI borders
but never for paragraphs; gold is never text at all. De-emphasis is done with
size, weight and opacity — navy at 70% still clears 4.5:1 on sand, which the
previous palette's ink could not manage.

**No gradients anywhere.** No linear, radial or conic gradients, and no colour
fades. Every surface is a flat fill. Depth comes from the difference between
sand, band, aqua and navy, not from a blend. This removed the hero's ambient
light entirely, flattened the dialog scrim to one wash, turned the photo
placeholders into solid blocks, and replaced the loading shimmer — which was a
moving gradient — with an opacity pulse.

### Semantic — admin panel only
| Token | Hex | Meaning | Contrast on admin canvas |
|---|---|---|---|
| `success` | `#1F6B4A` | Paid, confirmed, completed | 5.8:1 |
| `danger` | `#A33529` | Failed payment, cancellation, refund | 6.1:1 |
| `warning` | `#8A6417` | Pending, awaiting, expiring hold | 4.8:1 |

Never on the public site. Always paired with an icon or text label.

### Admin surfaces
`admin-canvas #F1F3F3` · `admin-surface #FFFFFF` · `admin-border #E3ECED`

Cool near-white, so the data is the loudest thing on the page. Navy on it is
10.9:1.

## 3. Charts

Revalidated with the dataviz palette validator against surface `#F1F3F3` after
the palette change — the previous pair was checked against a warm surface and
does not carry over.

| Series | Colours | Status |
|---|---|---|
| 1 series | `#0087A3` | — |
| 2 series | `#0087A3` + `#A8781E` | all checks PASS, all-pairs (ΔE 17.3 protan, 22.6 tritan, 21.0 normal) |
| 3+ series | **not allowed** | 3-colour sets in this family fail deutan separation |

**A chart never carries more than two colours.** Anything with more categories
becomes a sorted horizontal bar chart in a single hue, where position and a
direct label carry identity and colour carries nothing. This is why there is no
pie or donut in the admin panel.

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

## 5. Typography

- **Display** — Newsreader, weight 300, for `h1`/`h2`. Editorial, unhurried.
- **Body** — Inter, 400–600.
- No mono anywhere on the public site.
- Admin uses Inter only, 400–700 (Amie's range), no display serif.

## 6. Surfaces

Flat and shadowless on the public site — depth comes from layered tints and padding,
never drop shadows. Radius 14px on cards, 999px on tags and slot pills.
Admin inverts this: white cards on warm off-white, separated by a 0.06-opacity shadow
ring rather than a border (Amie's rule).

## 7. Payments & booking

- Booking step 1 (date/time) is a morphing dialog. Step 2 (payment) is a real route
  at `/checkout` — payment never lives in a dismissible overlay.
- A selected slot is held server-side for 10 minutes while checkout runs, so two
  people cannot buy the same time.
- Stripe is stubbed in this build (`lib/payments.ts`); no live keys.

## 8. Photography

Every image on the site is a named slot in `lib/photos.ts`, rendered by
`components/site/photo.tsx`. A slot with no `src` renders a labelled placeholder
carrying the shot brief and the minimum size; a slot with a `src` renders a real
photograph through `next/image`. Nothing else in the codebase references an
image path, so adding a photograph is a one-line change in one file.

The coach's own shot list lives at `/admin/photos`, grouped by shoot and ordered
by priority. Set `SHOW_BRIEFS` to `false` in `lib/photos.ts` to hide the briefs
when demonstrating the site to someone.

## 9. Scope of this build

A demonstration build with seeded mock data in `lib/data.ts`. No database and no live
payment processing.

The coach's panel is password protected for real: `proxy.ts` performs an optimistic
cookie check so the panel never renders for a signed-out visitor, and
`app/admin/(panel)/layout.tsx` performs the authoritative check with `verifySession()`,
which validates an HMAC-SHA256 signature and the expiry. A forged or expired cookie is
rejected there, not merely at the proxy. See README for what else to replace before this
goes live.
