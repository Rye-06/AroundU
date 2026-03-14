import { ReactNode } from 'react';

export function FeedItem({ name, time, content, avatar, action }: { name: string, time: string, content: string, avatar: string, action: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-surface-100 shadow-sm shadow-surface-200/40 hover:shadow-surface-300/30 transition-shadow">
      <div className="flex space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full ring-2 ring-surface-50" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-ink-800">{name}</span>
            <span className="text-xs text-ink-400 font-medium">{time}</span>
          </div>
          <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{content}</p>
          <div className="mt-4">
            <button className="px-4 py-1.5 bg-surface-50 text-ink-600 rounded-full text-xs hover:bg-surface-100 transition-colors font-medium">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
