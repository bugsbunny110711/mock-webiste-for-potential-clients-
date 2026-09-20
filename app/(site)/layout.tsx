import { SiteDock } from '@/components/site/site-dock';
import { Footer } from '@/components/site/footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteDock />
      {/* Clears the bar, which is fixed and so outside the flow. */}
      <main className='flex-1 pt-24 sm:pt-28'>{children}</main>
      <Footer />
    </div>
  );
}
