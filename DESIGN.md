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

Five client-supplied tones. Only `ink` is legible as text — the rest are surfaces.

| Token | Hex | Role | Contrast on canvas |
|---|---|---|---|
| `canvas` | `#E9E4D9` | Page background | — |
| `surface` | `#E1D0BC` | Raised: course cards, testimonials, dialogs | — |
| `band` | `#C8C2A9` | Section bands, borders, unavailable states | 1.4:1 ❌ never text |
| `muted` | `#B9A287` | Dividers, icon fills, decoration | 1.9:1 ❌ never text |
| `ink` | `#57401E` | All text, all primary button fills | **7.7:1** (AAA) |
| `ink-hover` | `#3E2E15` | Button hover / pressed | — |

Ink on `surface` is **6.5:1**; cream on ink is **7.7:1**, so brown buttons with cream
labels are safe.

**There is no secondary text colour.** De-emphasis is done with size and weight, never
by lightening toward `muted`. This is a hard rule — `muted` on `canvas` is 1.9:1.

### Semantic — admin panel only
| Token | Hex | Meaning | Contrast |
|---|---|---|---|
| `success` | `#5C6B4A` | Paid, confirmed, completed | 4.5:1 |
| `danger` | `#8C4A32` | Failed payment, cancellation, refund | 5.3:1 |
| `warning` | `#A9761F` | Pending, awaiting, expiring hold | 4.0:1 |

Never on the public site. Always paired with an icon or text label — never colour alone.

### Admin surfaces (Amie)
`admin-canvas #F7F4EE` · `admin-surface #FFFFFF` · `admin-border #E7E1D6`

Warm enough to belong to the same brand, light enough for dense data.

## 3. Charts

Validated with the dataviz palette validator against surface `#F7F4EE`.

| Series | Colours | Status |
|---|---|---|
| 1 series | `#C05A26` | — |
| 2 series | `#C05A26` + `#0087A3` | all checks PASS, all-pairs (ΔE 17.3 protan, 25.0 normal) |
| 3+ series | **not allowed** | 3-colour sets fail deutan separation (ΔE 4.9) |

**A chart never carries more than two colours.** Anything with more categories becomes a
sorted horizontal bar chart in a single hue, where position and a direct label carry
identity and colour carries nothing. This is why there is no pie or donut anywhere in
the admin panel: a 5-slice donut in this palette is unreadable to a deuteranope.

Marks: 2px lines, 4px rounded bar ends, 2px surface gap between bars, recessive
`band`-coloured gridlines, tooltips on every plotted chart.

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
