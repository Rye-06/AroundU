import { cn } from '../lib/utils';

export function NearbyEvent({ status, title, location, color }: { status: string, title: string, location: string, color: 'indigo' | 'coral' }) {
  const dotColor = color === 'indigo' ? 'bg-primary-500' : 'bg-coral-400';
  const textColor = color === 'indigo' ? 'text-primary-600' : 'text-coral-500';

  return (
    <div className="group bg-white p-5 rounded-3xl border border-surface-100 hover:border-surface-200 shadow-sm shadow-surface-200/30 transition-colors cursor-pointer">
      <div className="flex items-center space-x-2.5">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", textColor)}>{status}</span>
      </div>
      <p className="mt-2 text-ink-800 font-medium">{title}</p>
      <p className="text-xs text-ink-500 mt-1">{location}</p>
    </div>
  );
}
