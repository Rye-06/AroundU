import { cn } from '../lib/utils';

export function NearbyEvent({ status, title, location, color }: { status: string, title: string, location: string, color: 'indigo' | 'coral' }) {
  const dotColor = color === 'indigo' ? 'bg-primary-500' : 'bg-coral-500';
  const textColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';

  return (
    <div className="group bg-white p-4 rounded-2xl border border-surface-200 hover:border-primary-200 transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <span className={cn("text-xs font-bold uppercase tracking-widest", textColor)}>{status}</span>
      </div>
      <p className="mt-2 text-ink-800 font-semibold">{title}</p>
      <p className="text-xs text-ink-500 mt-1">{location}</p>
    </div>
  );
}
