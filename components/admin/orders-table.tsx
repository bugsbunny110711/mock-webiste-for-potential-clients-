'use client';

import { useState } from 'react';
import { recentOrders, type Order } from '@/lib/admin-data';
import { gbp, shortDate } from '@/lib/format';
import { Card, CardTitle, StatusChip } from './ui';
import { cn } from '@/lib/utils';

const FILTERS: (Order['status'] | 'all')[] = [
  'all',
  'paid',
  'pending',
  'failed',
  'refunded',
];

export function OrdersTable() {
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  const rows =
    filter === 'all'
      ? recentOrders
      : recentOrders.filter((order) => order.status === filter);

  const paidTotal = recentOrders
    .filter((order) => order.status === 'paid')
    .reduce((sum, order) => sum + order.amountGBP, 0);

  return (
    <Card>
      <CardTitle hint={`${gbp(paidTotal)} settled`}>
        Orders and bookings
      </CardTitle>

      <div className='mb-4 flex flex-wrap gap-1.5'>
        {FILTERS.map((option) => (
          <button
            key={option}
            type='button'
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs capitalize transition-colors',
              filter === option
                ? 'bg-ink text-canvas'
                : 'bg-admin-canvas hover:bg-band/40',
            )}
          >
            {option}
            {option !== 'all' && (
              <span className='ml-1.5 tabular-nums opacity-60'>
                {recentOrders.filter((order) => order.status === option).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className='-mx-5 overflow-x-auto px-5'>
        <table className='w-full min-w-[760px] text-left text-sm [&_td]:pr-5 [&_th]:pr-5 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0'>
          <thead>
            <tr className='border-b border-admin-border text-xs'>
              <th className='py-2 font-medium opacity-65'>Date</th>
              <th className='py-2 font-medium opacity-65'>Reference</th>
              <th className='py-2 font-medium opacity-65'>Customer</th>
              <th className='py-2 font-medium opacity-65'>Item</th>
              <th className='py-2 font-medium opacity-65'>Found via</th>
              <th className='py-2 text-right font-medium opacity-65'>Amount</th>
              <th className='py-2 text-right font-medium opacity-65'>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className='border-b border-admin-border/60'>
                <td className='py-2.5 whitespace-nowrap opacity-70'>
                  {shortDate(order.date)}
                </td>
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

      {rows.length === 0 && (
        <p className='py-6 text-center text-sm opacity-60'>
          Nothing with that status.
        </p>
      )}
    </Card>
  );
}
