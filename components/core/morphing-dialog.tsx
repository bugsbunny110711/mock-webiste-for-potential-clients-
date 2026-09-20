'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useIsMounted } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type MorphingDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  layoutId: string;
};

const MorphingDialogContext = createContext<MorphingDialogContextValue | null>(
  null,
);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error('MorphingDialog components must be used within <MorphingDialog>');
  }
  return context;
}

export function MorphingDialog({
  children,
  onOpenChange,
}: {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Unique per instance: several booking buttons on one page must not share a
  // layoutId, or the morph animates from the wrong element (DESIGN.md §4).
  const layoutId = useId();

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <MorphingDialogContext.Provider value={{ isOpen, open, close, layoutId }}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, layoutId, isOpen } = useMorphingDialog();

  return (
    <motion.button
      type='button'
      layoutId={`morph-trigger-${layoutId}`}
      onClick={open}
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      className={cn(className)}
      style={{ borderRadius: 999 }}
    >
      {children}
    </motion.button>
  );
}

export function MorphingDialogContent({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  const { isOpen, close, layoutId } = useMorphingDialog();
  const isMounted = useIsMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, close]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className='absolute inset-0 bg-ink/25 backdrop-blur-[2px]'
          />
          <motion.div
            ref={panelRef}
            role='dialog'
            aria-modal='true'
            aria-label={title}
            layoutId={shouldReduceMotion ? undefined : `morph-trigger-${layoutId}`}
            initial={shouldReduceMotion ? { opacity: 0 } : undefined}
            animate={shouldReduceMotion ? { opacity: 1 } : undefined}
            exit={shouldReduceMotion ? { opacity: 0 } : undefined}
            style={{ borderRadius: 14 }}
            className={cn(
              'relative z-10 max-h-[90vh] w-full overflow-y-auto bg-surface p-6',
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function MorphingDialogClose({ className }: { className?: string }) {
  const { close } = useMorphingDialog();
  return (
    <button
      type='button'
      onClick={close}
      aria-label='Close'
      className={cn(
        'absolute right-4 top-4 grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-band/60',
        className,
      )}
    >
      <svg viewBox='0 0 16 16' className='size-4' aria-hidden>
        <path
          d='M3 3l10 10M13 3L3 13'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    </button>
  );
}
