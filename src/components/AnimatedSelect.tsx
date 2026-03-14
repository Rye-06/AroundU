import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export type AnimatedSelectOption = {
  value: string;
  label: string;
  hint?: string;
};

type AnimatedSelectProps = {
  value: string;
  options: AnimatedSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
};

export function AnimatedSelect({
  value,
  options,
  onChange,
  placeholder = 'Select',
  disabled = false,
  className,
  menuClassName,
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(() => options.find(option => option.value === value), [options, value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen(prev => !prev);
        }}
        className={cn(
          'btn-tactile btn-tactile-soft flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm',
          'border-surface-200 bg-surface-50 text-ink-700',
          'focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:border-primary-300',
          disabled && 'cursor-not-allowed opacity-55',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(!selectedOption && 'text-ink-400')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-ink-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-surface-200 bg-white p-1.5 shadow-[0_14px_30px_rgba(80,92,76,0.16)]',
              menuClassName,
            )}
          >
            {options.map(option => {
              const isActive = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'btn-tactile block w-full rounded-xl px-3 py-2.5 text-left transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-600 hover:bg-surface-50 hover:text-ink-800',
                  )}
                  role="option"
                  aria-selected={isActive}
                >
                  <p className="text-sm font-medium">{option.label}</p>
                  {option.hint && <p className="mt-0.5 text-xs text-ink-400">{option.hint}</p>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
