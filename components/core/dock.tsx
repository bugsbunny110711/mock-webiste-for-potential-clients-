'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type SpringOptions,
} from 'motion/react';
import { TextRoll } from '@/components/core/text-roll';
import { cn } from '@/lib/utils';

/**
 * Magnifying dock, after the macOS one.
 *
 * Each item measures how far its centre is from the pointer and maps that
 * distance to a size, so the icons swell as the pointer passes. With the
 * pointer away the distance is Infinity, which maps to the base size, so the
 * row rests flat.
 */

type DockContextValue = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  isStatic: boolean;
};

const DockContext = createContext<DockContextValue | null>(null);

function useDock() {
  const context = useContext(DockContext);
  if (!context) throw new Error('Dock parts must be used inside <Dock>');
  return context;
}

/**
 * The word's roll and the symbol's glide are one sequence, so their timings are
 * shared rather than tuned in two places.
 *
 * Pointing at an option: the word rolls away, and only once it has gone does
 * the symbol glide to the middle of the pill. Leaving reverses it — the symbol
 * returns to its slot first, because a word rolling back underneath a symbol
 * still sitting in the centre would land on top of it.
 */
const ROLL_DURATION = 0.28;
const ROLL_STAGGER = 0.022;
const ICON_TRAVEL = 0.26;
/** Matches the `ml-2` DockText sets between the symbol and the word. */
const LABEL_GAP = 8;

const DEFAULT_SPRING: SpringOptions = {
  mass: 0.1,
  stiffness: 150,
  damping: 12,
};

export function Dock({
  children,
  className,
  spring = DEFAULT_SPRING,
  magnification = 62,
  distance = 130,
  panelSize = 64,
}: {
  children: ReactNode;
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
  /** Row height. Reserve room for a magnified item so the bar never jumps. */
  panelSize?: number;
}) {
  const mouseX = useMotionValue(Infinity);
  const shouldReduceMotion = useReducedMotion();

  return (
    <DockContext.Provider
      value={{
        mouseX,
        spring,
        magnification,
        distance,
        // Magnification is pointer-driven and decorative; with reduced motion
        // the dock stays a plain row of fixed-size items that keep their words.
        isStatic: Boolean(shouldReduceMotion),
      }}
    >
      <motion.div
        onPointerMove={(event) => {
          // Only a real pointer drives the magnification; a tap should not
          // leave one icon stuck at full size.
          if (event.pointerType === 'mouse') mouseX.set(event.pageX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
        style={{ height: panelSize }}
        role='toolbar'
        aria-label='Site navigation'
        className={cn('flex shrink-0 items-center', className)}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockItem({
  children,
  className,
  baseSize = 46,
  sizeContainer = true,
}: {
  children: ReactNode;
  className?: string;
  baseSize?: number;
  /**
   * Whether this item magnifies with the pointer's distance.
   *
   * Only the symbols-only dock does. A labelled item holds a fixed box: its
   * width is set by its word, and letting the pointer drive that width is what
   * shoves every other option along the bar as the pointer travels.
   */
  sizeContainer?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const { mouseX, spring, magnification, distance, isStatic } = useDock();

  // How far the symbol must travel to reach the middle of the pill, and how
  // long this particular word takes to roll away.
  //
  // Measured when the pointer arrives rather than on mount: by then the display
  // face has certainly loaded, so the width is the one actually on screen. An
  // event handler is also the one place this can be read without an effect.
  const [lockup, setLockup] = useState({
    shift: 0,
    rollOut: ROLL_DURATION,
  });

  const measureLockup = () => {
    const label = ref.current?.querySelector<HTMLElement>('[data-dock-label]');
    if (!label) return;
    const characters = label.textContent?.length ?? 0;
    // The symbol sits left of the word in a group centred in the pill, so
    // centring it means moving it half the space the word and its gap take up.
    const shift = (label.offsetWidth + LABEL_GAP) / 2;
    const rollOut = ROLL_DURATION + ROLL_STAGGER * Math.max(0, characters - 1);
    setLockup((previous) =>
      previous.shift === shift && previous.rollOut === rollOut
        ? previous
        : { shift, rollOut },
    );
  };

  const distanceFromPointer = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseSize,
    };
    return value - bounds.x - bounds.width / 2;
  });

  const targetSize = useTransform(
    distanceFromPointer,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const size = useSpring(targetSize, spring);

  // The word rolls away for the pointer only. Focus deliberately does not do
  // it: a keyboard user arriving on an item needs to read its name, not watch
  // it leave.
  const magnifies = sizeContainer && !isStatic;
  const isRolled = isPointerOver && !isStatic;

  return (
    <DockItemContext.Provider
      value={{
        size,
        isHovered: isPointerOver || isFocused,
        isRolled,
        baseSize,
        isStatic,
        magnifies,
        labelShift: lockup.shift,
        rollOut: lockup.rollOut,
      }}
    >
      <motion.div
        ref={ref}
        style={
          // 'auto' is spelt out rather than left undefined: the first render
          // happens before the media query resolves, so this item may already
          // carry an inline width from the symbols-only mode, and dropping the
          // style prop would leave that stale pixel value in place.
          !sizeContainer
            ? { width: 'auto', height: 'auto' }
            : isStatic
              ? { width: baseSize, height: baseSize }
              : { width: size, height: size }
        }
        onHoverStart={() => {
          measureLockup();
          setIsPointerOver(true);
        }}
        onHoverEnd={() => setIsPointerOver(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'relative flex shrink-0 items-center justify-center',
          className,
        )}
      >
        {children}
      </motion.div>
    </DockItemContext.Provider>
  );
}

const DockItemContext = createContext<{
  size: MotionValue<number>;
  isHovered: boolean;
  isRolled: boolean;
  baseSize: number;
  isStatic: boolean;
  magnifies: boolean;
  /** Pixels right the symbol travels to reach the middle once the word is gone. */
  labelShift: number;
  /** How long this item's word takes to roll away, start to last character. */
  rollOut: number;
} | null>(null);

function useDockItem() {
  const context = useContext(DockItemContext);
  if (!context)
    throw new Error('DockIcon and DockLabel belong inside <DockItem>');
  return context;
}

export function DockIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { size, baseSize, isStatic, magnifies, isRolled, labelShift, rollOut } =
    useDockItem();
  const iconSize = useTransform(size, (value) => value * 0.42);
  const restSize = baseSize * 0.42;

  // Where the item does not magnify, the symbol holds a fixed box and both
  // grows and travels by transform. Transforms cost no layout, so the symbol
  // can swell and cross to the middle of its pill without changing that pill's
  // width or nudging the options either side.
  if (!magnifies) {
    // Going: wait for the word to finish rolling away. Returning: leave at
    // once, so the slot is clear before the word rolls back into it.
    const delay = isRolled ? rollOut : 0;
    return (
      <motion.div
        style={{ width: restSize, height: restSize }}
        animate={{ scale: isRolled ? 1.3 : 1, x: isRolled ? labelShift : 0 }}
        transition={{
          scale: { type: 'spring', stiffness: 420, damping: 26, delay },
          x: { duration: ICON_TRAVEL, ease: [0.22, 0.61, 0.36, 1], delay },
        }}
        className={cn('flex shrink-0 items-center justify-center', className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      style={
        isStatic
          ? { width: restSize, height: restSize }
          : { width: iconSize, height: iconSize }
      }
      className={cn('flex shrink-0 items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export function DockLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isHovered } = useDockItem();

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          role='tooltip'
          className={cn(
            'absolute top-full left-1/2 mt-2 w-fit -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-canvas',
            className,
          )}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * The word beside the symbol, which rolls away while the pointer is on this
 * item and rolls back when it leaves.
 *
 * It rolls in place. A rotated character still occupies its layout width, so
 * the item keeps exactly the width it had and nothing else on the bar moves —
 * the symbol simply becomes the only thing left showing.
 *
 * The stagger is much tighter than TextRoll's default: at a tenth of a second
 * per character 'Retreats' would take four fifths of a second to leave, which
 * is far too slow to sit under a moving pointer.
 */
export function DockText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const { isRolled } = useDockItem();

  return (
    <span
      data-dock-label
      className={cn('ml-2 inline-flex whitespace-nowrap', className)}
    >
      <TextRoll
        rolled={isRolled}
        srOnlyHidden
        duration={ROLL_DURATION}
        // Away immediately; back only once the symbol has returned to its slot.
        getExitDelay={(index) => index * ROLL_STAGGER}
        getEnterDelay={(index) => ICON_TRAVEL + index * ROLL_STAGGER}
        transition={{ ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </TextRoll>
    </span>
  );
}
