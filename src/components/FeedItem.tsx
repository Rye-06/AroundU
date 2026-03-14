import { ReactNode } from 'react';

export function FeedItem({ name, time, content, avatar, action }: { name: string, time: string, content: string, avatar: string, action: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-ink-800">{name}</span>
            <span className="text-xs text-ink-400">{time}</span>
          </div>
          <p className="mt-1 text-ink-600">{content}</p>
          <div className="mt-4">
            <button className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs border border-primary-100 hover:bg-primary-100 transition-colors font-medium">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
