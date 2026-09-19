/**
 * ─────────────────────────────────────────────────────────────
 *  BREATHWIZ — SINGLE SOURCE OF TRUTH FOR THE BRAND
 * ─────────────────────────────────────────────────────────────
 *
 *  This is the ONE file to edit when re-selling this site to a
 *  different coach. Change the values below and the whole site
 *  updates: name, coach, colours, contact details, social links.
 *
 *  You do NOT need to touch any other file to re-brand.
 *
 *  Colours are also mirrored into CSS variables automatically
 *  (see app/globals.css), so changing a hex here changes every
 *  gradient, glow and glass panel across the site.
 */

export const brand = {
  /** Company / product name shown in the logo, page titles and footer. */
  name: 'BreathWiz',

  /** Short tagline under the logo and in share previews. */
  tagline: 'Breathe with intention',

  /** The coach this site belongs to. */
  coach: {
    name: 'Priya Sharma',
    /** Shown under her name on the About page and in the hero. */
    title: 'Certified Breathwork Facilitator',
    /** Where she is based — shown on About and Contact. */
    location: 'Bengaluru, India',
  },

  /** Contact details — used on Contact, FAQ and in the footer. */
  contact: {
    email: 'hello@breathwiz.example',
    phone: '+91 80 4000 1234',
    /** Default timezone for the booking calendar. */
    timezone: 'Asia/Kolkata',
    timezoneLabel: 'IST',
  },

  /** Social links. Leave a value as an empty string to hide that icon. */
  social: {
    instagram: 'https://instagram.com/breathwiz.example',
    youtube: 'https://youtube.com/@breathwiz.example',
    linkedin: '',
  },

  /**
   * Required disclosure for this demo build.
   * Editable later from the admin panel (Settings → Footer note).
   */
  footerNote: 'Demo website. All people and content are fictional.',

  /**
   * ── COLOURS ──────────────────────────────────────────────
   * The palette is deliberately small. Every surface on the site
   * is built from these, so they stay in harmony when changed.
   */
  colors: {
    /** Page background — a deep blue-green ink, never pure black. */
    ink: '#081215',
    /** One step deeper, used for the opening cover and footers. */
    abyss: '#050C0E',
    /** Raised surfaces sitting above the page background. */
    slate: '#0E1E22',

    /** Primary accent — the "breath" colour. Glows, CTAs, the orb. */
    aqua: '#5FD3C4',
    /** Cooler support tone for gradients and depth. */
    tide: '#3E9C9B',
    /** Warm luxury accent — prices, highlights, gold details. */
    sand: '#E4C89A',
    /** Soft depth tone used in layered gradients. */
    lilac: '#A79BD1',

    /** Main text on dark backgrounds. */
    cream: '#F2EFE8',
    /** Secondary/muted text. Passes contrast on ink and slate. */
    mist: '#9FB3B5',
  },

  /**
   * ── TYPOGRAPHY ───────────────────────────────────────────
   * Both are variable fonts, self-hosted in /public/fonts.
   * Replacing them means swapping the .woff2 files and the
   * @font-face rules in app/globals.css.
   */
  fonts: {
    display: '"Fraunces", Georgia, serif',
    body: '"DM Sans", system-ui, -apple-system, sans-serif',
  },
} as const;

export type Brand = typeof brand;
