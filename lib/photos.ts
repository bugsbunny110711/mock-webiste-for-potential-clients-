/**
 * Every photograph the site needs, in one place.
 *
 * Each slot renders as a labelled placeholder until a real photograph exists.
 * To drop a real photo in: put the file in `public/photos/`, set `src` below,
 * and the component swaps to `next/image` automatically. Nothing else changes.
 *
 * Set SHOW_BRIEFS to false to hide the shot notes when demonstrating the site.
 */

export const SHOW_BRIEFS = true;

export type PhotoSlot = {
  /** Real alt text, used once the photograph lands. */
  alt: string;
  /** What to shoot. Shown on the placeholder. */
  brief: string;
  /** Recommended minimum pixel size, shown on the placeholder. */
  size: string;
  /** Set this to a path under /public to use a real photograph. */
  src?: string;
};

export const photos = {
  'coach-portrait': {
    alt: 'Maya Ellison, breathwork facilitator and yoga teacher',
    brief: 'Coach portrait — head and shoulders, looking at camera, natural light',
    size: '1200 × 1500',
  },
  'coach-portrait-seated': {
    alt: 'Maya Ellison seated in the studio',
    brief: 'Coach seated in the studio, three-quarter view, relaxed',
    size: '1200 × 1500',
  },
  'coach-teaching': {
    alt: 'Maya Ellison teaching a breathwork session',
    brief: 'Coach mid-teaching — talking, hands visible, students out of focus',
    size: '1600 × 1200',
  },
  'coach-adjusting': {
    alt: 'Maya Ellison giving a hands-on adjustment',
    brief: 'Coach giving a hands-on adjustment (get written consent from the student)',
    size: '1600 × 1200',
  },
  'coach-demonstrating': {
    alt: 'Maya Ellison demonstrating a breathing practice',
    brief: 'Coach demonstrating a breath practice, seated, side light',
    size: '1200 × 1500',
  },
  'studio-wide': {
    alt: 'The studio space, set up for a class',
    brief: 'Studio wide shot — mats laid out, empty, morning light',
    size: '2000 × 1333',
  },
  'studio-detail': {
    alt: 'Props and bolsters in the studio',
    brief: 'Detail — bolsters, blankets, a candle. Close and warm',
    size: '1200 × 1200',
  },
  'class-group': {
    alt: 'A small group class in progress',
    brief: 'Group class in savasana or a long hold (everyone consented and named)',
    size: '2000 × 1333',
  },
  'retreat-portugal': {
    alt: 'The retreat setting in the Alentejo',
    brief: 'Retreat location — landscape, terrace or practice space outdoors',
    size: '2000 × 1333',
  },
  'retreat-devon': {
    alt: 'The retreat farmhouse in Devon',
    brief: 'Devon farmhouse exterior or the barn practice space',
    size: '2000 × 1333',
  },
  'course-breath-foundations': {
    alt: 'Breath Foundations course',
    brief: 'Course cover — hands on ribs, or a close portrait mid-breath',
    size: '1600 × 1067',
  },
  'course-slow-yoga': {
    alt: 'Slow Yoga course',
    brief: 'Course cover — a long hold, low light, full body',
    size: '1600 × 1067',
  },
  'course-deep-rest': {
    alt: 'Deep Rest course',
    brief: 'Course cover — restorative shape with props, blanket, dim',
    size: '1600 × 1067',
  },
  'course-breathwork-for-teachers': {
    alt: 'Breathwork for Teachers course',
    brief: 'Course cover — teaching a teacher, notes and manuals visible',
    size: '1600 × 1067',
  },
  'journal-nervous-system': {
    alt: 'Illustration for an article on the nervous system',
    brief: 'Article image — abstract, calm, or a detail shot of the studio',
    size: '1600 × 900',
  },
  'journal-sleep': {
    alt: 'Illustration for an article on sleep',
    brief: 'Article image — evening light, low and quiet',
    size: '1600 × 900',
  },
  'journal-teaching': {
    alt: 'Illustration for an article on teaching breathwork',
    brief: 'Article image — teaching context, hands or notes',
    size: '1600 × 900',
  },
} as const satisfies Record<string, PhotoSlot>;

export type PhotoId = keyof typeof photos;

/**
 * Typed accessor. The `as const` above narrows each entry to its literal shape,
 * which drops the optional `src`; this widens it back to PhotoSlot so callers
 * can check whether a real photograph has landed yet.
 */
export function getPhoto(id: PhotoId): PhotoSlot {
  return photos[id];
}

/** Slots still waiting on a real photograph — surfaced in the admin panel. */
export function missingPhotos(): { id: PhotoId; slot: PhotoSlot }[] {
  return (Object.keys(photos) as PhotoId[])
    .map((id) => ({ id, slot: photos[id] as PhotoSlot }))
    .filter(({ slot }) => !slot.src);
}
