import { BrandMark } from '@/components/site/brand-mark';
import { SiteDock } from '@/components/site/site-dock';
import { Footer } from '@/components/site/footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <BrandMark />
      {/* Top padding clears the floating brand mark; bottom padding keeps the
          dock from covering the last of the footer. */}
      <main className='flex-1 pt-20'>{children}</main>
      <Footer />
      <div aria-hidden className='h-24 sm:h-28' />
      <SiteDock />
    </div>
  );
}
