'use client';

import { useEffect } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  type SpringOptions,
} from 'motion/react';
import { cn } from '@/lib/utils';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  /**
   * How the rounded number is written. Defaults to en-GB grouping, which is
   * stated rather than left to the runtime's locale: the server and the
   * browser can disagree about a thousands separator, and React treats that
   * as a hydration mismatch.
   */
  format?: (value: number) => string;
};

const defaultFormat = (value: number) => value.toLocaleString('en-GB');

/**
 * A number that springs from whatever it last was to whatever it is given.
 *
 * The animation is driven by the `value` prop changing, not by anything inside
 * — the spring is initialised at the first value it sees, so a component that
 * mounts already holding its target simply shows it. A caller that wants a
 * count-up passes 0 first and the real figure second.
 *
 * `tabular-nums` is not decoration: proportional digits are different widths,
 * so a number counting up through them jitters sideways the whole way.
 *
 * It renders a span and takes no `as`. Building the motion component from a
 * prop means creating a component during render, which remounts the element
 * every time that prop changes and is what the static-components rule is
 * there to catch. Anything needing a different element can wrap this one.
 */
export function AnimatedNumber({
  value,
  className,
  springOptions,
  format = defaultFormat,
}: AnimatedNumberProps) {
  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    // A motion value setter, not setState — this re-renders nothing.
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn('tabular-nums', className)}>
      {display}
    </motion.span>
  );
}
