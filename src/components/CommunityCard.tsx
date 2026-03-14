import { cn } from '../lib/utils';
import { ReactNode } from 'react';

export function CommunityCard({ title, desc, tags, members, color, icon }: { title: string, desc: string, tags: string[], members: number, color: 'indigo' | 'coral', icon: ReactNode }) {
  const bgColor = color === 'indigo' ? 'bg-primary-50/60' : 'bg-coral-50/60';
  const borderColor = color === 'indigo' ? 'border-primary-200' : 'border-coral-100';
  const iconColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';

  return (
    <div className={cn("p-6 rounded-3xl border", bgColor, borderColor)}>
      <div className="flex justify-between">
        <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <img 
              key={i}
              className="w-6 h-6 rounded-full ring-2 ring-white" 
              src={`https://picsum.photos/seed/member${i+members}/50/50`} 
              alt="member"
              referrerPolicy="no-referrer"
            />
          ))}
          <div className={cn("w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-medium ring-2 ring-white", color === 'indigo' ? 'bg-primary-200 text-primary-700' : 'bg-coral-100 text-coral-500')}>
            +{members}
          </div>
        </div>
      </div>
      <h4 className="mt-4 font-semibold text-ink-800">{title}</h4>
      <p className="text-sm text-ink-600 mt-1">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={cn("text-[10px] px-2 py-0.5 bg-white/70 rounded-full border uppercase tracking-wider font-medium", borderColor)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
