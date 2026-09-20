import { PageHeader, StatTile } from '@/components/admin/ui';
import { OrdersTable } from '@/components/admin/orders-table';
import { recentOrders } from '@/lib/admin-data';
import { gbp } from '@/lib/format';

export default function BookingsPage() {
  const paid = recentOrders.filter((order) => order.status === 'paid');
  const needsAttention = recentOrders.filter(
    (order) => order.status === 'failed' || order.status === 'pending',
  );
  const refunded = recentOrders.filter((order) => order.status === 'refunded');

  return (
    <div className='px-5 py-7 sm:px-8'>
      <PageHeader
        title='Orders & bookings'
        subtitle='Every purchase, and anything that needs chasing.'
      />

      <div className='mb-4 grid gap-4 sm:grid-cols-3'>
        <StatTile
          label='Settled'
          value={gbp(paid.reduce((sum, order) => sum + order.amountGBP, 0))}
          change={`${paid.length} orders`}
        />
        <StatTile
          label='Needs attention'
          value={String(needsAttention.length)}
          change={`${gbp(needsAttention.reduce((sum, o) => sum + o.amountGBP, 0))} at risk`}
          direction='down'
        />
        <StatTile
          label='Refunded'
          value={gbp(refunded.reduce((sum, order) => sum + order.amountGBP, 0))}
          change={`${refunded.length} this period`}
        />
      </div>

      <OrdersTable />
    </div>
  );
}
