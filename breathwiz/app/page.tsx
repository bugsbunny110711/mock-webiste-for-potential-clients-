'use client';

import { useState } from 'react';
import { Ambient } from '@/components/Ambient';
import { Preloader } from '@/components/Preloader';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';

/**
 * Home page.
 *
 * `ready` gates the hero's entrance animation on the opening cover
 * finishing, so nothing animates in behind the cover and then sits
 * still once it lifts.
 */
export default function HomePage() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Ambient />
      <Header ready={ready} />
      <main id="main">
        <Hero ready={ready} />
      </main>
    </>
  );
}
