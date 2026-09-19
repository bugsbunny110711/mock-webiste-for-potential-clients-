'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { brand } from '@/config/brand';

/** Staggered reveal — each element follows the one before it. */
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.32, 0.72, 0, 1] as const, delay: 0.15 + i * 0.11 },
  }),
};

/** Fictional proof points. All editable from the admin panel later. */
const STATS = [
  { value: '2,400+', label: 'Sessions guided' },
  { value: '4.9', label: 'Average rating' },
  { value: '11', label: 'Years practising' },
];

export function Hero({ ready = true }: { ready?: boolean }) {
  const animate = ready ? 'show' : 'hidden';

  return (
    <section className="relative flex min-h-[100svh] items-center px-4 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ── Left: the message ── */}
          <div>
            <motion.div
              custom={0}
              variants={rise}
              initial="hidden"
              animate={animate}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/12 px-4 py-1.5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              <span className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-mist">
                Next live workshop · 12 October
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={rise}
              initial="hidden"
              animate={animate}
              className="display text-[clamp(2.75rem,7.5vw,5.25rem)] text-cream"
            >
              Breathe with
              <br />
              <span className="italic text-aqua">intention.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={rise}
              initial="hidden"
              animate={animate}
              className="mt-6 max-w-lg font-body text-[0.975rem] leading-relaxed text-mist sm:text-lg"
            >
              Guided breathwork with {brand.coach.name} — live workshops, structured
              courses and one-to-one sessions. Start with the free breathing tool,
              no sign-up needed.
            </motion.p>

            <motion.div
              custom={3}
              variants={rise}
              initial="hidden"
              animate={animate}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/breathe"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-aqua px-8 py-4 font-body text-[0.95rem] font-medium text-ink transition-all duration-400 ease-breath hover:shadow-[0_0_44px_-8px_var(--aqua)]"
              >
                Try the free breathing tool
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 font-body text-[0.95rem] text-cream transition-all duration-400 hover:border-aqua/45 hover:bg-white/[0.04]"
              >
                See courses
              </Link>
            </motion.div>

            <motion.dl
              custom={4}
              variants={rise}
              initial="hidden"
              animate={animate}
              className="mt-10 flex gap-7 border-t border-white/8 pt-6 sm:gap-10 sm:pt-7"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="display block text-2xl text-cream sm:text-3xl">{s.value}</span>
                    <span className="mt-1 block whitespace-nowrap font-body text-[0.7rem] text-mist sm:text-[0.78rem]">{s.label}</span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* ── Right: the breathing orb ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
            className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center sm:max-w-sm lg:max-w-md"
          >
            {/* Expanding rings, each offset so they read as a breath cycle. */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-aqua/18"
                style={{ width: `${52 + i * 18}%`, height: `${52 + i * 18}%` }}
                animate={{ scale: [1, 1.09, 1], opacity: [0.35, 0.75, 0.35] }}
                transition={{
                  duration: 7,
                  ease: [0.37, 0, 0.63, 1],
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}

            {/* The core: a glass disc with a soft aqua centre. */}
            <motion.div
              className="glass relative flex aspect-square w-[46%] items-center justify-center rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 7, ease: [0.37, 0, 0.63, 1], repeat: Infinity }}
            >
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--aqua) 45%, transparent) 0%, transparent 65%)',
                }}
              />
              <span className="relative font-body text-[0.68rem] uppercase tracking-[0.3em] text-cream/85">
                Inhale
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
