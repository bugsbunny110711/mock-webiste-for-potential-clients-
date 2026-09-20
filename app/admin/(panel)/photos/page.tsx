import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { photos, getPhoto, missingPhotos, type PhotoId } from '@/lib/photos';
import { PhotoUploader } from '@/components/admin/photo-uploader';

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
                    <li key={id} className='flex flex-wrap gap-5 py-4'>
                      <PhotoUploader
                        slotId={id}
                        label={slot.alt}
                        currentSrc={slot.src}
                      />

                      <span className='min-w-56 flex-1'>
                        <span className='flex items-start gap-3'>
                          <span
                            aria-hidden
                            className={hasPhoto ? 'text-success' : 'text-warning'}
                          >
                            {hasPhoto ? '✓' : '○'}
                          </span>
                          <span>
                            <span className='block text-sm font-medium'>
                              {slot.brief}
                            </span>
                            <span className='mt-1 block text-xs opacity-60'>
                              Minimum {slot.size} · JPEG, PNG or WebP · 8MB max
                            </span>
                            <span className='mt-1 block text-xs opacity-55'>
                              {hasPhoto
                                ? 'In place — drop a new file to replace it'
                                : 'Still needed'}
                            </span>
                          </span>
                        </span>
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
        <CardTitle>About uploading</CardTitle>
        <p className='text-sm leading-relaxed opacity-85'>
          Drop a photograph onto any slot above, or click it to choose a file.
          It is saved, the placeholder disappears, and the image is served in
          modern formats at the right size for each device.
        </p>
        <p className='mt-3 text-sm leading-relaxed opacity-85'>
          Get written consent from anyone recognisable in a class or adjustment
          photograph, and keep it on file. A student in savasana cannot consent
          in the moment.
        </p>
        <p className='mt-4 border-t border-admin-border pt-4 text-xs leading-relaxed opacity-60'>
          <strong className='font-medium opacity-100'>
            Uploading works when the site is run locally.
          </strong>{' '}
          On a hosted deployment the filesystem is read-only, so saving fails and
          the slot will say so. Making it work live needs object storage — Vercel
          Blob is the natural choice here — plus somewhere to keep the slot-to-file
          mapping, which is the same database this build is missing for orders and
          enquiries.
        </p>
      </Card>
    </div>
  );
}
