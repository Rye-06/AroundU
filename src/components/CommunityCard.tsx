import { cn } from '../lib/utils';
import { ReactNode } from 'react';

export function CommunityCard({ title, desc, tags, members, color, icon }: { title: string, desc: string, tags: string[], members: number, color: 'indigo' | 'coral', icon: ReactNode }) {
  const bgColor = color === 'indigo' ? 'bg-primary-50' : 'bg-coral-50';
  const borderColor = color === 'indigo' ? 'border-primary-100' : 'border-coral-100';
  const iconColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';

  return (
    <div className={cn("p-6 rounded-[2.5rem] border", bgColor, borderColor)}>
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl w-fit">
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
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={cn("text-[11px] px-2.5 py-1 bg-white/50 rounded-lg text-ink-600 font-medium")}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
