import { PageHeader, StatTile } from '@/components/admin/ui';
import { StudentsTable } from '@/components/admin/students-table';
import { students } from '@/lib/admin-data';
import { gbp } from '@/lib/format';

export default function StudentsPage() {
  const active = students.filter((student) => student.status === 'active');
  const lifetime = students.reduce((sum, s) => sum + s.lifetimeGBP, 0);
  const repeat = students.filter(
    (student) => student.courses.length + student.sessions > 1,
  );

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='People'
        subtitle='Everyone who has ever bought something, and what you need to know about them.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Active'
          value={String(active.length)}
          change={`of ${students.length} total`}
        />
        <StatTile
          label='Lifetime value'
          value={gbp(lifetime)}
          change={`${gbp(Math.round(lifetime / students.length))} average`}
        />
        <StatTile
          label='Came back'
          value={`${Math.round((repeat.length / students.length) * 100)}%`}
          change={`${repeat.length} bought more than once`}
        />
      </div>

      <StudentsTable />
    </div>
  );
}
