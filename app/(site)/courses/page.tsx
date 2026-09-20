import type { Metadata } from 'next';
import { InView } from '@/components/core/in-view';
import { CourseCard } from '@/components/site/course-card';
import { courses } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Courses — Maya Ellison',
  description:
    'Breathwork and yoga courses, live online and always recorded. Foundation through to professional training for teachers.',
};

export default function CoursesPage() {
  return (
    <div className='mx-auto max-w-6xl px-6 py-20'>
      <h1 className='max-w-3xl text-5xl leading-tight sm:text-6xl'>
        Four courses. Start wherever you actually are.
      </h1>
      <p className='mt-6 max-w-xl text-lg opacity-85'>
        Everything is live online in a small group, and everything is recorded.
        If you are not sure which one fits, book a free discovery call and I will
        tell you honestly.
      </p>

      <InView className='mt-16 grid gap-6 sm:grid-cols-2'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </InView>
    </div>
  );
}
