import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { retreatBookings, type RetreatBooking } from '@/lib/admin-data';
import { retreats } from '@/lib/data';
import { gbp, shortDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const paidStyles: Record<RetreatBooking['paid'], { label: string; className: string; glyph: string }> = {
  full: { label: 'Paid in full', className: 'bg-success/12 text-success', glyph: '✓' },
  balance: { label: 'Balance paid', className: 'bg-success/12 text-success', glyph: '✓' },
  deposit: { label: 'Deposit only', className: 'bg-warning/15 text-warning', glyph: '•' },
};

export default function AdminRetreatsPage() {
  const takenSoFar = retreatBookings.reduce((sum, b) => sum + b.amountPaidGBP, 0);
  const owed = retreatBookings.reduce(
    (sum, b) => sum + (b.totalGBP - b.amountPaidGBP),
    0,
  );
  const awaitingBalance = retreatBookings.filter((b) => b.paid === 'deposit');

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Retreats'
        subtitle='Who is coming, who still owes a balance, and how many places are left.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Taken so far'
          value={gbp(takenSoFar)}
          change={`${retreatBookings.length} bookings across both`}
        />
        <StatTile
          label='Still owed'
          value={gbp(owed)}
          change={`${awaitingBalance.length} on deposit only`}
          direction={awaitingBalance.length > 0 ? 'down' : 'up'}
        />
        <StatTile
          label='Places left'
          value={String(retreats.reduce((sum, r) => sum + r.spacesLeft, 0))}
          change='across both retreats'
        />
      </div>

      <div className='space-y-4'>
        {retreats.map((retreat) => {
          const bookings = retreatBookings.filter(
            (booking) => booking.retreatSlug === retreat.slug,
          );
          const sold = retreat.spaces - retreat.spacesLeft;
          const outstanding = bookings.reduce(
            (sum, b) => sum + (b.totalGBP - b.amountPaidGBP),
            0,
          );

          return (
            <Card key={retreat.id}>
              <CardTitle hint={retreat.dates}>{retreat.title}</CardTitle>

              <div className='mb-5 flex flex-wrap items-end justify-between gap-4'>
                <div>
                  <p className='text-sm opacity-65'>
                    {retreat.location} · {retreat.nights} nights ·{' '}
                    {gbp(retreat.priceGBP)} per person
                  </p>
                  {outstanding > 0 && (
                    <p className='mt-1 text-sm text-warning'>
                      <span aria-hidden>•</span> {gbp(outstanding)} in balances
                      still to collect
                    </p>
                  )}
                </div>

                <div className='min-w-48'>
                  <div className='flex items-baseline justify-between text-sm'>
                    <span className='opacity-65'>Filled</span>
                    <span className='tabular-nums'>
                      {sold} / {retreat.spaces}
                    </span>
                  </div>
                  {/* Magnitude against a known ceiling, so a single hue is
                      right — no second colour to misread. */}
                  <div className='mt-1.5 h-2 w-full overflow-hidden rounded-full bg-admin-canvas'>
                    <div
                      className='h-full rounded-full'
                      style={{
                        width: `${(sold / retreat.spaces) * 100}%`,
                        backgroundColor: 'var(--color-chart-1)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='-mx-5 overflow-x-auto px-5'>
                <table className='w-full min-w-[720px] text-left text-sm [&_td]:pr-5 [&_th]:pr-5 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0'>
                  <thead>
                    <tr className='border-b border-admin-border text-xs'>
                      <th className='py-2 font-medium opacity-65'>Name</th>
                      <th className='py-2 font-medium opacity-65'>Booked</th>
                      <th className='py-2 font-medium opacity-65'>Room</th>
                      <th className='py-2 text-right font-medium opacity-65'>Paid</th>
                      <th className='py-2 text-right font-medium opacity-65'>Outstanding</th>
                      <th className='py-2 text-right font-medium opacity-65'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const style = paidStyles[booking.paid];
                      const due = booking.totalGBP - booking.amountPaidGBP;
                      return (
                        <tr
                          key={booking.id}
                          className='border-b border-admin-border/60 align-top'
                        >
                          <td className='py-2.5'>
                            <span className='block font-medium'>{booking.name}</span>
                            <span className='block text-xs opacity-60'>
                              {booking.email}
                            </span>
                            {booking.note && (
                              <span className='mt-1 block text-xs opacity-70'>
                                {booking.note}
                              </span>
                            )}
                          </td>
                          <td className='py-2.5 whitespace-nowrap opacity-70'>
                            {shortDate(booking.booked)}
                          </td>
                          <td className='py-2.5 opacity-80'>{booking.room}</td>
                          <td className='py-2.5 text-right tabular-nums'>
                            {gbp(booking.amountPaidGBP)}
                          </td>
                          <td className='py-2.5 text-right tabular-nums'>
                            {due === 0 ? (
                              <span className='opacity-50'>—</span>
                            ) : (
                              gbp(due)
                            )}
                          </td>
                          <td className='py-2.5 text-right'>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                                style.className,
                              )}
                            >
                              <span aria-hidden>{style.glyph}</span>
                              {style.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {bookings.length === 0 && (
                <p className='py-6 text-center text-sm opacity-60'>
                  No bookings yet.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <Card className='mt-4'>
        <CardTitle>Balances</CardTitle>
        <p className='text-sm leading-relaxed opacity-85'>
          Balances are due eight weeks before departure. The deposit is
          non-refundable because accommodation is booked against it, so a
          cancellation inside that window only refunds if the place resells —
          which is worth saying out loud when someone asks.
        </p>
      </Card>
    </div>
  );
}
