import { PageHeader } from '@/components/admin/ui';
import { MasterCalendar } from '@/components/admin/master-calendar';

export default function CalendarPage() {
  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Master calendar'
        subtitle='Everything you are committed to, in one view.'
      />
      <MasterCalendar />
    </div>
  );
}
