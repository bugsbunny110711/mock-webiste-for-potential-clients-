import Link from 'next/link';
import { Card, CardTitle, PageHeader, StatTile, StatusChip } from '@/components/admin/ui';
import { RevenueChart, BarList } from '@/components/admin/charts';
import {
  enquiries,
  kpis,
  revenueByWeek,
  salesByCourse,
  trafficSources,
  recentOrders,
  calendarEvents,
  eventKindStyles,
  TODAY,
} from '@/lib/admin-data';
import { gbp, percentChange, shortDate, longDate } from '@/lib/format';

export default function AdminOverview() {
  const todaysEvents = calendarEvents
    .filter((event) => event.date === TODAY)
    .sort((a, b) => a.start.localeCompare(b.start));

  const unanswered = enquiries.filter((enquiry) => enquiry.status === 'new');

  const upcoming = calendarEvents
    .filter((event) => event.date > TODAY)
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))
    .slice(0, 5);

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Overview'
        subtitle={longDate(TODAY)}
        action={
          <Link
            href='/admin/calendar'
            className='rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-canvas hover:bg-accent-hover'
          >
            Open master calendar
          </Link>
        }
      />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          label='Revenue this month'
          value={gbp(kpis.revenueThisMonth)}
          change={percentChange(kpis.revenueThisMonth, kpis.revenueLastMonth)}
          direction='up'
          compare
        />
        <StatTile
          label='Active students'
          value={String(kpis.activeStudents)}
          change={percentChange(kpis.activeStudents, kpis.activeStudentsLastMonth)}
          direction='up'
          compare
        />
        <StatTile
          label='Sessions this week'
          value={String(kpis.sessionsThisWeek)}
          change={percentChange(kpis.sessionsThisWeek, kpis.sessionsLastWeek)}
          direction='down'
          compare
        />
        <StatTile
          label='Visitor to customer'
          value={`${kpis.visitorToCustomer}%`}
          change={percentChange(kpis.visitorToCustomer, kpis.visitorToCustomerLast)}
          direction='up'
          compare
        />
      </div>

      {unanswered.length > 0 && (
        <Link
          href='/admin/enquiries'
          className='mt-4 flex items-center gap-3 rounded-2xl bg-warning/12 px-5 py-4 text-sm text-warning transition-opacity hover:opacity-80'
        >
          <span aria-hidden>•</span>
          <span className='font-medium'>
            {unanswered.length} enquiries waiting on a reply
          </span>
          <span className='ml-auto'>Open the inbox →</span>
        </Link>
      )}

      <div className='mt-4 grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardTitle hint='Last 11 weeks'>Revenue</CardTitle>
          <RevenueChart data={revenueByWeek} />
        </Card>

        <Card>
          <CardTitle hint={shortDate(TODAY)}>Today</CardTitle>
          {todaysEvents.length === 0 ? (
            <p className='text-sm opacity-60'>Nothing booked. Rare.</p>
          ) : (
            <ul className='space-y-3'>
              {todaysEvents.map((event) => (
                <li key={event.id} className='flex gap-3'>
                  <span className='w-12 shrink-0 text-xs tabular-nums opacity-60'>
                    {event.start}
                  </span>
                  <span className='min-w-0'>
                    <span className='flex items-center gap-2'>
                      <span
                        aria-hidden
                        className={`size-2 shrink-0 rounded-full ${eventKindStyles[event.kind].dot}`}
                      />
                      <span className='truncate text-sm font-medium'>
                        {event.title}
                      </span>
                    </span>
                    {event.who && (
                      <span className='block pl-4 text-xs opacity-60'>{event.who}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <CardTitle hint='Next five'>
            <span className='mt-6 block'>Coming up</span>
          </CardTitle>
          <ul className='space-y-2.5'>
            {upcoming.map((event) => (
              <li key={event.id} className='flex items-baseline gap-3 text-sm'>
                <span className='w-14 shrink-0 text-xs tabular-nums opacity-60'>
                  {shortDate(event.date)}
                </span>
                <span className='truncate'>{event.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className='mt-4 grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardTitle hint='Units sold, all time'>Course sales</CardTitle>
          <BarList
            items={salesByCourse.map((course) => ({
              label: course.name,
              value: course.sales,
              note: `${gbp(course.revenue)} revenue`,
            }))}
            caption='Course sales'
            valueHead='Sales'
          />
          <p className='mt-4 text-xs leading-relaxed opacity-60'>
            Breath Foundations brings the most people in; the teachers course
            brings in nearly as much money from a tenth of the sales.
          </p>
        </Card>

        <Card>
          <CardTitle hint='Visitors, last 90 days'>Where people come from</CardTitle>
          <BarList
            items={trafficSources.map((source) => ({
              label: source.source,
              value: source.visitors,
              note: `${source.customers} bought · ${source.note}`,
            }))}
            caption='Traffic sources'
            valueHead='Visitors'
          />
        </Card>
      </div>

      <Card className='mt-4'>
        <CardTitle
          hint={`${recentOrders.length} most recent`}
        >
          Recent orders
        </CardTitle>
        <div className='-mx-5 overflow-x-auto px-5'>
          <table className='w-full min-w-[700px] text-left text-sm [&_td]:pr-5 [&_th]:pr-5 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0'>
            <thead>
              <tr className='border-b border-admin-border text-xs'>
                <th className='py-2 font-medium opacity-65'>Reference</th>
                <th className='py-2 font-medium opacity-65'>Customer</th>
                <th className='py-2 font-medium opacity-65'>Item</th>
                <th className='py-2 font-medium opacity-65'>Source</th>
                <th className='py-2 text-right font-medium opacity-65'>Amount</th>
                <th className='py-2 text-right font-medium opacity-65'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className='border-b border-admin-border/60'>
                  <td className='py-2.5 tabular-nums opacity-70'>{order.id}</td>
                  <td className='py-2.5 font-medium'>{order.customer}</td>
                  <td className='py-2.5 opacity-80'>{order.item}</td>
                  <td className='py-2.5 opacity-70'>{order.source}</td>
                  <td className='py-2.5 text-right tabular-nums'>
                    {gbp(order.amountGBP)}
                  </td>
                  <td className='py-2.5 text-right'>
                    <StatusChip status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          href='/admin/bookings'
          className='mt-4 inline-block text-sm underline underline-offset-4'
        >
          All orders and bookings →
        </Link>
      </Card>
    </div>
  );
}
