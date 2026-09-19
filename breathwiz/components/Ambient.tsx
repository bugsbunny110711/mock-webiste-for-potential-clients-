/**
 * The layered light behind every page.
 *
 * Three soft radial glows on a dark base, stacked with a slow drift.
 * This replaces photography: it gives depth and colour without any
 * image download, and it never pixelates at any screen size.
 *
 * Deliberately only three layers — each one is a composited surface,
 * and more than this starts to cost frames on mid-range phones.
 */
export function Ambient() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />

      {/* Primary aqua glow, upper left. */}
      <div
        className="absolute -left-[15%] -top-[20%] h-[75vh] w-[75vw] rounded-full opacity-75 blur-[100px] drift"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--aqua) 42%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Warm sand glow, lower right — keeps the palette from going cold. */}
      <div
        className="absolute -bottom-[25%] -right-[10%] h-[70vh] w-[65vw] rounded-full opacity-55 blur-[110px] drift-slow"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--sand) 34%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Lilac depth, centre right. */}
      <div
        className="absolute right-[10%] top-[30%] h-[50vh] w-[45vw] rounded-full opacity-45 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--lilac) 38%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* A vignette so text near the edges always has contrast behind it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, color-mix(in srgb, var(--ink) 62%, transparent) 100%)',
        }}
      />
    </div>
  );
}
