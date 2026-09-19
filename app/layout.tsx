import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Still Point — Breathwork & Yoga with Maya Ellison',
  description:
    'Breathwork and yoga courses, and one-to-one sessions, for people who want to put their nervous system back in their own hands.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${inter.variable} ${newsreader.variable}`}>
      <body className='min-h-screen antialiased'>{children}</body>
    </html>
  );
}
