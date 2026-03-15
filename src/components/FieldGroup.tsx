import { ReactNode } from 'react';

export function FieldGroup({ label, required, hint, children }: { label: string, required?: boolean, hint?: string, children: ReactNode }) {
  return (
    <div>
      <label className="flex items-baseline gap-1 text-xs font-semibold text-ink-600 uppercase tracking-wider mb-2.5">
        {label}
        {required && <span className="text-coral-400">*</span>}
      </label>
      {hint && <p className="text-xs text-ink-400 -mt-1 mb-2.5">{hint}</p>}
      {children}
    </div>
  );
}
