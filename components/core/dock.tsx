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
  useMotionValueEvent,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type SpringOptions,
} from 'motion/react';
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
  /** Within this many pixels of the pointer, an item swaps its word for its icon. */
  labelHideDistance: number;
};

const DockContext = createContext<DockContextValue | null>(null);

function useDock() {
  const context = useContext(DockContext);
  if (!context) throw new Error('Dock parts must be used inside <Dock>');
  return context;
}

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
  labelHideDistance = 80,
}: {
  children: ReactNode;
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
  /** Row height. Reserve room for a magnified item so the bar never jumps. */
  panelSize?: number;
  labelHideDistance?: number;
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
        labelHideDistance,
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
   * When the item carries a visible word it sizes itself to its contents and
   * only the icon magnifies — driving the pill's width from the spring as well
   * would fight the word collapsing out of it.
   */
  sizeContainer?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const {
    mouseX,
    spring,
    magnification,
    distance,
    isStatic,
    labelHideDistance,
  } = useDock();

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

  // At rest every item is a word. Only the items the pointer comes close to
  // trade their word for the symbol and swell; the rest stay as they were, so
  // the bar never collapses all at once.
  const [isNear, setIsNear] = useState(false);
  useMotionValueEvent(distanceFromPointer, 'change', (value) => {
    const near = Math.abs(value) < labelHideDistance;
    // Only a crossing re-renders — the value itself changes on every pointer
    // move and must not.
    setIsNear((previous) => (previous === near ? previous : near));
  });

  const showLabel = isStatic || !isNear;

  return (
    <DockItemContext.Provider
      value={{ size, isHovered, baseSize, showLabel, isStatic }}
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
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
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
  baseSize: number;
  showLabel: boolean;
  isStatic: boolean;
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
  const { size, baseSize, isStatic } = useDockItem();
  const iconSize = useTransform(size, (value) => value * 0.42);

  return (
    <motion.div
      style={
        isStatic
          ? { width: baseSize * 0.42, height: baseSize * 0.42 }
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
 * A word that lives inline beside the symbol rather than as a tooltip above it.
 *
 * Present at rest, and given up only by the items the pointer comes close to.
 * The word's width animates to nothing behind a clip, so it reads as folding
 * into the symbol beside it — and because the width drives the pill's own
 * width, its neighbours slide over continuously instead of snapping when the
 * word is finally removed.
 *
 * It is hidden from assistive tech: the link already carries an aria-label, so
 * leaving the word in the tree would have it announced twice.
 */
export function DockText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { showLabel } = useDockItem();

  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={
        showLabel
          ? { opacity: 1, width: 'auto', marginLeft: 8 }
          : { opacity: 0, width: 0, marginLeft: 0 }
      }
      transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        // shrink-0 so the word keeps its full width: it is a flex child, and
        // letting it compress is what crushes the row into itself.
        'block shrink-0 overflow-hidden whitespace-nowrap',
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
