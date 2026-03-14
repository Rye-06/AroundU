import { cn } from '../lib/utils';

export function NearbyEvent({ status, title, location, color }: { status: string, title: string, location: string, color: 'indigo' | 'coral' }) {
  const dotColor = color === 'indigo' ? 'bg-primary-500' : 'bg-coral-400';
  const textColor = color === 'indigo' ? 'text-primary-600' : 'text-coral-500';
  const hoverShadow = color === 'indigo' ? 'hover:shadow-[0_8px_30px_rgba(112,147,136,0.15)] group-hover:border-primary-200' : 'hover:shadow-[0_8px_30px_rgba(139,128,182,0.15)] group-hover:border-coral-200';
  const dotGlow = color === 'indigo' ? 'group-hover:shadow-[0_0_12px_rgba(112,147,136,0.6)]' : 'group-hover:shadow-[0_0_12px_rgba(139,128,182,0.6)]';

  return (
    <div className={cn("group bg-white p-5 rounded-3xl border border-surface-100 shadow-sm shadow-surface-200/30 transition-all duration-500 cursor-pointer hover:-translate-y-0.5", hoverShadow)}>
      <div className="flex space-x-3">
        {/* Constellation Node + Line */}
        <div className="flex flex-col items-center mt-1.5">
          <div className={cn("w-2 h-2 rounded-full transition-shadow duration-300 relative z-10", dotColor, dotGlow)} />
          <div className="w-[1px] h-full bg-gradient-to-b from-surface-200 to-transparent mt-1" />
        </div>
        
        <div className="flex-1 pb-1">
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", textColor)}>{status}</span>
          <p className="mt-1 text-ink-800 font-medium group-hover:text-ink-900 transition-colors">{title}</p>
          <p className="text-xs text-ink-500 mt-1.5">{location}</p>
        </div>
      </div>
    </div>
  );
}
