'use client';

import { useMemo, useState } from 'react';
import { students, type Student } from '@/lib/admin-data';
import { gbp, shortDate } from '@/lib/format';
import { Card, CardTitle } from './ui';
import { cn } from '@/lib/utils';

const FILTERS: (Student['status'] | 'all')[] = ['all', 'active', 'completed', 'lapsed'];

const statusStyles: Record<Student['status'], string> = {
  active: 'bg-success/12 text-success',
  completed: 'bg-admin-canvas text-ink',
  lapsed: 'bg-danger/10 text-danger',
};

export function StudentsTable() {
  const [filter, setFilter] = useState<Student['status'] | 'all'>('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students
      .filter((student) => filter === 'all' || student.status === filter)
      .filter(
        (student) =>
          term === '' ||
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term),
      )
      .sort((a, b) => b.lifetimeGBP - a.lifetimeGBP);
  }, [filter, query]);

  const missingForms = students.filter(
    (student) => !student.healthFormOnFile && student.status === 'active',
  );

  return (
    <Card>
      <CardTitle hint={`${students.length} on the books`}>People</CardTitle>

      {missingForms.length > 0 && (
        <p className='mb-4 rounded-xl bg-warning/12 px-4 py-3 text-sm text-warning'>
          <span aria-hidden>•</span> {missingForms.length} active{' '}
          {missingForms.length === 1 ? 'person has' : 'people have'} no health
          form on file. Chase before their first session.
        </p>
      )}

      <div className='mb-4 flex flex-wrap items-center gap-3'>
        <div className='flex flex-wrap gap-1.5'>
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
            </button>
          ))}
        </div>

        <input
          type='search'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search name or email'
          aria-label='Search people'
          className='ml-auto h-9 w-full rounded-lg border border-admin-border bg-admin-canvas px-3 text-sm focus:border-ink focus:outline-none sm:w-56'
        />
      </div>

      <div className='-mx-5 overflow-x-auto px-5'>
        <table className='w-full min-w-[920px] text-left text-sm [&_td]:pr-5 [&_th]:pr-5 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0'>
          <thead>
            <tr className='border-b border-admin-border text-xs'>
              <th className='py-2 font-medium opacity-65'>Name</th>
              <th className='py-2 font-medium opacity-65'>Joined</th>
              <th className='py-2 font-medium opacity-65'>Courses</th>
              <th className='py-2 text-right font-medium opacity-65'>1-1s</th>
              <th className='py-2 text-right font-medium opacity-65'>Lifetime</th>
              <th className='py-2 font-medium opacity-65'>Health form</th>
              <th className='py-2 text-right font-medium opacity-65'>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((student) => (
              <tr key={student.id} className='border-b border-admin-border/60 align-top'>
                <td className='py-2.5'>
                  <span className='block font-medium'>{student.name}</span>
                  <span className='block text-xs opacity-60'>{student.email}</span>
                  {student.note && (
                    <span className='mt-1 block text-xs opacity-70'>
                      {student.note}
                    </span>
                  )}
                </td>
                <td className='py-2.5 whitespace-nowrap opacity-70'>
                  {shortDate(student.joined)}
                </td>
                <td className='py-2.5 opacity-80'>
                  {student.courses.length === 0 ? (
                    <span className='opacity-60'>—</span>
                  ) : (
                    student.courses.join(', ')
                  )}
                </td>
                <td className='py-2.5 text-right tabular-nums'>{student.sessions}</td>
                <td className='py-2.5 text-right tabular-nums'>
                  {gbp(student.lifetimeGBP)}
                </td>
                <td className='py-2.5'>
                  {student.healthFormOnFile ? (
                    <span className='text-xs text-success'>
                      <span aria-hidden>✓</span> On file
                    </span>
                  ) : (
                    <span className='text-xs text-warning'>
                      <span aria-hidden>•</span> Missing
                    </span>
                  )}
                </td>
                <td className='py-2.5 text-right'>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                      statusStyles[student.status],
                    )}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className='py-6 text-center text-sm opacity-60'>Nobody matches that.</p>
      )}
    </Card>
  );
}
