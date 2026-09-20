import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';

export const metadata: Metadata = {
  title: 'Terms & refunds — Maya Ellison',
  description:
    'Booking terms, the refund policy, cancellation windows, and what this teaching is and is not.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title='Terms & refunds'
      updated='September 2026'
      intro='The rules, written to be read rather than to be impenetrable. If something here seems unfair, tell me and I will probably agree with you.'
      sections={[
        {
          heading: 'Refunds on courses',
          paragraphs: [
            'Full refund up to seven days after a course begins, no explanation needed. Email me and it is done.',
            'After seven days I will refund on a case-by-case basis. In eleven years I have not yet refused one, but I reserve the right to.',
            'If I cancel a course, you get everything back, in full, immediately.',
          ],
        },
        {
          heading: 'One-to-one sessions',
          paragraphs: [
            'Free to reschedule up to 24 hours before a session. Use the link in your confirmation email.',
            'Inside 24 hours the session is chargeable, because that slot is very unlikely to be filled. If something genuinely awful has happened, tell me and I will waive it.',
            'If I have to cancel on you, you get the session free.',
          ],
        },
        {
          heading: 'Retreats',
          paragraphs: [
            'A deposit holds your place and is non-refundable, because accommodation is booked on the strength of it.',
            'The balance is due eight weeks before. Cancel more than eight weeks out and you lose only the deposit; inside eight weeks the balance is non-refundable unless the place is resold.',
            'Please take out travel insurance. I cannot cover a cancelled flight and neither can the farmhouse.',
          ],
        },
        {
          heading: 'What this is not',
          paragraphs: [
            'Breathwork and yoga are not medical treatment, and nothing I teach is a substitute for care from a doctor, therapist or physiotherapist. I am not qualified to diagnose or treat anything.',
            'If you are in acute distress, breathwork is not the first thing you need. Please speak to your GP, or call Samaritans on 116 123.',
          ],
        },
        {
          heading: 'Health and suitability',
          paragraphs: [
            'Some practices are not suitable during pregnancy, or with epilepsy, uncontrolled high blood pressure, glaucoma, detached retina or a recent cardiac event.',
            'There is a short health form before every course and every first session. If something on it gives me pause I will contact you before we meet, and refund you in full if we cannot safely go ahead.',
            'You are responsible for telling me the truth on that form and for updating me if things change. I cannot teach you safely around information I do not have.',
          ],
        },
        {
          heading: 'Recordings',
          paragraphs: [
            'Course recordings stay available to you for a year from the course start date.',
            'They are for you. Please do not share, repost or resell them — the courses are priced on the assumption that people buy their own.',
          ],
        },
      ]}
    />
  );
}
