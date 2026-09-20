import { Card, CardTitle, PageHeader } from '@/components/admin/ui';
import { availability } from '@/lib/admin-data';
import { longDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function AvailabilityPage() {
  const teachingDays = availability.workingDays.filter((day) => day.teaching);

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Availability'
        subtitle='The hours the booking page offers, and the days it must not.'
      />

      <div className='grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start'>
        <div className='space-y-4'>
          <Card>
            <CardTitle hint={availability.timezone}>Working hours</CardTitle>
            <ul className='divide-y divide-admin-border'>
              {availability.workingDays.map((day) => (
                <li
                  key={day.day}
                  className='flex items-center justify-between py-2.5 text-sm'
                >
                  <span
                    className={cn(
                      'font-medium',
                      !day.teaching && 'opacity-45',
                    )}
                  >
                    {day.day}
                  </span>
                  {day.teaching ? (
                    <span className='tabular-nums'>
                      {day.from} — {day.to}
                    </span>
                  ) : (
                    <span className='text-xs opacity-55'>Not teaching</span>
                  )}
                </li>
              ))}
            </ul>
            <p className='mt-4 border-t border-admin-border pt-4 text-xs leading-relaxed opacity-60'>
              Lunch is blocked {availability.lunchFrom}–{availability.lunchTo}{' '}
              every teaching day and never appears as a slot.
            </p>
          </Card>

          <Card>
            <CardTitle hint={`${availability.blocked.length} entries`}>
              Blocked out
            </CardTitle>
            <ul className='divide-y divide-admin-border'>
              {availability.blocked.map((block) => (
                <li key={`${block.date}-${block.reason}`} className='py-2.5'>
                  <div className='flex items-baseline justify-between gap-4 text-sm'>
                    <span className='font-medium'>{longDate(block.date)}</span>
                    <span className='shrink-0 text-xs tabular-nums opacity-65'>
                      {block.allDay ? 'All day' : `${block.from}–${block.to}`}
                    </span>
                  </div>
                  <p className='mt-0.5 text-xs opacity-65'>{block.reason}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardTitle>Booking rules</CardTitle>
            <dl className='space-y-3 text-sm'>
              {[
                {
                  label: 'Gap between sessions',
                  value: `${availability.bufferMinutes} minutes`,
                  note: 'So a session running over does not eat the next one.',
                },
                {
                  label: 'Shortest notice',
                  value: `${availability.noticeHours} hours`,
                  note: 'Nothing bookable inside a day.',
                },
                {
                  label: 'Slot hold at checkout',
                  value: `${availability.holdMinutes} minutes`,
                  note: 'Stops two people buying the same time.',
                },
              ].map((rule) => (
                <div key={rule.label} className='border-b border-admin-border pb-3 last:border-0 last:pb-0'>
                  <div className='flex items-baseline justify-between gap-3'>
                    <dt className='opacity-75'>{rule.label}</dt>
                    <dd className='font-medium tabular-nums'>{rule.value}</dd>
                  </div>
                  <p className='mt-1 text-xs opacity-60'>{rule.note}</p>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardTitle>Teaching load</CardTitle>
            <p className='text-3xl font-semibold tabular-nums'>
              {teachingDays.length} days
            </p>
            <p className='mt-1 text-sm opacity-65'>
              open for one-to-ones each week, before courses are placed.
            </p>
            <p className='mt-4 border-t border-admin-border pt-4 text-xs leading-relaxed opacity-60'>
              In this demonstration these settings are read-only. Making them
              editable needs a database and a write path — the booking page
              already reads its slots from the same source.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
