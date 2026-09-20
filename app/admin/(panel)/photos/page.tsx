import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { photos, getPhoto, missingPhotos, type PhotoId } from '@/lib/photos';

const GROUPS: { heading: string; note: string; ids: PhotoId[] }[] = [
  {
    heading: 'You',
    note: 'The ones that matter most. People buy from a face.',
    ids: [
      'coach-portrait',
      'coach-portrait-seated',
      'coach-teaching',
      'coach-adjusting',
      'coach-demonstrating',
    ],
  },
  {
    heading: 'The space',
    note: 'Shot empty and in use. Morning light if you can.',
    ids: ['studio-wide', 'studio-detail', 'class-group'],
  },
  {
    heading: 'Retreats',
    note: 'Can be from previous years if the location is the same.',
    ids: ['retreat-portugal', 'retreat-devon'],
  },
  {
    heading: 'Course covers',
    note: 'One per course. They should feel like a set.',
    ids: [
      'course-breath-foundations',
      'course-slow-yoga',
      'course-deep-rest',
      'course-breathwork-for-teachers',
    ],
  },
  {
    heading: 'Journal',
    note: 'Lowest priority — abstract or studio details work fine.',
    ids: ['journal-nervous-system', 'journal-sleep', 'journal-teaching'],
  },
];

export default function PhotosPage() {
  const outstanding = missingPhotos();
  const total = Object.keys(photos).length;
  const done = total - outstanding.length;

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Photo shot list'
        subtitle='Every image the site is waiting on, grouped by shoot.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Photos in place'
          value={`${done} / ${total}`}
          change={`${outstanding.length} still needed`}
          direction={outstanding.length === 0 ? 'up' : 'down'}
        />
        <StatTile
          label='Priority'
          value='Portrait & teaching'
          change='five shots, one session'
        />
        <StatTile
          label='Blocking launch'
          value={outstanding.length > 0 ? 'Yes' : 'No'}
          change='placeholders are visible on the live site'
          direction={outstanding.length > 0 ? 'down' : 'up'}
        />
      </div>

      <div className='space-y-4'>
        {GROUPS.map((group) => {
          const groupOutstanding = group.ids.filter((id) => !getPhoto(id).src);
          return (
            <Card key={group.heading}>
              <CardTitle
                hint={`${group.ids.length - groupOutstanding.length} / ${group.ids.length} done`}
              >
                {group.heading}
              </CardTitle>
              <p className='-mt-2 mb-4 text-xs opacity-60'>{group.note}</p>

              <ul className='divide-y divide-admin-border'>
                {group.ids.map((id) => {
                  const slot = getPhoto(id);
                  const hasPhoto = Boolean(slot.src);
                  return (
                    <li key={id} className='flex gap-4 py-3'>
                      <span
                        aria-hidden
                        className={
                          hasPhoto
                            ? 'mt-0.5 text-success'
                            : 'mt-0.5 text-warning'
                        }
                      >
                        {hasPhoto ? '✓' : '○'}
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='block text-sm font-medium'>
                          {slot.brief}
                        </span>
                        <span className='mt-0.5 block text-xs opacity-60'>
                          Minimum {slot.size} · saves to{' '}
                          <code className='rounded bg-admin-canvas px-1 py-0.5'>
                            public/photos/{id}.jpg
                          </code>
                        </span>
                      </span>
                      <span className='shrink-0 text-xs opacity-55'>
                        {hasPhoto ? 'In place' : 'Needed'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      <Card className='mt-4'>
        <CardTitle>How to add them</CardTitle>
        <ol className='space-y-2 text-sm leading-relaxed opacity-85'>
          <li>
            1. Save the file into{' '}
            <code className='rounded bg-admin-canvas px-1 py-0.5'>
              public/photos/
            </code>{' '}
            using the filename listed above.
          </li>
          <li>
            2. In{' '}
            <code className='rounded bg-admin-canvas px-1 py-0.5'>
              lib/photos.ts
            </code>
            , add{' '}
            <code className='rounded bg-admin-canvas px-1 py-0.5'>
              src: &apos;/photos/&lt;name&gt;.jpg&apos;
            </code>{' '}
            to that slot.
          </li>
          <li>
            3. That is all. The placeholder disappears and the real photograph is
            served in modern formats at the right size for each device.
          </li>
        </ol>
        <p className='mt-4 border-t border-admin-border pt-4 text-xs leading-relaxed opacity-60'>
          Get written consent from anyone recognisable in a class or adjustment
          photo, and keep it on file. A student in savasana cannot consent in the
          moment.
        </p>
      </Card>
    </div>
  );
}
