'use client';

import { useState } from 'react';
import { gbp } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Charts are hand-built rather than pulled from a library so the palette rules
 * in DESIGN.md §3 hold exactly: at most two colours per chart, 2px gaps between
 * fills, recessive gridlines, and a table view for every plot.
 */

/**
 * Axis steps a person can read at a glance: quarters of an arbitrary maximum
 * give labels like 2.625k, which nobody wants on a chart.
 */
function niceScale(max: number): { ceiling: number; step: number } {
  const candidates = [50, 100, 250, 500, 1000, 2000, 2500, 5000, 10000, 25000];
  for (const step of candidates) {
    if (max <= step * 4) return { ceiling: step * 4, step };
  }
  const step = Math.ceil(max / 4 / 25000) * 25000;
  return { ceiling: step * 4, step };
}

function axisLabel(value: number): string {
  if (value === 0) return '0';
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return String(value);
}

const SERIES = {
  courses: { label: 'Courses', color: 'var(--color-chart-1)' },
  oneToOne: { label: 'One-to-one', color: 'var(--color-chart-2)' },
};

type RevenueRow = { week: string; courses: number; oneToOne: number };

export function RevenueChart({ data }: { data: RevenueRow[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = Math.max(...data.map((d) => d.courses + d.oneToOne));
  const { ceiling, step } = niceScale(max);
  const gridlines = Array.from({ length: 5 }, (_, i) => i * step);

  return (
    <div>
      <div className='mb-5 flex flex-wrap items-center gap-4'>
        {Object.values(SERIES).map((series) => (
          <span key={series.label} className='flex items-center gap-2 text-xs'>
            <span
              aria-hidden
              className='size-2.5 rounded-sm'
              style={{ backgroundColor: series.color }}
            />
            {series.label}
          </span>
        ))}
      </div>

      <div className='relative h-56'>
        {/* Recessive gridlines, drawn behind the marks. */}
        <div className='absolute inset-0 flex flex-col-reverse justify-between'>
          {gridlines.map((value) => (
            <div key={value} className='flex items-center gap-2'>
              <span className='w-10 shrink-0 text-right text-[10px] tabular-nums opacity-45'>
                {axisLabel(value)}
              </span>
              <span className='h-px flex-1 bg-band/50' />
            </div>
          ))}
        </div>

        <div className='absolute inset-0 ml-12 flex items-end gap-1.5'>
          {data.map((row, index) => {
            const total = row.courses + row.oneToOne;
            const isHovered = hovered === index;
            return (
              <div
                key={row.week}
                className='relative flex h-full flex-1 flex-col justify-end'
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role='img'
                aria-label={`${row.week}: courses ${gbp(row.courses)}, one-to-one ${gbp(row.oneToOne)}`}
              >
                {isHovered && (
                  <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-xl bg-ink p-3 text-canvas shadow-lg'>
                    <p className='text-xs font-semibold'>{row.week}</p>
                    <dl className='mt-2 space-y-1 text-[11px]'>
                      <div className='flex justify-between gap-3'>
                        <dt className='opacity-80'>Courses</dt>
                        <dd className='tabular-nums'>{gbp(row.courses)}</dd>
                      </div>
                      <div className='flex justify-between gap-3'>
                        <dt className='opacity-80'>One-to-one</dt>
                        <dd className='tabular-nums'>{gbp(row.oneToOne)}</dd>
                      </div>
                      <div className='flex justify-between gap-3 border-t border-canvas/25 pt-1 font-semibold'>
                        <dt>Total</dt>
                        <dd className='tabular-nums'>{gbp(total)}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {/* 2px gap between stacked segments keeps them legible where
                    the two hues meet. */}
                <div
                  className='w-full rounded-t-[4px] transition-opacity'
                  style={{
                    height: `${(row.oneToOne / ceiling) * 100}%`,
                    backgroundColor: SERIES.oneToOne.color,
                    opacity: hovered === null || isHovered ? 1 : 0.55,
                  }}
                />
                <div className='h-0.5 w-full' />
                <div
                  className='w-full transition-opacity'
                  style={{
                    height: `${(row.courses / ceiling) * 100}%`,
                    backgroundColor: SERIES.courses.color,
                    opacity: hovered === null || isHovered ? 1 : 0.55,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className='ml-12 mt-2 flex gap-1.5'>
        {data.map((row, index) => (
          <span
            key={row.week}
            className={cn(
              'flex-1 text-center text-[10px] opacity-55',
              // Every other label is dropped on narrow screens rather than
              // letting them collide.
              index % 2 === 1 && 'opacity-0 sm:opacity-55',
            )}
          >
            {row.week}
          </span>
        ))}
      </div>

      <ChartTable
        caption='Revenue by week'
        head={['Week', 'Courses', 'One-to-one', 'Total']}
        rows={data.map((row) => [
          row.week,
          gbp(row.courses),
          gbp(row.oneToOne),
          gbp(row.courses + row.oneToOne),
        ])}
      />
    </div>
  );
}

/**
 * Many categories, one measure: sorted bars in a single hue. Identity comes from
 * the label and the ordering, so colour carries nothing and cannot mislead.
 */
export function BarList({
  items,
  format = 'number',
  caption,
  valueHead = 'Value',
}: {
  items: { label: string; value: number; note?: string }[];
  // A format name rather than a formatter function: this is a client component,
  // and functions cannot cross the server boundary.
  format?: 'number' | 'currency';
  caption: string;
  valueHead?: string;
}) {
  const formatValue = (value: number) =>
    format === 'currency' ? gbp(value) : value.toLocaleString('en-GB');
  const max = Math.max(...items.map((item) => item.value));
  const sorted = [...items].sort((a, b) => b.value - a.value);

  return (
    <div>
      <ul className='space-y-3'>
        {sorted.map((item) => (
          <li key={item.label}>
            <div className='flex items-baseline justify-between gap-4 text-sm'>
              <span className='truncate font-medium'>{item.label}</span>
              <span className='shrink-0 tabular-nums'>{formatValue(item.value)}</span>
            </div>
            <div className='mt-1.5 h-2 w-full overflow-hidden rounded-full bg-admin-canvas'>
              <div
                className='h-full rounded-full'
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: 'var(--color-chart-1)',
                }}
              />
            </div>
            {item.note && (
              <p className='mt-1 text-xs opacity-55'>{item.note}</p>
            )}
          </li>
        ))}
      </ul>

      <ChartTable
        caption={caption}
        head={['Item', valueHead]}
        rows={sorted.map((item) => [item.label, formatValue(item.value)])}
      />
    </div>
  );
}

function ChartTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <details className='mt-4'>
      <summary className='cursor-pointer text-xs opacity-55 hover:opacity-100'>
        View as table
      </summary>
      <table className='mt-3 w-full text-left text-xs'>
        <caption className='sr-only'>{caption}</caption>
        <thead>
          <tr className='border-b border-admin-border'>
            {head.map((cell) => (
              <th key={cell} className='py-1.5 font-medium opacity-65'>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className='border-b border-admin-border/60'>
              {row.map((cell, index) => (
                <td key={index} className='py-1.5 tabular-nums'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
