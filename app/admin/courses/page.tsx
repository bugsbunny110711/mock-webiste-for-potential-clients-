import { Card, CardTitle, PageHeader, StatTile } from '@/components/admin/ui';
import { BarList } from '@/components/admin/charts';
import { salesByCourse } from '@/lib/admin-data';
import { courses } from '@/lib/data';
import { gbp } from '@/lib/format';

export default function AdminCoursesPage() {
  const totalRevenue = salesByCourse.reduce((sum, c) => sum + c.revenue, 0);
  const totalSales = salesByCourse.reduce((sum, c) => sum + c.sales, 0);
  const topByRevenue = [...salesByCourse].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Courses'
        subtitle='What is selling, and what it is worth.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Course revenue'
          value={gbp(totalRevenue)}
          change={`${totalSales} enrolments`}
          direction='up'
        />
        <StatTile
          label='Highest earning'
          value={topByRevenue.name}
          change={gbp(topByRevenue.revenue)}
          direction='up'
        />
        <StatTile
          label='Average order'
          value={gbp(Math.round(totalRevenue / totalSales))}
          change='across all courses'
          direction='up'
        />
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardTitle hint='Units'>Enrolments by course</CardTitle>
          <BarList
            items={salesByCourse.map((course) => ({
              label: course.name,
              value: course.sales,
            }))}
            caption='Enrolments by course'
            valueHead='Enrolments'
          />
        </Card>

        <Card>
          <CardTitle hint='Revenue'>Earnings by course</CardTitle>
          <BarList
            items={salesByCourse.map((course) => ({
              label: course.name,
              value: course.revenue,
            }))}
            format='currency'
            caption='Revenue by course'
            valueHead='Revenue'
          />
          <p className='mt-4 text-xs leading-relaxed opacity-60'>
            Breathwork for Teachers is six sales and the second highest earner.
            Volume and value are not the same question.
          </p>
        </Card>
      </div>

      <Card className='mt-4'>
        <CardTitle hint='Live on the site'>Course catalogue</CardTitle>
        <div className='-mx-5 overflow-x-auto px-5'>
          <table className='w-full min-w-[640px] text-left text-sm'>
            <thead>
              <tr className='border-b border-admin-border text-xs'>
                <th className='py-2 font-medium opacity-65'>Course</th>
                <th className='py-2 font-medium opacity-65'>Level</th>
                <th className='py-2 text-right font-medium opacity-65'>Weeks</th>
                <th className='py-2 text-right font-medium opacity-65'>Price</th>
                <th className='py-2 text-right font-medium opacity-65'>
                  All-time students
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className='border-b border-admin-border/60'>
                  <td className='py-2.5 font-medium'>{course.title}</td>
                  <td className='py-2.5 opacity-70'>{course.level}</td>
                  <td className='py-2.5 text-right tabular-nums'>{course.weeks}</td>
                  <td className='py-2.5 text-right tabular-nums'>
                    {gbp(course.priceGBP)}
                  </td>
                  <td className='py-2.5 text-right tabular-nums'>
                    {course.enrolled.toLocaleString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
