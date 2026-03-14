import { ReactNode } from 'react';

export function FeedItem({ name, time, content, avatar, action }: { name: string, time: string, content: string, avatar: string, action: string }) {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-surface-100 shadow-sm shadow-surface-200/40 hover:shadow-[0_8px_30px_rgba(112,147,136,0.12)] hover:-translate-y-0.5 transition-all duration-500">
      <div className="flex space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full ring-2 ring-surface-50 group-hover:ring-primary-200 group-hover:shadow-[0_0_20px_rgba(112,147,136,0.3)] transition-all duration-500" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-ink-800">{name}</span>
            <span className="text-xs text-ink-400 font-medium">{time}</span>
          </div>
          <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{content}</p>
          <div className="mt-4">
            <button className="px-5 py-2 bg-surface-50 text-ink-600 rounded-full text-xs hover:bg-primary-50 hover:text-primary-700 hover:shadow-[0_0_15px_rgba(112,147,136,0.3)] transition-all duration-300 font-medium">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
