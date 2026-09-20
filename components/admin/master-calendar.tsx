'use client';

import { useMemo, useState } from 'react';
import {
  calendarEvents,
  eventKindStyles,
  TODAY,
  type CalendarEvent,
} from '@/lib/admin-data';
import { toIsoDate } from '@/lib/booking';
import { longDate } from '@/lib/format';
import { Card, CardTitle } from './ui';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const KINDS = Object.keys(eventKindStyles) as CalendarEvent['kind'][];

function buildGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leading = (first.getUTCDay() + 6) % 7;

  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function MasterCalendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8);
  const [selected, setSelected] = useState<string>(TODAY);
  const [visibleKinds, setVisibleKinds] = useState<Set<CalendarEvent['kind']>>(
    new Set(KINDS),
  );

  const cells = useMemo(() => buildGrid(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of calendarEvents) {
      if (!visibleKinds.has(event.kind)) continue;
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.start.localeCompare(b.start));
    }
    return map;
  }, [visibleKinds]);

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString(
    'en-GB',
    { month: 'long', year: 'numeric', timeZone: 'UTC' },
  );

  const selectedEvents = eventsByDate.get(selected) ?? [];

  const monthSummary = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const inMonth = calendarEvents.filter((event) => event.date.startsWith(prefix));

    const minutes = inMonth
      .filter((event) => event.kind === 'session' || event.kind === 'course')
      .reduce((total, event) => {
        const [startH, startM] = event.start.split(':').map(Number);
        const [endH, endM] = event.end.split(':').map(Number);
        return total + (endH * 60 + endM - (startH * 60 + startM));
      }, 0);

    return {
      oneToOnes: inMonth.filter((event) => event.kind === 'session').length,
      classes: inMonth.filter((event) => event.kind === 'course').length,
      teachingHours: Math.round(minutes / 6) / 10,
      clearDays: new Set(inMonth.map((event) => event.date)).size,
    };
  }, [year, month]);

  function changeMonth(delta: number) {
    const next = new Date(Date.UTC(year, month + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  }

  function toggleKind(kind: CalendarEvent['kind']) {
    setVisibleKinds((current) => {
      const next = new Set(current);
      if (next.has(kind)) {
        next.delete(kind);
      } else {
        next.add(kind);
      }
      return next;
    });
  }

  return (
    <div className='grid gap-4 xl:grid-cols-[1fr_320px] xl:items-start'>
      <Card>
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-1'>
            <button
              type='button'
              onClick={() => changeMonth(-1)}
              aria-label='Previous month'
              className='grid size-8 place-items-center rounded-lg hover:bg-admin-canvas'
            >
              ‹
            </button>
            <span className='min-w-40 text-center text-sm font-semibold'>
              {monthLabel}
            </span>
            <button
              type='button'
              onClick={() => changeMonth(1)}
              aria-label='Next month'
              className='grid size-8 place-items-center rounded-lg hover:bg-admin-canvas'
            >
              ›
            </button>
          </div>

          {/* Filters sit in one row above the grid, per the interaction spec. */}
          <div className='flex flex-wrap gap-1.5'>
            {KINDS.map((kind) => {
              const isOn = visibleKinds.has(kind);
              return (
                <button
                  key={kind}
                  type='button'
                  onClick={() => toggleKind(kind)}
                  aria-pressed={isOn}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-opacity',
                    eventKindStyles[kind].chip,
                    !isOn && 'opacity-35',
                  )}
                >
                  <span
                    aria-hidden
                    className={`size-2 rounded-full ${eventKindStyles[kind].dot}`}
                  />
                  {eventKindStyles[kind].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-7 gap-1'>
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className='pb-1 text-center text-[11px] font-medium opacity-55'
            >
              {day}
            </span>
          ))}

          {cells.map((day, index) => {
            if (day === null) {
              return <span key={`empty-${index}`} className='min-h-24' />;
            }
            const iso = toIsoDate(year, month, day);
            const dayEvents = eventsByDate.get(iso) ?? [];
            const isToday = iso === TODAY;
            const isSelected = iso === selected;

            return (
              <button
                key={iso}
                type='button'
                onClick={() => setSelected(iso)}
                aria-pressed={isSelected}
                className={cn(
                  'min-h-[6.5rem] rounded-lg p-1.5 text-left align-top transition-colors',
                  isSelected ? 'bg-admin-canvas ring-1 ring-ink/25' : 'hover:bg-admin-canvas',
                )}
              >
                <span
                  className={cn(
                    'inline-grid size-6 place-items-center rounded-full text-xs tabular-nums',
                    isToday ? 'bg-ink font-semibold text-canvas' : 'opacity-70',
                  )}
                >
                  {day}
                </span>

                <span className='mt-1 block space-y-1'>
                  {dayEvents.slice(0, 2).map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        'block rounded px-1 py-0.5 text-[10px] leading-tight',
                        eventKindStyles[event.kind].chip,
                      )}
                    >
                      <span className='flex items-center gap-1 tabular-nums opacity-70'>
                        <span
                          aria-hidden
                          className={`size-1.5 shrink-0 rounded-full ${eventKindStyles[event.kind].dot}`}
                        />
                        {event.start}
                      </span>
                      <span className='mt-0.5 block truncate font-medium'>
                        {event.title}
                      </span>
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className='block px-1 text-[10px] opacity-55'>
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className='grid gap-4 sm:grid-cols-4 xl:col-start-1'>
        {[
          { label: 'One-to-ones', value: String(monthSummary.oneToOnes) },
          { label: 'Course classes', value: String(monthSummary.classes) },
          { label: 'Teaching hours', value: `${monthSummary.teachingHours}` },
          { label: 'Days with something on', value: String(monthSummary.clearDays) },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className='text-xs opacity-65'>{stat.label}</p>
            <p className='mt-1.5 text-2xl font-semibold tabular-nums'>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className='xl:col-start-2 xl:row-start-1 xl:sticky xl:top-7'>
        <CardTitle hint={selected === TODAY ? 'Today' : undefined}>
          {longDate(selected)}
        </CardTitle>

        {selectedEvents.length === 0 ? (
          <p className='text-sm opacity-60'>Nothing scheduled.</p>
        ) : (
          <ul className='space-y-3'>
            {selectedEvents.map((event) => (
              <li
                key={event.id}
                className='rounded-xl bg-admin-canvas p-3'
              >
                <div className='flex items-center gap-2'>
                  <span
                    aria-hidden
                    className={`size-2 shrink-0 rounded-full ${eventKindStyles[event.kind].dot}`}
                  />
                  <span className='text-xs tabular-nums opacity-65'>
                    {event.start}–{event.end}
                  </span>
                  <span className='ml-auto text-[10px] uppercase tracking-wide opacity-50'>
                    {eventKindStyles[event.kind].label}
                  </span>
                </div>
                <p className='mt-1.5 text-sm font-medium'>{event.title}</p>
                {event.who && (
                  <p className='mt-0.5 text-xs opacity-65'>{event.who}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className='mt-5 border-t border-admin-border pt-4 text-xs opacity-55'>
          Courses, one-to-ones, admin time and your own practice in one place —
          so a slot can never be sold twice.
        </p>
      </Card>
    </div>
  );
}
