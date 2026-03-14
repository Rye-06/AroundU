import { motion } from 'framer-motion';
import { Search, Settings, BookOpen, Dumbbell, Bell, MoreVertical, Plus, Smile, Check, FileText } from 'lucide-react';
import { ChatListItem } from '../components/ChatListItem';
import { ChatMessage } from '../components/ChatMessage';

export function MessagesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex overflow-hidden text-ink-700"
    >
      <aside className="w-80 bg-surface-50 border-r border-surface-200 flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-ink-800">Messages</h1>
          <p className="text-xs text-ink-400 mt-1">Stay connected</p>
          <div className="mt-6">
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-white border border-surface-200 rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary-200 transition-all placeholder-ink-400 shadow-sm" 
                placeholder="Search conversations..."
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-ink-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
          <div className="mb-4">
            <h3 className="px-3 text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">Direct Messages</h3>
            <ChatListItem 
              name="Mia Thompson" 
              time="12m" 
              status="Open to a quick chat" 
              active 
              online 
              avatar="https://picsum.photos/seed/mia/100/100" 
            />
            <ChatListItem 
              name="Alex Chen" 
              time="2h" 
              status="Reading in the sun ☀️" 
              avatar="https://picsum.photos/seed/alexc/100/100" 
            />
            <ChatListItem 
              name="Jordan Riley" 
              time="5h" 
              status="Looking for coffee?" 
              avatar="https://picsum.photos/seed/jordanr/100/100" 
            />
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">Groups</h3>
            <div className="flex items-center gap-3 p-3 hover:bg-surface-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ink-700">Book Club</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-surface-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center text-coral-500">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ink-700">Campus Runners</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-surface-200 flex items-center gap-3">
          <img src="https://picsum.photos/seed/sam/100/100" alt="Sam" className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Sam Wilson</div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
            </div>
          </div>
          <button className="text-ink-400 hover:text-ink-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-white flex flex-col relative">
        <header className="h-16 border-b border-surface-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2].map(i => (
                <img 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src={`https://picsum.photos/seed/book${i}/50/50`} 
                  alt="member"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-100 flex items-center justify-center text-[10px] font-bold text-ink-500">+12</div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-800">Book Club</h2>
              <p className="text-[11px] text-ink-400">Discussing "The Midnight Library" this week</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-ink-400">
            <button className="hover:text-primary-500 transition-colors"><Bell className="h-5 w-5" /></button>
            <button className="hover:text-primary-500 transition-colors"><MoreVertical className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-ink-400 bg-white px-4">Monday, October 23</span>
          </div>

          <ChatMessage 
            name="Mia Thompson" 
            time="10:42 AM" 
            content="Hey everyone! Has anyone started chapter 4 of 'The Midnight Library' yet? The library metaphor is so cozy."
            avatar="https://picsum.photos/seed/mia/100/100"
          />
          <ChatMessage 
            name="Leo Garcia" 
            time="10:45 AM" 
            content="I'm about halfway through! It definitely makes me think about all the 'what ifs' in life. Perfect reading for a rainy day like today."
            avatar="https://picsum.photos/seed/leo/100/100"
          />
          <ChatMessage 
            name="You" 
            time="11:05 AM" 
            content="I just finished it! Would anyone be up for a coffee chat at the Student Union later today to discuss? ☕️"
            avatar="https://picsum.photos/seed/sam/100/100"
            isSelf
          />
          <ChatMessage 
            name="Mia Thompson" 
            time="11:08 AM" 
            content="I'd love that! See you there around 4?"
            avatar="https://picsum.photos/seed/mia/100/100"
          />
        </div>

        <footer className="p-6 bg-white border-t border-surface-100">
          <div className="max-w-4xl mx-auto flex items-end gap-4 bg-surface-50 p-2 rounded-2xl border border-surface-200">
            <button className="p-2 text-ink-400 hover:text-primary-500 transition-colors"><Plus className="h-6 w-6" /></button>
            <textarea 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0 resize-none placeholder-ink-400 max-h-32" 
              placeholder="Type a message..." 
              rows={1}
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-2 text-ink-400 hover:text-primary-500 transition-colors"><Smile className="h-6 w-6" /></button>
              <button className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-200">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      <aside className="w-72 bg-white border-l border-surface-200 hidden xl:flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="font-semibold text-ink-800 mb-6">Group Info</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">About</label>
              <p className="mt-2 text-xs text-ink-600 leading-relaxed">
                A quiet space for book lovers on campus. We meet every Friday afternoon for tea and discussion.
              </p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Upcoming Event</label>
              <div className="mt-2 p-3 bg-primary-50 rounded-xl border border-primary-100">
                <span className="text-[10px] font-bold text-primary-500 block mb-1">THIS FRIDAY</span>
                <span className="text-xs font-semibold block">Midnight Library Discussion</span>
                <span className="text-[10px] text-ink-500 block">4:00 PM · Union Lounge</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Shared Files (3)</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 p-2 hover:bg-surface-50 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 bg-coral-50 text-coral-500 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium truncate">reading_list_fall.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
