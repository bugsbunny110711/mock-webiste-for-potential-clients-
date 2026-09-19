'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogoMark } from './Logo';
import { brand } from '@/config/brand';

/** How long the cover stays up, in milliseconds. */
const DURATION = 3000;
/** sessionStorage key — the cover plays once per browser tab visit. */
const SEEN_KEY = 'breathwiz:intro-seen';

/**
 * The opening cover.
 *
 * Holds the page behind a full-screen panel while fonts genuinely load,
 * shows the mark breathing outward with a progress count, then parts
 * down the middle to reveal the hero.
 *
 * Skippable, plays once per visit, and collapses to a plain fade for
 * anyone who has asked for reduced motion.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  // `null` = still deciding (avoids a flash of the cover on repeat visits).
  const [visible, setVisible] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);

  // Decide whether to play at all — only after mount, so server and
  // client render the same thing and hydration stays clean.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Private mode or blocked storage: just play the cover.
    }
    if (seen) {
      setVisible(false);
      onDone?.();
    } else {
      setVisible(true);
    }
  }, [onDone]);

  const dismiss = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* non-fatal */
    }
    setVisible(false);
    onDone?.();
  }).current;

  // Drive the progress count off real font loading, not a fake timer:
  // the bar reaches 100% only once the fonts are actually ready.
  useEffect(() => {
    if (visible !== true) return;

    const started = Date.now();
    let fontsReady = false;

    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const tick = setInterval(() => {
      const elapsed = Date.now() - started;
      // Ease toward 90% on time, then let font-readiness carry it home.
      const timed = Math.min(90, (elapsed / DURATION) * 100);
      setProgress(fontsReady ? Math.min(100, Math.max(timed, 92)) : timed);
    }, 50);

    const done = setTimeout(dismiss, DURATION);

    // Escape also skips, for keyboard users.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
      window.removeEventListener('keydown', onKey);
    };
  }, [visible, dismiss]);

  // Lock scrolling while the cover is up.
  useEffect(() => {
    if (visible === true) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [visible]);

  if (visible !== true) return null;

  // Reduced motion: no orb, no split — just a calm fade out.
  if (reduce) {
    return (
      <AnimatePresence>
        <motion.div
          key="cover-reduced"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-abyss"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-5">
            <LogoMark size={64} />
            <span className="display text-3xl text-cream">{brand.name}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="cover"
        className="fixed inset-0 z-[90]"
        role="status"
        aria-label="Loading"
        exit={{ pointerEvents: 'none' }}
      >
        {/* Two halves that part vertically to reveal the page. */}
        {(['top', 'bottom'] as const).map((half) => (
          <motion.div
            key={half}
            className="absolute left-0 h-1/2 w-full bg-abyss"
            style={{ [half]: 0 }}
            exit={{ y: half === 'top' ? '-100%' : '100%' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}

        {/* Centre content fades and lifts away just before the split. */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-8"
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: 'easeIn' }}
        >
          {/* The breathing orb: a soft glow that swells like an inhale. */}
          <div className="relative flex h-44 w-44 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--aqua) 28%, transparent) 0%, transparent 68%)',
              }}
              animate={{ scale: [0.72, 1.12, 0.72], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.4, ease: [0.37, 0, 0.63, 1], repeat: Infinity }}
            />
            <motion.div
              animate={{ scale: [0.94, 1.06, 0.94] }}
              transition={{ duration: 3.4, ease: [0.37, 0, 0.63, 1], repeat: Infinity }}
            >
              <LogoMark size={76} />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <motion.span
              className="display text-4xl tracking-tight text-cream sm:text-5xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Breath<span className="text-aqua">Wiz</span>
            </motion.span>

            {/* Progress: a hairline that fills, plus a quiet count. */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-px w-40 overflow-hidden bg-white/12">
                <motion.div
                  className="h-full bg-aqua"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <span className="font-body text-[0.7rem] uppercase tracking-[0.3em] text-mist tabular-nums">
                {Math.round(progress)}
              </span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={dismiss}
          className="absolute bottom-8 right-8 rounded-full border border-white/15 px-5 py-2 font-body text-xs uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:border-aqua/50 hover:text-cream"
        >
          Skip
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
