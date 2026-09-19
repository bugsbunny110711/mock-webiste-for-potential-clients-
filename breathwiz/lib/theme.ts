import { brand } from '@/config/brand';

/**
 * Turns the colour palette in config/brand.ts into CSS custom properties.
 *
 * This is what makes brand.ts the single source of truth: the stylesheet
 * never hardcodes a hex value, it only reads these variables. Change a
 * colour in brand.ts and every gradient, glow and glass panel follows.
 *
 * Injected once in app/layout.tsx.
 */
export function themeVariables(): string {
  const c = brand.colors;
  const vars = Object.entries(c)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `:root {\n${vars}\n  --font-display: ${brand.fonts.display};\n  --font-body: ${brand.fonts.body};\n}`;
}
