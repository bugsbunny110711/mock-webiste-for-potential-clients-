import type { Metadata } from 'next';
import { InView } from '@/components/core/in-view';
import { Gallery } from '@/components/site/gallery';
import { Photo } from '@/components/site/photo';
import { ButtonLink } from '@/components/ui/button';
import { coach } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Maya Ellison — Still Point',
  description:
    'Eleven years teaching breathwork and yoga in Bristol and online. How I work, who I work with, and who I turn away.',
};

const training = [
  { year: '2015', detail: '200hr yoga teacher training, Bristol Yoga Centre' },
  { year: '2017', detail: '300hr advanced training, focus on restorative and nidra' },
  { year: '2019', detail: 'Professional breathwork facilitation, 180hr' },
  { year: '2021', detail: 'Trauma-sensitive practice certification' },
  { year: '2023', detail: 'Breathing pattern disorders, clinical short course' },
  { year: '2025', detail: 'Supervision training — now supervising four teachers' },
];

export default function AboutPage() {
  return (
    <>
      <section className='mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center'>
        <div>
          <h1 className='text-5xl leading-tight sm:text-6xl'>
            I am not going to tell you to just breathe.
          </h1>
          <div className='mt-8 space-y-4 leading-relaxed opacity-85'>
            <p>
              I am {coach.name}. I teach breathwork and yoga in {coach.location} and
              online, and I have been doing it for {coach.yearsTeaching} years.
            </p>
            <p>
              Before this I spent nine years managing hospital estates projects.
              It was a good job and it nearly finished me. By the end I was
              sleeping about four hours a night and had developed what a GP
              eventually called a breathing pattern disorder — which is a clinical
              way of saying I had forgotten how to exhale properly.
            </p>
            <p>
              What helped was not a retreat or an app. It was a physiotherapist who
              spent forty minutes explaining what my diaphragm was actually doing,
              and then gave me something boring to practise. That is roughly the
              approach I have taught ever since.
            </p>
          </div>
        </div>
        <Photo
          id='coach-portrait'
          ratio='aspect-[4/5]'
          className='rounded-card'
          sizes='(max-width: 768px) 100vw, 50vw'
          priority
        />
      </section>

      <section className='border-y border-ink/10 bg-surface/50 py-20'>
        <div className='mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2'>
          <InView>
            <h2 className='text-4xl'>How I work</h2>
            <div className='mt-6 space-y-4 leading-relaxed opacity-85'>
              <p>
                Plainly. I will explain the physiology, because knowing why
                something works makes you far more likely to keep doing it.
              </p>
              <p>
                Slowly. Nothing I teach requires you to be flexible, fit, or
                spiritually inclined.
              </p>
              <p>
                Carefully. There is a health form before every course, and there
                are people I turn away — if you are in acute crisis, breathwork is
                not the first thing you need and I will say so.
              </p>
            </div>
          </InView>

          <InView>
            <h2 className='text-4xl'>Training</h2>
            <ol className='mt-6 divide-y divide-ink/10 border-y border-ink/10'>
              {training.map((item) => (
                <li key={item.year} className='flex gap-6 py-3.5 text-sm'>
                  <span className='w-12 shrink-0 opacity-70'>{item.year}</span>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ol>
          </InView>
        </div>
      </section>

      <section className='py-20'>
        <div className='mx-auto max-w-6xl px-6'>
          <InView>
            <h2 className='text-4xl'>The practice, in practice.</h2>
          </InView>
          <div className='mt-10'>
            <Gallery />
          </div>
        </div>
      </section>

      <section className='border-t border-ink/10 bg-band/25 py-20'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <InView>
            <h2 className='text-4xl'>Start with a conversation.</h2>
            <p className='mt-4 opacity-85'>
              Twenty minutes, free, and no pitch at the end of it.
            </p>
            <ButtonLink href='/book' size='lg' className='mt-8'>
              Book a discovery call
            </ButtonLink>
          </InView>
        </div>
      </section>
    </>
  );
}
