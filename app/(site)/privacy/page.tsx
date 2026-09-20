import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/legal-page';
import { coach } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy — Still Point',
  description:
    'What Still Point collects, why, how long it is kept, and how to have it deleted.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title='Privacy'
      updated='September 2026'
      intro='Short version: I collect as little as I can get away with, I do not sell anything to anyone, and the health information you give me is treated more carefully than the rest.'
      sections={[
        {
          heading: 'Who is responsible',
          paragraphs: [
            `${coach.brand} is run by ${coach.name} in ${coach.location}. For data protection purposes I am the data controller, and you can reach me at ${coach.email}.`,
          ],
        },
        {
          heading: 'What I collect',
          paragraphs: [
            'When you buy a course or book a session: your name, email address, what you bought, and the answers to the two optional questions at checkout about how you found me and what brought you here.',
            'When you complete the health form: information about your health, including conditions that make some breath practices unsuitable. This is special category data under UK GDPR and I treat it separately from everything else.',
            'When you visit the site: aggregate analytics about which pages are viewed and roughly where visitors arrive from. No individual profiles and no advertising trackers.',
            'Card details are handled entirely by the payment processor. They never reach my systems and I could not see them if I wanted to.',
          ],
        },
        {
          heading: 'Why I collect it',
          paragraphs: [
            'To deliver what you paid for — joining links, recordings, calendar invitations. That is contractual necessity.',
            'To teach you safely. The health form exists so I can tell you if a practice is not appropriate for you. The lawful basis for holding health information is your explicit consent, which you can withdraw at any time by emailing me.',
            'To understand which courses are working and where people are finding me. That is legitimate interest, and it runs on aggregated data.',
          ],
        },
        {
          heading: 'How long I keep it',
          paragraphs: [
            'Purchase records for six years, because HMRC requires it.',
            'Health form answers for two years after our last session, then deleted. If you ask me to delete them sooner I will, though it means I cannot teach you until you complete a new one.',
            'Mailing list subscriptions until you unsubscribe, which every email lets you do in one click.',
          ],
        },
        {
          heading: 'Who else sees it',
          paragraphs: [
            'The payment processor, for payments. The email provider, for sending joining links. The video platform, for live sessions. That is the complete list, and none of them are permitted to use your information for their own purposes.',
            'I have never had a request from law enforcement. If I did I would tell you unless legally prevented from doing so.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You can ask for a copy of everything I hold about you, ask me to correct it, or ask me to delete it. Email me and I will respond within a month, usually much sooner.',
            'If you think I have handled your information badly, you can complain to the Information Commissioner at ico.org.uk. I would rather you told me first so I can fix it.',
          ],
        },
      ]}
    />
  );
}
