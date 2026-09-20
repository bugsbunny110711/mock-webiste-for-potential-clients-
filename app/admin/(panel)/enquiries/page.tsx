import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { enquiries } from '@/lib/admin-data';
import { longDate, shortDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function EnquiriesPage() {
  const unanswered = enquiries.filter((enquiry) => enquiry.status === 'new');
  const oldestNew = [...unanswered].sort((a, b) =>
    a.date.localeCompare(b.date),
  )[0];

  const bySubject = enquiries.reduce<Record<string, number>>((acc, enquiry) => {
    acc[enquiry.subject] = (acc[enquiry.subject] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Enquiries'
        subtitle='Messages from the contact form, oldest unanswered first.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Waiting on you'
          value={String(unanswered.length)}
          change={
            oldestNew ? `oldest ${shortDate(oldestNew.date)}` : 'all clear'
          }
          direction={unanswered.length > 2 ? 'down' : 'up'}
        />
        <StatTile
          label='Answered'
          value={String(enquiries.length - unanswered.length)}
          change={`of ${enquiries.length} this month`}
        />
        <StatTile
          label='Most asked about'
          value={
            Object.entries(bySubject).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
          }
          change='by subject line'
        />
      </div>

      <Card>
        <CardTitle hint='Newest first'>Inbox</CardTitle>
        <ul className='divide-y divide-admin-border'>
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className='py-4 first:pt-0 last:pb-0'>
              <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                <span className='font-medium'>{enquiry.name}</span>
                <span className='text-xs opacity-60'>{enquiry.email}</span>
                <span
                  className={cn(
                    'ml-auto rounded-full px-2.5 py-1 text-xs font-medium',
                    enquiry.status === 'new'
                      ? 'bg-warning/15 text-warning'
                      : 'bg-success/12 text-success',
                  )}
                >
                  <span aria-hidden>{enquiry.status === 'new' ? '•' : '✓'}</span>{' '}
                  {enquiry.status === 'new' ? 'Needs a reply' : 'Replied'}
                </span>
              </div>

              <p className='mt-2 text-sm leading-relaxed opacity-85'>
                {enquiry.excerpt}
              </p>

              <div className='mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-60'>
                <span>{longDate(enquiry.date)}</span>
                <span>About: {enquiry.subject}</span>
                <span>Found you via {enquiry.source}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className='mt-5 border-t border-admin-border pt-4 text-xs leading-relaxed opacity-60'>
          Enquiries are not stored in this demonstration build — the contact form
          validates and acknowledges, then discards. These are seeded examples.
        </p>
      </Card>
    </div>
  );
}
