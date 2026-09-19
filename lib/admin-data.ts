/**
 * Seeded analytics for the coach's private panel. Deterministic by design —
 * see the note at the top of lib/data.ts.
 *
 * "Today" in this demo is 2026-09-19.
 */

export const TODAY = '2026-09-19';

export const kpis = {
  revenueThisMonth: 8420,
  revenueLastMonth: 6975,
  activeStudents: 147,
  activeStudentsLastMonth: 131,
  sessionsThisWeek: 9,
  sessionsLastWeek: 11,
  visitorToCustomer: 3.8,
  visitorToCustomerLast: 3.1,
};

/** Two series only — courses and 1-1 — per DESIGN.md §3. */
export const revenueByWeek = [
  { week: '7 Jul', courses: 940, oneToOne: 300 },
  { week: '14 Jul', courses: 1120, oneToOne: 375 },
  { week: '21 Jul', courses: 610, oneToOne: 450 },
  { week: '28 Jul', courses: 835, oneToOne: 260 },
  { week: '4 Aug', courses: 1485, oneToOne: 520 },
  { week: '11 Aug', courses: 1240, oneToOne: 410 },
  { week: '18 Aug', courses: 925, oneToOne: 335 },
  { week: '25 Aug', courses: 1680, oneToOne: 445 },
  { week: '1 Sep', courses: 2310, oneToOne: 590 },
  { week: '8 Sep', courses: 1950, oneToOne: 505 },
  { week: '15 Sep', courses: 2640, oneToOne: 620 },
];

/** Magnitude, many categories — sorted bars in one hue, never a donut. */
export const salesByCourse = [
  { name: 'Breath Foundations', sales: 46, revenue: 8510 },
  { name: 'Slow Yoga', sales: 23, revenue: 5520 },
  { name: 'Deep Rest', sales: 38, revenue: 4560 },
  { name: 'Breathwork for Teachers', sales: 6, revenue: 4140 },
];

/** "Why are they coming to the website" — asked at checkout, optional. */
export const trafficSources = [
  { source: 'Instagram', visitors: 3120, customers: 74, note: 'Mostly the breath reels' },
  { source: 'Word of mouth', visitors: 890, customers: 61, note: 'Highest intent by far' },
  { source: 'Google search', visitors: 2450, customers: 38, note: '"breathwork for anxiety"' },
  { source: 'Podcast mentions', visitors: 640, customers: 22, note: 'Two episodes in August' },
  { source: 'Newsletter', visitors: 410, customers: 19, note: 'Existing students' },
  { source: 'Direct', visitors: 305, customers: 9, note: 'Typed the URL' },
];

/** Free-text reason given at checkout, bucketed. */
export const reasonsForComing = [
  { reason: 'Stress and anxiety', count: 84 },
  { reason: 'Sleep problems', count: 52 },
  { reason: 'Burnout / recovery', count: 37 },
  { reason: 'Injury or chronic pain', count: 24 },
  { reason: 'Professional development', count: 18 },
  { reason: 'Curiosity', count: 14 },
];

export type Order = {
  id: string;
  date: string;
  customer: string;
  item: string;
  kind: 'course' | 'session';
  amountGBP: number;
  status: 'paid' | 'refunded' | 'failed' | 'pending';
  source: string;
};

export const recentOrders: Order[] = [
  { id: 'ORD-2241', date: '2026-09-19', customer: 'Helena Brooks', item: 'Breath Foundations', kind: 'course', amountGBP: 185, status: 'paid', source: 'Instagram' },
  { id: 'ORD-2240', date: '2026-09-18', customer: 'Tom Achebe', item: 'Extended session', kind: 'session', amountGBP: 110, status: 'paid', source: 'Word of mouth' },
  { id: 'ORD-2239', date: '2026-09-18', customer: 'Sarah Lindqvist', item: 'Deep Rest', kind: 'course', amountGBP: 120, status: 'paid', source: 'Google search' },
  { id: 'ORD-2238', date: '2026-09-17', customer: 'James Whitfield', item: 'Breathwork for Teachers', kind: 'course', amountGBP: 690, status: 'pending', source: 'Newsletter' },
  { id: 'ORD-2237', date: '2026-09-17', customer: 'Aditi Raman', item: 'One-to-one session', kind: 'session', amountGBP: 75, status: 'paid', source: 'Instagram' },
  { id: 'ORD-2236', date: '2026-09-16', customer: 'Peter Nowak', item: 'Slow Yoga', kind: 'course', amountGBP: 240, status: 'failed', source: 'Google search' },
  { id: 'ORD-2235', date: '2026-09-16', customer: 'Grace Okafor', item: 'Breath Foundations', kind: 'course', amountGBP: 185, status: 'paid', source: 'Podcast mentions' },
  { id: 'ORD-2234', date: '2026-09-15', customer: 'Liam Doherty', item: 'Deep Rest', kind: 'course', amountGBP: 120, status: 'refunded', source: 'Instagram' },
  { id: 'ORD-2233', date: '2026-09-15', customer: 'Marta Ruiz', item: 'One-to-one session', kind: 'session', amountGBP: 75, status: 'paid', source: 'Word of mouth' },
  { id: 'ORD-2232', date: '2026-09-14', customer: 'Owen Price', item: 'Slow Yoga', kind: 'course', amountGBP: 240, status: 'paid', source: 'Instagram' },
];

export type CalendarEvent = {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  kind: 'session' | 'course' | 'admin' | 'personal';
  who?: string;
  note?: string;
};

/** The master calendar — everything in one place, not one feed per thing. */
export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', date: '2026-09-14', start: '10:00', end: '12:00', title: 'Breathwork for Teachers — wk 3', kind: 'course', who: '10 enrolled' },
  { id: 'e2', date: '2026-09-15', start: '19:00', end: '20:15', title: 'Breath Foundations — wk 2', kind: 'course', who: '14 enrolled' },
  { id: 'e3', date: '2026-09-16', start: '09:30', end: '10:30', title: 'Aditi Raman', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e4', date: '2026-09-17', start: '18:30', end: '20:00', title: 'Slow Yoga — wk 5', kind: 'course', who: '12 enrolled' },
  { id: 'e5', date: '2026-09-18', start: '11:00', end: '12:30', title: 'Tom Achebe', kind: 'session', who: 'Extended · 90 min' },
  { id: 'e6', date: '2026-09-18', start: '15:00', end: '15:20', title: 'Freya Lam', kind: 'session', who: 'Discovery call' },
  { id: 'e7', date: '2026-09-19', start: '09:00', end: '10:00', title: 'Marta Ruiz', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e8', date: '2026-09-19', start: '14:00', end: '15:00', title: 'Admin — invoices & refunds', kind: 'admin' },
  { id: 'e9', date: '2026-09-20', start: '20:00', end: '21:00', title: 'Deep Rest — wk 1', kind: 'course', who: '22 enrolled' },
  { id: 'e10', date: '2026-09-21', start: '10:00', end: '12:00', title: 'Breathwork for Teachers — wk 4', kind: 'course', who: '10 enrolled' },
  { id: 'e11', date: '2026-09-22', start: '19:00', end: '20:15', title: 'Breath Foundations — wk 3', kind: 'course', who: '14 enrolled' },
  { id: 'e12', date: '2026-09-23', start: '08:00', end: '09:00', title: 'Own practice — do not book', kind: 'personal' },
  { id: 'e13', date: '2026-09-23', start: '13:00', end: '14:00', title: 'Helena Brooks', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e14', date: '2026-09-24', start: '18:30', end: '20:00', title: 'Slow Yoga — wk 6', kind: 'course', who: '12 enrolled' },
  { id: 'e15', date: '2026-09-25', start: '11:00', end: '12:30', title: 'Dev Patel', kind: 'session', who: 'Extended · 90 min' },
  { id: 'e16', date: '2026-09-26', start: '10:00', end: '11:00', title: 'Grace Okafor', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e17', date: '2026-09-27', start: '20:00', end: '21:00', title: 'Deep Rest — wk 2', kind: 'course', who: '22 enrolled' },
  { id: 'e18', date: '2026-09-28', start: '10:00', end: '12:00', title: 'Breathwork for Teachers — wk 5', kind: 'course', who: '10 enrolled' },
  { id: 'e19', date: '2026-09-29', start: '19:00', end: '20:15', title: 'Breath Foundations — wk 4', kind: 'course', who: '14 enrolled' },
  { id: 'e20', date: '2026-09-30', start: '09:30', end: '10:30', title: 'Owen Price', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e21', date: '2026-09-30', start: '16:00', end: '17:00', title: 'Retreat planning — Portugal', kind: 'admin' },
  { id: 'e22', date: '2026-09-12', start: '11:00', end: '12:00', title: 'Sarah Lindqvist', kind: 'session', who: 'One-to-one · 60 min' },
  { id: 'e23', date: '2026-09-10', start: '18:30', end: '20:00', title: 'Slow Yoga — wk 4', kind: 'course', who: '12 enrolled' },
  { id: 'e24', date: '2026-09-08', start: '19:00', end: '20:15', title: 'Breath Foundations — wk 1', kind: 'course', who: '14 enrolled' },
  { id: 'e25', date: '2026-09-05', start: '08:00', end: '09:00', title: 'Own practice — do not book', kind: 'personal' },
];

export const eventKindStyles: Record<
  CalendarEvent['kind'],
  { label: string; dot: string; chip: string }
> = {
  session: { label: 'One-to-one', dot: 'bg-[var(--color-chart-1)]', chip: 'bg-[var(--color-chart-1)]/12 text-ink' },
  course: { label: 'Course', dot: 'bg-[var(--color-chart-2)]', chip: 'bg-[var(--color-chart-2)]/12 text-ink' },
  admin: { label: 'Admin', dot: 'bg-muted', chip: 'bg-muted/25 text-ink' },
  personal: { label: 'Personal', dot: 'bg-band', chip: 'bg-band/40 text-ink' },
};
