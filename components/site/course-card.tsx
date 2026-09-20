import Link from 'next/link';
import { type Course } from '@/lib/data';
import { gbp } from '@/lib/format';
import { Tag } from '@/components/ui/field';
import { Photo } from './photo';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className='group flex flex-col overflow-hidden rounded-card bg-surface transition-colors hover:bg-surface/70'
    >
      <Photo
        id={course.photoId}
        ratio='aspect-[3/2]'
        sizes='(max-width: 640px) 100vw, 50vw'
      />
      <div className='flex flex-1 flex-col p-6'>
        <div className='flex flex-wrap items-center gap-2'>
          <Tag>{course.level}</Tag>
          <Tag>{course.weeks} weeks</Tag>
        </div>
        <h3 className='mt-4 font-display text-2xl font-light'>{course.title}</h3>
        <p className='mt-2 flex-1 text-sm leading-relaxed opacity-85'>
          {course.tagline}
        </p>
        <div className='mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4'>
          <span className='text-lg'>{gbp(course.priceGBP)}</span>
          <span className='text-sm underline-offset-4 group-hover:underline'>
            See the course →
          </span>
        </div>
      </div>
    </Link>
  );
}
