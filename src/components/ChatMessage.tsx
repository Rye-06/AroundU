import { cn } from '../lib/utils';

export function ChatMessage({ name, time, content, avatar, isSelf }: { name: string, time: string, content: string, avatar: string, isSelf?: boolean }) {
  return (
    <div className={cn("flex items-start gap-4", isSelf ? "flex-row-reverse" : "max-w-2xl")}>
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full mt-1" referrerPolicy="no-referrer" />
      <div className={cn("space-y-1", isSelf && "items-end flex flex-col")}>
        <div className={cn("flex items-baseline gap-2", isSelf && "flex-row-reverse")}>
          <span className="text-sm font-semibold text-ink-700">{name}</span>
          <span className="text-[10px] text-ink-400">{time}</span>
        </div>
        <div className={cn(
          "p-4 rounded-2xl leading-relaxed text-sm shadow-sm",
          isSelf 
            ? "bg-primary-500 text-white rounded-tr-none max-w-lg" 
            : "bg-primary-50/50 text-ink-700 rounded-tl-none"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
}
