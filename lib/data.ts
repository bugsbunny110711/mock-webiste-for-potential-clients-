/**
 * Seeded demonstration data. Everything here is deterministic — no Math.random,
 * no `new Date()` at module scope — so server and client render identically.
 * Replace this module with real queries when a database is added.
 */

export const coach = {
  name: 'Maya Ellison',
  brand: 'Still Point',
  role: 'Breathwork facilitator & yoga teacher',
  location: 'Bristol, UK',
  email: 'hello@stillpoint.example',
  yearsTeaching: 11,
  trainedHours: 800,
  studentsTaught: 1400,
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  priceGBP: number;
  weeks: number;
  sessionsCount: number;
  level: 'Foundation' | 'Intermediate' | 'All levels';
  format: string;
  includes: string[];
  modules: { title: string; detail: string }[];
  enrolled: number;
  featured?: boolean;
};

export const courses: Course[] = [
  {
    id: 'c-breath-foundations',
    slug: 'breath-foundations',
    title: 'Breath Foundations',
    tagline: 'Six weeks to a nervous system you can steer.',
    description:
      'The starting point. You will learn why your breath changes how you feel, and build a practice short enough that you actually do it. No prior experience, no equipment, no incense required.',
    priceGBP: 185,
    weeks: 6,
    sessionsCount: 6,
    level: 'Foundation',
    format: 'Live online, Tuesdays 7pm UK · recorded',
    includes: [
      'Six 75-minute live sessions',
      'Recordings kept for a year',
      'A 10-minute daily practice audio',
      'Written workbook (PDF)',
      'Small group — capped at 14',
    ],
    modules: [
      { title: 'Week 1 — Noticing', detail: 'Where your breath actually lives, and what it is telling you.' },
      { title: 'Week 2 — Slowing', detail: 'Extending the exhale, and why the body reads it as safety.' },
      { title: 'Week 3 — Steadying', detail: 'Coherent breathing, and building a rhythm you can return to.' },
      { title: 'Week 4 — Under pressure', detail: 'What to do when the technique deserts you.' },
      { title: 'Week 5 — Sleep', detail: 'Down-regulating at the end of a day that will not end.' },
      { title: 'Week 6 — Keeping it', detail: 'Making a practice survive contact with a normal week.' },
    ],
    enrolled: 312,
    featured: true,
  },
  {
    id: 'c-yoga-slow',
    slug: 'slow-yoga',
    title: 'Slow Yoga',
    tagline: 'Eight weeks of moving at the pace of your breath.',
    description:
      'A movement course for people who bounced off fast, loud yoga. Long holds, close attention, and enough anatomy to keep you safe without turning it into a lecture.',
    priceGBP: 240,
    weeks: 8,
    sessionsCount: 8,
    level: 'All levels',
    format: 'Live online, Thursdays 6.30pm UK · recorded',
    includes: [
      'Eight 90-minute live classes',
      'Recordings kept for a year',
      'Prop substitutions for every posture',
      'Two 1-1 check-ins with Maya',
      'Small group — capped at 12',
    ],
    modules: [
      { title: 'Week 1 — Ground', detail: 'Standing, and what your feet have been avoiding.' },
      { title: 'Week 2 — Hips', detail: 'Slow openings, without forcing anything.' },
      { title: 'Week 3 — Spine', detail: 'Six directions, gently.' },
      { title: 'Week 4 — Shoulders', detail: 'Undoing the desk.' },
      { title: 'Week 5 — Balance', detail: 'Falling over, usefully.' },
      { title: 'Week 6 — Strength', detail: 'Holding, not straining.' },
      { title: 'Week 7 — Rest', detail: 'Restorative shapes and long stillness.' },
      { title: 'Week 8 — Your practice', detail: 'Building a sequence that fits your body.' },
    ],
    enrolled: 186,
    featured: true,
  },
  {
    id: 'c-deep-rest',
    slug: 'deep-rest',
    title: 'Deep Rest',
    tagline: 'Four weeks on sleep, stillness and doing less.',
    description:
      'A short course for the chronically wired. Yoga nidra, restorative shapes and breath practices aimed squarely at people who cannot switch off.',
    priceGBP: 120,
    weeks: 4,
    sessionsCount: 4,
    level: 'All levels',
    format: 'Live online, Sundays 8pm UK · recorded',
    includes: [
      'Four 60-minute live sessions',
      'Six guided nidra recordings',
      'A wind-down sequence for bad nights',
      'Recordings kept for a year',
    ],
    modules: [
      { title: 'Week 1 — Winding down', detail: 'The hour before bed, redesigned.' },
      { title: 'Week 2 — Nidra', detail: 'Guided rest, and why it is not napping.' },
      { title: 'Week 3 — The 3am problem', detail: 'What to do when you wake and cannot get back.' },
      { title: 'Week 4 — Keeping the gains', detail: 'A rest practice that holds through a hard week.' },
    ],
    enrolled: 241,
  },
  {
    id: 'c-teacher-breath',
    slug: 'breathwork-for-teachers',
    title: 'Breathwork for Teachers',
    tagline: 'Twelve weeks. For yoga teachers adding breath to their work.',
    description:
      'A professional course for teachers who already hold a room and want to bring breathwork into it safely. Includes contraindications, trauma-aware language, and what to do when someone comes undone in your class.',
    priceGBP: 690,
    weeks: 12,
    sessionsCount: 14,
    level: 'Intermediate',
    format: 'Live online, Mondays 10am UK · recorded',
    includes: [
      'Twelve 2-hour live sessions',
      'Two supervised practicum sessions',
      'Full teaching manual (120pp)',
      'Certificate of completion',
      'Small cohort — capped at 10',
    ],
    modules: [
      { title: 'Weeks 1–3 — Physiology', detail: 'What is actually happening, without the mysticism.' },
      { title: 'Weeks 4–6 — Contraindications', detail: 'Who should not do what, and how to ask.' },
      { title: 'Weeks 7–9 — Language', detail: 'Cueing breath without coercion.' },
      { title: 'Weeks 10–12 — Holding the room', detail: 'Activation, abreaction, and aftercare.' },
    ],
    enrolled: 68,
  },
];

export type SessionType = {
  id: string;
  name: string;
  minutes: number;
  priceGBP: number;
  description: string;
};

export const sessionTypes: SessionType[] = [
  {
    id: 's-discovery',
    name: 'Discovery call',
    minutes: 20,
    priceGBP: 0,
    description: 'A short call to work out whether any of this is right for you. No pitch.',
  },
  {
    id: 's-single',
    name: 'One-to-one session',
    minutes: 60,
    priceGBP: 75,
    description: 'A full session built around whatever you arrive with — breath, movement, or both.',
  },
  {
    id: 's-deep',
    name: 'Extended session',
    minutes: 90,
    priceGBP: 110,
    description: 'Longer, slower, and room for a proper breathwork journey with time to land afterwards.',
  },
];

export const testimonials = [
  {
    id: 't1',
    quote:
      'I had done six months of therapy and still could not get my chest to unclench. Four weeks with Maya and I have something I can actually do at my desk on a Tuesday.',
    name: 'Rachel T.',
    context: 'Breath Foundations',
  },
  {
    id: 't2',
    quote:
      'She is the first teacher who did not make me feel like the least flexible person in the room. Slow Yoga changed how I think about my own body.',
    name: 'Dev P.',
    context: 'Slow Yoga',
  },
  {
    id: 't3',
    quote:
      'I teach full time and wanted to bring breath into my classes without doing harm. The teachers course was rigorous in a way I did not expect.',
    name: 'Anneke V.',
    context: 'Breathwork for Teachers',
  },
  {
    id: 't4',
    quote:
      'Three years of broken sleep. I am not going to claim it is fixed, but I am getting six hours most nights now and I was getting four.',
    name: 'Martin H.',
    context: 'Deep Rest',
  },
  {
    id: 't5',
    quote:
      'Maya holds a room without ever making it about her. That is rarer than it should be.',
    name: 'Priya R.',
    context: 'One-to-one sessions',
  },
];

export const faqs = [
  {
    q: 'I have never done breathwork. Is that a problem?',
    a: 'No. Breath Foundations assumes nothing at all, and most people arrive having tried an app once and given up.',
  },
  {
    q: 'What if I miss a live session?',
    a: 'Every session is recorded and stays available to you for a year. Roughly half of each cohort watches at least a couple back.',
  },
  {
    q: 'Is this therapy?',
    a: 'No, and it does not replace it. Breathwork sits alongside therapy well, but if you are in acute distress please speak to your GP or therapist first.',
  },
  {
    q: 'Are there any health reasons not to do this?',
    a: 'Some practices are not suitable during pregnancy, or with epilepsy, uncontrolled high blood pressure, glaucoma or a recent cardiac event. There is a short health form before you start, and I will tell you honestly if I think you should wait.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Full refund up to seven days after a course begins, no explanation needed. After that I will refund on a case-by-case basis and I have never yet refused.',
  },
  {
    q: 'Do you teach in person?',
    a: 'One-to-ones only, in Bristol. Courses are online so people are not excluded by geography.',
  },
];
