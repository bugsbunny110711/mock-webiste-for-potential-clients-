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
import { cn } from '@/lib/utils';

/**
 * Magnifying dock, after the macOS one.
 *
 * Each item measures how far its centre is from the pointer and maps that
 * distance to a width, so the icons swell as the pointer passes. With the
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
  panelSize = 46,
}: {
  children: ReactNode;
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
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
        // the dock stays a plain row of fixed-size icons.
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
        style={{ height: panelSize + 18 }}
        role='toolbar'
        aria-label='Site navigation'
        className={cn('flex items-end', className)}
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
}: {
  children: ReactNode;
  className?: string;
  baseSize?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <DockItemContext.Provider value={{ size, isHovered, baseSize }}>
      <motion.div
        ref={ref}
        style={isStatic ? { width: baseSize, height: baseSize } : { width: size, height: size }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn('relative flex items-center justify-center', className)}
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
} | null>(null);

function useDockItem() {
  const context = useContext(DockItemContext);
  if (!context) throw new Error('DockIcon and DockLabel belong inside <DockItem>');
  return context;
}

export function DockIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { size } = useDockItem();
  const iconSize = useTransform(size, (value) => value * 0.42);

  return (
    <motion.div
      style={{ width: iconSize, height: iconSize }}
      className={cn('flex items-center justify-center', className)}
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18 }}
          role='tooltip'
          className={cn(
            'absolute -top-9 left-1/2 w-fit -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-canvas',
            className,
          )}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
