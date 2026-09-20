import { calendarEvents } from './admin-data';

export const SLOT_HOLD_MINUTES = 10;

/** Deterministic pseudo-random from a date string, so SSR and client agree. */
function seedFrom(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const WORKING_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30',
];

export type Slot = { time: string; available: boolean };

/**
 * Availability for a given ISO date. Anything already in the master calendar is
 * blocked, weekends are closed, and the rest varies by a stable seed so the demo
 * looks like a real diary rather than a full grid.
 */
export function getSlotsForDate(isoDate: string): Slot[] {
  const day = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  if (day === 0 || day === 6) return [];

  const booked = new Set(
    calendarEvents.filter((e) => e.date === isoDate).map((e) => e.start),
  );

  const seed = seedFrom(isoDate);

  return WORKING_HOURS.map((time, index) => {
    if (booked.has(time)) return { time, available: false };
    // Stable per date+slot: roughly two thirds of the diary is open.
    const available = (seed + index * 37) % 3 !== 0;
    return { time, available };
  });
}

export function isDateBookable(isoDate: string, todayIso: string): boolean {
  if (isoDate < todayIso) return false;
  return getSlotsForDate(isoDate).some((slot) => slot.available);
}

export function toIsoDate(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}
