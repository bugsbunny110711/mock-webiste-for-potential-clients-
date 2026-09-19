import { chromium } from '@playwright/test';

const SIZES = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet',  w: 768,  h: 1024 },
  { name: 'mobile',  w: 360,  h: 780 },
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const s of SIZES) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

  // Catch the opening cover mid-breath (desktop only, it's the same everywhere).
  if (s.name === 'desktop') {
    await page.waitForTimeout(1300);
    await page.screenshot({ path: 'shots/00-opening-cover.png' });
  }

  // Let the cover finish and the hero settle.
  await page.waitForTimeout(5200);
  await page.screenshot({ path: `shots/01-hero-${s.name}.png` });

  console.log(`${s.name} (${s.w}px) — console errors: ${errors.length ? errors.join(' | ') : 'none'}`);
  await ctx.close();
}

await browser.close();
