import { cn } from '../lib/utils';

export function ChatListItem({ name, time, status, active, online, avatar }: { name: string, time: string, status: string, active?: boolean, online?: boolean, avatar: string }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all mb-2",
      active ? "bg-white shadow-sm border border-surface-200" : "hover:bg-surface-100"
    )}>
      <div className="relative">
        <img src={avatar} alt={name} className={cn("w-10 h-10 rounded-full", !online && "grayscale")} referrerPolicy="no-referrer" />
        {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-[10px] text-ink-400">{time}</span>
        </div>
        <p className={cn("text-xs text-ink-400 truncate", active && "italic")}>"{status}"</p>
      </div>
    </div>
  );
}
