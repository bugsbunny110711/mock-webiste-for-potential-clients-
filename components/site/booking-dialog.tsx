'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
} from '@/components/core/morphing-dialog';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Button } from '@/components/ui/button';
import { getSlotsForDate, toIsoDate } from '@/lib/booking';
import { TODAY } from '@/lib/admin-data';
import { longDate } from '@/lib/format';
import { type SessionType } from '@/lib/data';
import { cn } from '@/lib/utils';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function buildMonthGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  // getUTCDay is Sunday-first; the grid is Monday-first.
  const leading = (first.getUTCDay() + 6) % 7;

  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function BookingDialog({
  sessionType,
  className,
}: {
  sessionType: SessionType;
  className?: string;
}) {
  const router = useRouter();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8); // September 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const slots = selectedDate ? getSlotsForDate(selectedDate) : [];

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString(
    'en-GB',
    { month: 'long', year: 'numeric', timeZone: 'UTC' },
  );

  function changeMonth(delta: number) {
    const next = new Date(Date.UTC(year, month + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
    setSelectedDate(null);
    setSelectedTime(null);
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) return;
    setIsContinuing(true);
    // Step 2 is a real route, never an overlay — payment must survive a stray
    // click and be recoverable from its URL (DESIGN.md §7).
    const params = new URLSearchParams({
      type: sessionType.id,
      date: selectedDate,
      time: selectedTime,
    });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <MorphingDialog>
      <MorphingDialogTrigger
        className={cn(
          'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-canvas transition-colors hover:bg-accent-hover',
          className,
        )}
      >
        Choose a date
      </MorphingDialogTrigger>

      <MorphingDialogContent
        title={`Book a ${sessionType.name}`}
        className='max-w-md sm:max-w-lg'
      >
        <MorphingDialogClose />

        <p className='text-xs tracking-widest uppercase opacity-70'>
          {sessionType.minutes} minutes
        </p>
        <h2 className='mt-1 font-display text-2xl font-light'>{sessionType.name}</h2>

        <div className='mt-6 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => changeMonth(-1)}
            className='grid size-8 place-items-center rounded-full hover:bg-band/60'
            aria-label='Previous month'
          >
            ‹
          </button>
          <span className='text-sm font-medium'>{monthLabel}</span>
          <button
            type='button'
            onClick={() => changeMonth(1)}
            className='grid size-8 place-items-center rounded-full hover:bg-band/60'
            aria-label='Next month'
          >
            ›
          </button>
        </div>

        <div className='mt-4 grid grid-cols-7 gap-1 text-center'>
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={`${label}-${i}`} className='py-1 text-xs opacity-60'>
              {label}
            </span>
          ))}
          {cells.map((day, index) => {
            if (day === null) return <span key={`empty-${index}`} />;
            const iso = toIsoDate(year, month, day);
            const daySlots = getSlotsForDate(iso);
            const isPast = iso < TODAY;
            const isOpen = !isPast && daySlots.some((slot) => slot.available);
            const isSelected = iso === selectedDate;

            return (
              <button
                key={iso}
                type='button'
                disabled={!isOpen}
                onClick={() => {
                  setSelectedDate(iso);
                  setSelectedTime(null);
                }}
                aria-pressed={isSelected}
                className={cn(
                  'aspect-square rounded-full text-sm transition-colors',
                  isSelected && 'bg-ink text-canvas',
                  !isSelected && isOpen && 'hover:bg-band/70',
                  // Unavailable is band-coloured and struck through — never
                  // colour alone, since band on surface is 1.4:1.
                  !isOpen && 'cursor-not-allowed text-ink/35 line-through',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className='mt-6 border-t border-ink/10 pt-5'>
            <p className='text-sm font-medium'>{longDate(selectedDate)}</p>
            {slots.length === 0 ? (
              <p className='mt-3 text-sm opacity-75'>Nothing free that day.</p>
            ) : (
              <div className='mt-3 flex flex-wrap gap-2'>
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type='button'
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    aria-pressed={slot.time === selectedTime}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm transition-colors',
                      slot.time === selectedTime
                        ? 'border-ink bg-ink text-canvas'
                        : 'border-ink/25 hover:bg-band/60',
                      !slot.available &&
                        'cursor-not-allowed border-dashed border-ink/15 text-ink/35 line-through hover:bg-transparent',
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className='mt-6 flex items-center justify-between gap-4 border-t border-ink/10 pt-5'>
          <span className='text-sm opacity-75'>
            {isContinuing ? (
              <TextShimmer>Checking availability…</TextShimmer>
            ) : selectedTime ? (
              'Held for 10 minutes once you continue.'
            ) : (
              'Pick a date, then a time.'
            )}
          </span>
          <Button onClick={handleContinue} disabled={!selectedTime || isContinuing}>
            Continue
          </Button>
        </div>
      </MorphingDialogContent>
    </MorphingDialog>
  );
}
