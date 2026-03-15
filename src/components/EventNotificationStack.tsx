import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { cn } from '../lib/utils';

export type EventToast = {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
  interestTag?: string;
  ctaLabel?: string;
  durationMs?: number;
};

type EventNotificationStackProps = {
  notifications: EventToast[];
  onDismiss: (id: string) => void;
  onOpen: (id: string) => void;
};

const DEFAULT_DURATION_MS = 5000;

export function EventNotificationStack({ notifications, onDismiss, onOpen }: EventNotificationStackProps) {
  return (
    <div className="pointer-events-none fixed z-[70] top-4 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] sm:left-auto sm:right-4 sm:translate-x-0 sm:w-[360px]">
      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => (
            <EventNotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={onDismiss}
              onOpen={onOpen}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EventNotificationCard({
  notification,
  onDismiss,
  onOpen,
}: {
  notification: EventToast;
  onDismiss: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef(notification.durationMs ?? DEFAULT_DURATION_MS);
  const [isPaused, setIsPaused] = useState(false);

  const descriptor = useMemo(() => {
    if (notification.interestTag) {
      return notification.interestTag;
    }
    if (notification.location) {
      return notification.location;
    }
    return 'New campus activity';
  }, [notification.interestTag, notification.location]);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleDismiss = () => {
    clearTimer();
    startTimeRef.current = Date.now();
    timeoutRef.current = window.setTimeout(() => {
      onDismiss(notification.id);
    }, remainingRef.current);
  };

  useEffect(() => {
    scheduleDismiss();
    return clearTimer;
  }, []);

  const handlePause = () => {
    if (isPaused) return;
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(500, remainingRef.current - elapsed);
    clearTimer();
  };

  const handleResume = () => {
    if (!isPaused) return;
    setIsPaused(false);
    scheduleDismiss();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className={cn(
        'pointer-events-auto rounded-2xl border border-surface-200/90 bg-white/95 backdrop-blur-md',
        'shadow-[0_8px_30px_rgba(41,48,48,0.08)]'
      )}
    >
      <div className="flex items-start gap-3 p-3.5">
        <button
          onClick={() => onOpen(notification.id)}
          className="min-w-0 flex-1 text-left rounded-xl px-1 py-0.5 transition-colors hover:bg-surface-50"
        >
          <p className="text-sm font-semibold text-ink-800 truncate">{notification.title}</p>
          <p className="mt-0.5 text-xs text-ink-500 line-clamp-1">{notification.subtitle}</p>

          <div className="mt-2 flex items-center gap-2">
            {notification.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                <MapPin className="h-3 w-3 text-primary-500" />
                <span className="truncate max-w-[180px]">{notification.location}</span>
              </span>
            )}
            {!notification.location && (
              <span className="inline-flex items-center rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-ink-600">
                {descriptor}
              </span>
            )}

            <span className="text-[11px] font-semibold text-primary-600 ml-auto">
              {notification.ctaLabel ?? 'Open'}
            </span>
          </div>
        </button>

        <button
          onClick={() => onDismiss(notification.id)}
          aria-label="Dismiss notification"
          className="mt-0.5 h-7 w-7 shrink-0 rounded-full border border-surface-200 bg-white text-ink-400 transition-colors hover:text-ink-700 hover:border-surface-300"
        >
          <X className="mx-auto h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
