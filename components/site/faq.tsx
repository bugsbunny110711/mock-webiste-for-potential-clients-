import { faqs } from '@/lib/data';

export function Faq() {
  return (
    <div className='divide-y divide-ink/10 border-y border-ink/10'>
      {faqs.map((faq) => (
        <details key={faq.q} className='group py-5'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-6 text-left'>
            <span className='text-base font-medium'>{faq.q}</span>
            <span
              aria-hidden
              className='shrink-0 text-xl transition-transform group-open:rotate-45'
            >
              +
            </span>
          </summary>
          <p className='mt-3 max-w-2xl text-sm leading-relaxed opacity-85'>{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
