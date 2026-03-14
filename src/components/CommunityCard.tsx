import { cn } from '../lib/utils';
import { ReactNode } from 'react';

export function CommunityCard({ title, desc, tags, members, color, icon }: { title: string, desc: string, tags: string[], members: number, color: 'indigo' | 'coral', icon: ReactNode }) {
  const bgColor = color === 'indigo' ? 'bg-primary-50' : 'bg-coral-50';
  const borderColor = color === 'indigo' ? 'border-primary-100' : 'border-coral-100';
  const iconColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';
  const hoverShadow = color === 'indigo' ? 'hover:shadow-[0_15px_40px_rgba(112,147,136,0.2)]' : 'hover:shadow-[0_15px_40px_rgba(139,128,182,0.2)]';
  const iconGlow = color === 'indigo' ? 'group-hover:shadow-[0_0_20px_rgba(112,147,136,0.3)]' : 'group-hover:shadow-[0_0_20px_rgba(139,128,182,0.3)]';

  return (
    <div className={cn("group p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer hover:-translate-y-1", bgColor, borderColor, hoverShadow)}>
      <div className="flex justify-between items-start">
        <div className={cn("p-3 bg-white/60 backdrop-blur-sm rounded-2xl w-fit transition-shadow duration-500", iconGlow)}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <img 
              key={i}
              className="w-7 h-7 rounded-full ring-2 ring-white/50" 
              src={`https://picsum.photos/seed/member${i+members}/50/50`} 
              alt="member"
              referrerPolicy="no-referrer"
            />
          ))}
          <div className={cn("w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-medium ring-2 ring-white/50", color === 'indigo' ? 'bg-primary-100 text-primary-600' : 'bg-coral-100 text-coral-600')}>
            +{members}
          </div>
        </div>
      </div>
      <h4 className="mt-5 font-semibold text-ink-800 text-lg">{title}</h4>
      <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{desc}</p>
      
      {/* Constellation-style separator for interests */}
      <div className="mt-5 pt-4 border-t border-dashed border-surface-200/60 relative">
        <div className="absolute -top-1 left-2 w-2 h-2 rounded-full bg-surface-100 border border-surface-300/30" />
        <div className="flex flex-wrap items-center gap-2">
          {/* Subtle connection line before tags */}
          <div className="w-3 h-[1px] bg-primary-300/40" />
          {tags.map((tag, index) => (
            <div key={tag} className="flex items-center gap-2">
              <span className={cn("text-[11px] px-2.5 py-1 bg-white/50 rounded-lg text-ink-600 font-medium")}>
                {tag}
              </span>
              {/* Draw tiny faint connection line between tags except the last one */}
              {index < tags.length - 1 && (
                <div className="w-2 h-[1px] bg-primary-300/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
