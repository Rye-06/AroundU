import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOOD_OPTIONS, type MoodOption } from '../lib/profile';

type MoodCheckInModalProps = {
  open: boolean;
  onSkip: () => void;
  onSelectMood: (mood: MoodOption) => void;
};

export function MoodCheckInModal({ open, onSkip, onSelectMood }: MoodCheckInModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto w-full max-w-md -translate-y-1/2"
          >
            <div className="rounded-[2rem] border border-surface-100 bg-white p-6 shadow-xl shadow-ink-900/10">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Quick check-in</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink-900">How are you feeling right now?</h3>
                  <p className="mt-1 text-sm text-ink-500">This helps AroundU tune recommendations for this session.</p>
                </div>
                <button
                  type="button"
                  onClick={onSkip}
                  className="btn-tactile btn-tactile-soft rounded-xl p-2 text-ink-400 transition-colors hover:bg-surface-50 hover:text-ink-600"
                  aria-label="Skip mood check-in"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {MOOD_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSelectMood(option.value)}
                    className={cn(
                      'btn-tactile btn-tactile-soft flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm font-medium',
                      'border-surface-200 bg-surface-50 text-ink-700 hover:border-primary-200 hover:bg-primary-50/60',
                    )}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {option.glyph}
                    </span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onSkip}
                className="btn-tactile btn-tactile-soft mt-4 w-full cursor-pointer rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-surface-50 hover:text-ink-700"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
