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

import type { PhotoId } from './photos';

export type Course = {
  id: string;
  slug: string;
  photoId: PhotoId;
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
    photoId: 'course-breath-foundations',
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
    photoId: 'course-slow-yoga',
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
    photoId: 'course-deep-rest',
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
    photoId: 'course-breathwork-for-teachers',
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

export type Retreat = {
  id: string;
  slug: string;
  photoId: PhotoId;
  title: string;
  location: string;
  dates: string;
  nights: number;
  priceGBP: number;
  spaces: number;
  spacesLeft: number;
  summary: string;
  description: string;
  includes: string[];
  day: { time: string; what: string }[];
};

export const retreats: Retreat[] = [
  {
    id: 'r-alentejo',
    slug: 'alentejo-spring',
    photoId: 'retreat-portugal',
    title: 'Slow week in the Alentejo',
    location: 'Alentejo, Portugal',
    dates: '18–24 April 2027',
    nights: 6,
    priceGBP: 1450,
    spaces: 12,
    spacesLeft: 4,
    summary:
      'Six nights of slow mornings, long practices and nothing much else. Cork oaks, a very quiet valley, and no wifi in the practice barn.',
    description:
      'This is not a bootcamp and it is not a holiday with yoga bolted on. Two practices a day, good food, long afternoons with nothing scheduled, and space to let a week actually do something. Most people arrive tired and leave slower.',
    includes: [
      'Six nights, private or shared room',
      'All meals, cooked on site',
      'Two practices daily — breath in the morning, movement or rest late afternoon',
      'One 1-1 session with Maya during the week',
      'Airport transfer from Lisbon',
    ],
    day: [
      { time: '07.30', what: 'Tea, then breath practice in the barn' },
      { time: '09.00', what: 'Breakfast, slowly' },
      { time: '10.30', what: 'Long movement practice' },
      { time: '12.30', what: 'Lunch, then the afternoon is yours' },
      { time: '17.30', what: 'Restorative practice or nidra' },
      { time: '19.30', what: 'Dinner together' },
    ],
  },
  {
    id: 'r-devon',
    slug: 'devon-winter',
    photoId: 'retreat-devon',
    title: 'Winter weekend in Devon',
    location: 'Dartmoor, Devon',
    dates: '13–15 November 2026',
    nights: 2,
    priceGBP: 420,
    spaces: 14,
    spacesLeft: 9,
    summary:
      'A short, warm, deliberately unambitious weekend. A farmhouse, a wood burner, and three long practices with walks in between.',
    description:
      'For people who cannot take a week off but badly need two days. We practise, we walk on the moor, we eat too much, and we sleep. Bring boots and something waterproof — this is Dartmoor in November and it will rain.',
    includes: [
      'Two nights in a Dartmoor farmhouse',
      'All meals from Friday dinner to Sunday lunch',
      'Three long practices',
      'A guided walk on the moor',
      'Shared rooms, two or three to a room',
    ],
    day: [
      { time: 'Friday 18.00', what: 'Arrive, settle, dinner' },
      { time: 'Friday 20.30', what: 'Opening practice — breath and long rest' },
      { time: 'Saturday 08.00', what: 'Morning practice, then breakfast' },
      { time: 'Saturday 11.00', what: 'Walk on the moor' },
      { time: 'Saturday 16.30', what: 'Restorative practice and nidra' },
      { time: 'Sunday 09.00', what: 'Closing practice, lunch, home' },
    ],
  },
];

export type JournalPost = {
  slug: string;
  photoId: PhotoId;
  title: string;
  standfirst: string;
  date: string;
  readingMinutes: number;
  tag: string;
  body: string[];
};

export const journal: JournalPost[] = [
  {
    slug: 'what-your-breath-is-doing',
    photoId: 'journal-nervous-system',
    title: 'What your breath is actually doing',
    standfirst:
      'Why a long exhale calms you down, explained without any mysticism at all.',
    date: '2026-09-02',
    readingMinutes: 6,
    tag: 'Physiology',
    body: [
      'There is a nerve that runs from your brainstem down through your neck and chest and into most of your internal organs. It is called the vagus nerve, and a large majority of its fibres carry information upward — from your body to your brain, rather than the other way round.',
      'This matters more than it sounds. It means your brain is constantly reading the state of your body and drawing conclusions from it. A fast, shallow, high-chest breathing pattern is one of the signals it reads. And what it concludes from that signal is, roughly: something is wrong.',
      'The useful consequence is that the reverse also works. Slow the breath down, lengthen the exhale relative to the inhale, and you are feeding the system a different signal. Heart rate drops slightly on each exhale — this is a real, measurable effect called respiratory sinus arrhythmia, and it is not a metaphor.',
      'This is why I am slightly allergic to being told to "just breathe". The instruction is not wrong, it is just useless without the mechanism. Knowing why a long exhale works makes you about ten times more likely to actually do it at the moment you need it.',
      'Where people go wrong is trying to breathe deeply. Deep is not the goal — slow is the goal, and low is the goal. A large gulping breath into the upper chest does close to nothing useful. A small, quiet breath that moves your lower ribs, with an exhale twice as long as the inhale, does a great deal.',
    ],
  },
  {
    slug: 'the-three-am-problem',
    photoId: 'journal-sleep',
    title: 'The 3am problem',
    standfirst:
      'You wake, you are wide awake, and the harder you try the worse it gets. What to actually do.',
    date: '2026-08-14',
    readingMinutes: 5,
    tag: 'Sleep',
    body: [
      'Waking in the night is normal. Everyone surfaces several times a night between sleep cycles, and most of the time you do not notice because you go straight back down. The problem is not the waking. The problem is what happens in the ninety seconds afterwards.',
      'What usually happens is that you check the time. This is the single worst thing you can do, because now you are doing arithmetic — four hours and twenty minutes until the alarm — and arithmetic requires the part of your brain you were trying to switch off.',
      'So: do not look at the clock. Turn it away from the bed before you go to sleep so the decision is already made.',
      'Then give your attention something to do that is boring but not effortful. I teach a very slow count — in for four, out for six, and count the exhales backwards from thirty. When you lose the count, which you will, start again from thirty. Losing the count is not failure. Losing the count is the mechanism working.',
      'If you are still awake after twenty minutes or so, get up. Go somewhere dim, do something undemanding, and go back when you feel heavy. Lying in bed getting increasingly cross teaches your brain that bed is a place where you lie awake being cross, and that lesson is surprisingly durable.',
    ],
  },
  {
    slug: 'teaching-breath-without-doing-harm',
    photoId: 'journal-teaching',
    title: 'Teaching breath without doing harm',
    standfirst:
      'For yoga teachers adding breathwork: the contraindications nobody mentions in training.',
    date: '2026-07-22',
    readingMinutes: 8,
    tag: 'For teachers',
    body: [
      'Breathwork is having a moment, and a lot of teachers are adding it to classes having done a weekend course. Most of the time this is fine. Occasionally it is not, and the occasions when it is not are predictable enough that you should know them.',
      'Start with the straightforward physical contraindications. Strong breath retention and rapid breathing techniques are not appropriate during pregnancy, with uncontrolled hypertension, with glaucoma, with epilepsy, or following a recent cardiac event. Detached retina is on that list too. None of this is obscure, and yet I meet teachers who have never been told any of it.',
      'Then there is the part that training courses handle badly, which is what happens when a breath practice brings something up. Fast breathing with retentions can produce genuine emotional release, and sometimes it produces something closer to a flashback. If you have twenty people in a room and you run an intense practice, this will eventually happen to one of them.',
      'The question is not whether you can prevent it. You cannot entirely. The question is whether you know what to do, which is: stop the practice, get them breathing normally and slowly, get them oriented to the room — name five things they can see — and do not, under any circumstances, encourage them to stay in it because it is "coming up for a reason".',
      'Above all, ask before you cue. A health form at the start of a course takes four minutes to write and tells you who should be sitting out which practice. Teachers who skip it are not being relaxed; they are transferring risk onto students who do not know enough to refuse.',
    ],
  },
];

export type WorkshopFormat = {
  id: string;
  name: string;
  minutes: number;
  fromGBP: number;
  capacity: string;
  summary: string;
  includes: string[];
};

export const workshops: WorkshopFormat[] = [
  {
    id: 'w-taster',
    name: 'The lunchtime one',
    minutes: 45,
    fromGBP: 350,
    capacity: 'Up to 30 people',
    summary:
      'A single session that fits in a lunch break. Enough physiology to make it stick, and one practice short enough to use at a desk.',
    includes: [
      'One 45-minute session, in person or online',
      'A one-page practice card for everyone afterwards',
      'No mats, no changing, no floor work',
    ],
  },
  {
    id: 'w-series',
    name: 'A short series',
    minutes: 45,
    fromGBP: 1200,
    capacity: 'Up to 20 people',
    summary:
      'Four weekly sessions. Long enough for a practice to survive contact with a real working week, which one session rarely is.',
    includes: [
      'Four 45-minute sessions, weekly',
      'Recordings for anyone who misses one',
      'A short anonymous check-in at the start and the end',
    ],
  },
  {
    id: 'w-away-day',
    name: 'Part of an away day',
    minutes: 90,
    fromGBP: 900,
    capacity: 'Up to 40 people',
    summary:
      'A longer slot built into a day you are already running. Usually placed after lunch, when a room full of people has stopped listening.',
    includes: [
      'One 90-minute session',
      'Shaped around whatever else is on the agenda',
      'Travel within two hours of Bristol included',
    ],
  },
];
