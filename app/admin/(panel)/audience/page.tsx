import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { BarList } from '@/components/admin/charts';
import {
  trafficSources,
  reasonsForComing,
  kpis,
  subscribers,
  subscriberGrowth,
} from '@/lib/admin-data';
import { shortDate } from '@/lib/format';

export default function AudiencePage() {
  const totalVisitors = trafficSources.reduce((sum, s) => sum + s.visitors, 0);
  const totalCustomers = trafficSources.reduce((sum, s) => sum + s.customers, 0);

  const bestConverting = [...trafficSources].sort(
    (a, b) => b.customers / b.visitors - a.customers / a.visitors,
  )[0];

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Audience'
        subtitle='Where people come from, and what they say they came for.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Visitors, 90 days'
          value={totalVisitors.toLocaleString('en-GB')}
          change={`${totalCustomers} became customers`}
        />
        <StatTile
          label='Visitor to customer'
          value={`${kpis.visitorToCustomer}%`}
          change={`from ${kpis.visitorToCustomerLast}%`}
          direction='up'
          compare
        />
        <StatTile
          label='Best converting source'
          value={bestConverting.source}
          change={`${((bestConverting.customers / bestConverting.visitors) * 100).toFixed(1)}% convert`}
        />
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardTitle hint='Last 90 days'>Where people come from</CardTitle>
          <BarList
            items={trafficSources.map((source) => ({
              label: source.source,
              value: source.visitors,
              note: `${source.customers} bought · ${source.note}`,
            }))}
            caption='Traffic sources by visitors'
            valueHead='Visitors'
          />
        </Card>

        <Card>
          <CardTitle hint='Asked at checkout'>What brings them here</CardTitle>
          <BarList
            items={reasonsForComing.map((reason) => ({
              label: reason.reason,
              value: reason.count,
            }))}
            caption='Stated reasons for coming'
            valueHead='People'
          />
          <p className='mt-4 text-xs leading-relaxed opacity-60'>
            Optional free-text at checkout, bucketed by hand. Roughly seven in ten
            people answer it.
          </p>
        </Card>
      </div>

      <Card className='mt-4'>
        <CardTitle hint={`${subscriberGrowth.at(-1)?.total.toLocaleString('en-GB')} on the list`}>
          Mailing list
        </CardTitle>

        <div className='grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start'>
          <div>
            <p className='text-3xl font-semibold tabular-nums'>
              {subscriberGrowth.at(-1)?.total.toLocaleString('en-GB')}
            </p>
            <p className='mt-1 text-sm opacity-65'>
              up{' '}
              {(
                ((subscriberGrowth.at(-1)!.total - subscriberGrowth[0].total) /
                  subscriberGrowth[0].total) *
                100
              ).toFixed(0)}
              % since April
            </p>

            {/* One series over time: a single hue, no legend needed. */}
            <div className='mt-5 flex h-20 items-end gap-1.5'>
              {subscriberGrowth.map((point) => (
                <div key={point.month} className='flex flex-1 flex-col items-center gap-1.5'>
                  <div
                    className='w-full rounded-t-[4px]'
                    style={{
                      height: `${(point.total / subscriberGrowth.at(-1)!.total) * 64}px`,
                      backgroundColor: 'var(--color-chart-1)',
                    }}
                    role='img'
                    aria-label={`${point.month}: ${point.total} subscribers`}
                  />
                  <span className='text-[10px] opacity-55'>{point.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className='mb-3 text-xs font-medium opacity-65'>
              Most recent sign-ups
            </p>
            <ul className='divide-y divide-admin-border text-sm'>
              {[...subscribers]
                .sort((a, b) => b.joined.localeCompare(a.joined))
                .slice(0, 6)
                .map((subscriber) => (
                  <li
                    key={subscriber.email}
                    className='flex flex-wrap items-baseline gap-x-3 py-2'
                  >
                    <span className='truncate'>{subscriber.email}</span>
                    <span className='text-xs opacity-55'>
                      via {subscriber.source}
                    </span>
                    {subscriber.isCustomer && (
                      <span className='rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-medium text-success'>
                        Customer
                      </span>
                    )}
                    <span className='ml-auto text-xs tabular-nums opacity-55'>
                      {shortDate(subscriber.joined)}
                    </span>
                  </li>
                ))}
            </ul>
            <p className='mt-4 text-xs leading-relaxed opacity-60'>
              Sign-up forms sit on the retreats page, the journal and in the
              footer. The source is recorded so it is clear which of them is
              actually working.
            </p>
          </div>
        </div>
      </Card>

      <Card className='mt-4'>
        <CardTitle hint='Visitors vs customers'>Source quality</CardTitle>
        <div className='-mx-5 overflow-x-auto px-5'>
          <table className='w-full min-w-[620px] text-left text-sm [&_td]:pr-5 [&_th]:pr-5 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0'>
            <thead>
              <tr className='border-b border-admin-border text-xs'>
                <th className='py-2 font-medium opacity-65'>Source</th>
                <th className='py-2 text-right font-medium opacity-65'>Visitors</th>
                <th className='py-2 text-right font-medium opacity-65'>Customers</th>
                <th className='py-2 text-right font-medium opacity-65'>Converts</th>
                <th className='py-2 font-medium opacity-65'>Note</th>
              </tr>
            </thead>
            <tbody>
              {trafficSources.map((source) => (
                <tr key={source.source} className='border-b border-admin-border/60'>
                  <td className='py-2.5 font-medium'>{source.source}</td>
                  <td className='py-2.5 text-right tabular-nums'>
                    {source.visitors.toLocaleString('en-GB')}
                  </td>
                  <td className='py-2.5 text-right tabular-nums'>{source.customers}</td>
                  <td className='py-2.5 text-right tabular-nums'>
                    {((source.customers / source.visitors) * 100).toFixed(1)}%
                  </td>
                  <td className='py-2.5 opacity-70'>{source.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className='mt-4 text-xs leading-relaxed opacity-60'>
          Instagram brings the most people; word of mouth brings the most
          customers. Worth knowing before deciding where the next hour goes.
        </p>
      </Card>
    </div>
  );
}
