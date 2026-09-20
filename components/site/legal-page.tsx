import Link from 'next/link';

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}) {
  return (
    <div className='mx-auto max-w-3xl px-6 py-20'>
      <h1 className='text-4xl sm:text-5xl'>{title}</h1>
      <p className='mt-3 text-sm opacity-70'>Last updated {updated}</p>
      <p className='mt-8 text-lg leading-relaxed opacity-85'>{intro}</p>

      <div className='mt-4 rounded-card border border-dashed border-ink/25 p-5 text-sm leading-relaxed opacity-80'>
        <p className='font-medium opacity-100'>Demonstration text</p>
        <p className='mt-1'>
          This page is plausible placeholder wording written for a demonstration
          build. It has not been reviewed by a solicitor and must be replaced
          with proper advice before the site takes real money or real health
          information.
        </p>
      </div>

      <div className='mt-12 space-y-10'>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className='text-2xl'>{section.heading}</h2>
            <div className='mt-4 space-y-4 leading-relaxed opacity-85'>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className='mt-14 border-t border-ink/10 pt-6 text-sm opacity-80'>
        Questions about any of this?{' '}
        <Link href='/contact' className='underline underline-offset-4'>
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
