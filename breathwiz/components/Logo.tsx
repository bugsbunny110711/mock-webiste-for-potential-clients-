/**
 * The BreathWiz mark: three concentric rings around a solid core,
 * drawn so the rings read as a breath expanding outward.
 *
 * `animated` makes the outer rings pulse — used only on the opening
 * cover. Everywhere else the mark is static.
 */
export function LogoMark({
  size = 40,
  animated = false,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={animated ? 'logo-breathe' : undefined}
    >
      <circle cx="24" cy="24" r="21" stroke="var(--aqua)" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="24" cy="24" r="15" stroke="var(--aqua)" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="24" cy="24" r="9" stroke="var(--aqua)" strokeOpacity="0.7" strokeWidth="1.25" />
      <circle cx="24" cy="24" r="3.5" fill="var(--aqua)" />
    </svg>
  );
}

/** Mark plus wordmark, used in the header and footer. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="display text-[1.35rem] tracking-tight text-cream">
        Breath<span className="text-aqua">Wiz</span>
      </span>
    </span>
  );
}
