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
        onHoverStart={() => setIsPointerOver(true)}
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
  const { size, baseSize, isStatic, magnifies, isRolled } = useDockItem();
  const iconSize = useTransform(size, (value) => value * 0.42);
  const restSize = baseSize * 0.42;

  // Where the item does not magnify, the symbol holds a fixed box and grows by
  // transform instead. A transform costs no layout, so the hovered symbol can
  // swell without nudging the word beside it or the options either side.
  if (!magnifies) {
    return (
      <motion.div
        style={{ width: restSize, height: restSize }}
        animate={{ scale: isRolled ? 1.3 : 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
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
    <TextRoll
      rolled={isRolled}
      srOnlyHidden
      duration={0.28}
      getEnterDelay={(index) => index * 0.022}
      getExitDelay={(index) => index * 0.022}
      transition={{ ease: [0.22, 0.61, 0.36, 1] }}
      className={cn('ml-2 whitespace-nowrap', className)}
    >
      {children}
    </TextRoll>
  );
}
