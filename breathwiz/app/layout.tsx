import type { Metadata, Viewport } from 'next';
import { brand } from '@/config/brand';
import { themeVariables } from '@/lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: `Guided breathwork with ${brand.coach.name}. Live workshops, structured courses and one-to-one sessions, plus a free breathing tool you can use right now.`,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: `Guided breathwork with ${brand.coach.name}.`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: brand.colors.ink,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Brand colours from config/brand.ts, as CSS variables. */}
        <style dangerouslySetInnerHTML={{ __html: themeVariables() }} />
        {/* Preload both fonts so the opening cover has them ready. */}
        <link rel="preload" href="/fonts/Fraunces-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/DMSans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="grain">
        {/* Skip link — first stop for keyboard and screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-aqua focus:px-5 focus:py-2.5 focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
