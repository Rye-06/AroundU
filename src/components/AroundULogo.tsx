import React from 'react';
import { cn } from '../lib/utils';

type AroundULogoProps = {
  className?: string;
  emblemClassName?: string;
  showTagline?: boolean;
  compact?: boolean;
};

export function AroundULogo({ className, emblemClassName, showTagline = true, compact = false }: AroundULogoProps) {
  return (
    <div className={cn('inline-flex items-center', compact ? 'gap-3' : 'gap-4', className)}>
      <AroundUEmblem className={emblemClassName} />
      <div className="min-w-0">
        <h1 className={cn('font-bold tracking-tight text-primary-700', compact ? 'text-xl leading-none' : 'text-3xl leading-none')}>
          AroundU
        </h1>
        {showTagline && (
          <p className={cn('text-ink-500 font-medium tracking-[0.01em]', compact ? 'text-[11px] mt-1' : 'text-sm mt-2')}>
            Connect. Real Time.
          </p>
        )}
      </div>
    </div>
  );
}

export function AroundUEmblem({ className }: { className?: string }) {
  const glowId = React.useId();

  return (
    <svg viewBox="0 0 180 180" className={cn('h-14 w-14 text-primary-500 drop-shadow-[0_8px_20px_rgba(123,151,128,0.28)]', className)} aria-hidden="true">
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(240,233,211,0.95)" />
          <stop offset="100%" stopColor="rgba(240,233,211,0)" />
        </radialGradient>
      </defs>

      <circle cx="90" cy="90" r="72" fill={`url(#${glowId})`} />

      <path d="M36 97A58 58 0 0 1 58 44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path d="M122 34A58 58 0 0 1 145 62" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path d="M145 118A58 58 0 0 1 116 147" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path d="M64 150A58 58 0 0 1 36 118" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />

      <line x1="90" y1="90" x2="57" y2="103" stroke="currentColor" strokeWidth="5" opacity="0.68" strokeLinecap="round" />
      <line x1="90" y1="90" x2="102" y2="58" stroke="currentColor" strokeWidth="5" opacity="0.68" strokeLinecap="round" />
      <line x1="90" y1="90" x2="124" y2="103" stroke="currentColor" strokeWidth="5" opacity="0.68" strokeLinecap="round" />
      <line x1="57" y1="103" x2="71" y2="62" stroke="currentColor" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
      <line x1="124" y1="103" x2="109" y2="126" stroke="currentColor" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
      <line x1="71" y1="62" x2="102" y2="58" stroke="currentColor" strokeWidth="4" opacity="0.45" strokeLinecap="round" />

      <circle cx="90" cy="90" r="13" fill="currentColor" opacity="0.72" />
      <circle cx="57" cy="103" r="8.5" fill="currentColor" opacity="0.68" />
      <circle cx="102" cy="58" r="8" fill="currentColor" opacity="0.62" />
      <circle cx="124" cy="103" r="7.5" fill="currentColor" opacity="0.6" />
      <circle cx="71" cy="62" r="6.5" fill="currentColor" opacity="0.5" />
      <circle cx="109" cy="126" r="6.5" fill="currentColor" opacity="0.5" />

      <g transform="translate(102 30)" opacity="0.7" fill="currentColor">
        <circle cx="0" cy="4" r="3" />
        <path d="M-6 17a6 6 0 0 1 12 0v2h-12z" />
      </g>

      <g transform="translate(130 66)" opacity="0.66" fill="currentColor">
        <path d="M0 0c4 0 7 3 7 7 0 5-7 12-7 12s-7-7-7-12c0-4 3-7 7-7z" />
        <circle cx="0" cy="7" r="2.8" fill="rgba(252,249,242,0.95)" />
      </g>

      <g transform="translate(50 130)" opacity="0.66" fill="currentColor">
        <path d="M0 0c4 0 7 3 7 7 0 5-7 12-7 12s-7-7-7-12c0-4 3-7 7-7z" />
        <circle cx="0" cy="7" r="2.8" fill="rgba(252,249,242,0.95)" />
      </g>

      <circle cx="23" cy="90" r="2.5" fill="#ebe3c8" opacity="0.75" />
      <circle cx="160" cy="86" r="2.5" fill="#ebe3c8" opacity="0.75" />
      <circle cx="90" cy="158" r="2.5" fill="#ebe3c8" opacity="0.75" />
    </svg>
  );
}
