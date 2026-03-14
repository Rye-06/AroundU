import { motion } from 'framer-motion';
import { Settings, MapPin, Calendar, Users, ChevronRight, BookOpen, Dumbbell } from 'lucide-react';
import { cn } from '../lib/utils';

const USER_DATA = {
  name: 'Alex Rivers',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  bio: 'CS student who loves late-night study sessions and pickup basketball. Always looking for new people to grab coffee with.',
  interests: ['Study Groups', 'Coffee Chats', 'Fitness', 'Gaming', 'Coding'],
  comfortLevel: ['Small groups', 'Relaxed hangouts'],
  location: 'On campus',
};

const COMMUNITIES = [
  { name: 'Night Owls Study', members: 12, icon: <BookOpen className="w-4 h-4" />, color: 'bg-primary-50 text-primary-600' },
  { name: 'Campus Runners', members: 8, icon: <Dumbbell className="w-4 h-4" />, color: 'bg-coral-50 text-coral-500' },
];

const RECENT_ACTIVITY = [
  { label: 'Joined Group Study — CSC108', time: '2h ago' },
  { label: 'Dropped a thought in Campus chatter', time: '5h ago' },
  { label: 'Attended Coffee & Chat Meetup', time: 'Yesterday' },
];

// Small constellation cluster for the profile header
const HEADER_DOTS = [
  { x: 75, y: 20, r: 3, opacity: 0.12 },
  { x: 82, y: 35, r: 4, opacity: 0.15 },
  { x: 90, y: 18, r: 2, opacity: 0.10 },
  { x: 88, y: 45, r: 2.5, opacity: 0.11 },
  { x: 70, y: 40, r: 2, opacity: 0.09 },
  { x: 95, y: 30, r: 2, opacity: 0.08 },
  { x: 78, y: 50, r: 3, opacity: 0.10 },
];

const HEADER_LINES = [
  { x1: 75, y1: 20, x2: 82, y2: 35 },
  { x1: 82, y1: 35, x2: 90, y2: 18 },
  { x1: 82, y1: 35, x2: 88, y2: 45 },
  { x1: 75, y1: 20, x2: 70, y2: 40 },
];

export function ProfileScreen({ onEdit, onBack }: { onEdit: () => void; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto custom-scrollbar bg-surface-50"
    >
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header with constellation */}
        <div className="relative bg-white rounded-[2.5rem] border border-surface-100 shadow-sm p-8 overflow-hidden">
          {/* Constellation cluster */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            {HEADER_LINES.map((l, i) => (
              <line key={i} x1={`${l.x1}%`} y1={`${l.y1}%`} x2={`${l.x2}%`} y2={`${l.y2}%`}
                stroke="currentColor" strokeWidth="0.5" className="text-primary-400 opacity-[0.08]" />
            ))}
            {HEADER_DOTS.map((d, i) => (
              <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r}
                fill="currentColor" className="text-primary-500" opacity={d.opacity} />
            ))}
          </svg>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-5">
              <img
                src={USER_DATA.avatar}
                alt={USER_DATA.name}
                className="w-20 h-20 rounded-full ring-4 ring-surface-50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-2xl font-bold text-ink-900 tracking-tight">{USER_DATA.name}</h2>
                <div className="flex items-center gap-1.5 mt-1.5 text-ink-500 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{USER_DATA.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="p-2.5 rounded-xl bg-surface-50 hover:bg-surface-100 text-ink-500 hover:text-ink-700 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-6 text-sm text-ink-600 leading-relaxed relative z-10">{USER_DATA.bio}</p>

          {/* Interests */}
          <div className="mt-6 flex flex-wrap gap-2 relative z-10">
            {USER_DATA.interests.map(interest => (
              <span
                key={interest}
                className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Comfort level tags */}
          <div className="mt-4 flex flex-wrap gap-2 relative z-10">
            {USER_DATA.comfortLevel.map(level => (
              <span
                key={level}
                className="px-3 py-1.5 bg-surface-50 text-ink-500 text-xs font-medium rounded-full border border-surface-200"
              >
                {level}
              </span>
            ))}
          </div>
        </div>

        {/* Communities */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-ink-800 mb-4 px-2">Your communities</h3>
          <div className="space-y-3">
            {COMMUNITIES.map(c => (
              <div
                key={c.name}
                className="bg-white rounded-2xl border border-surface-100 p-4 flex items-center justify-between hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl", c.color)}>{c.icon}</div>
                  <div>
                    <p className="font-medium text-sm text-ink-800">{c.name}</p>
                    <p className="text-xs text-ink-500">{c.members} members</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-ink-600 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-ink-800 mb-4 px-2">Recent activity</h3>
          <div className="bg-white rounded-2xl border border-surface-100 divide-y divide-surface-100">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                  <p className="text-sm text-ink-700">{a.label}</p>
                </div>
                <span className="text-xs text-ink-400 font-medium">{a.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="text-sm text-ink-500 hover:text-ink-700 font-medium transition-colors"
          >
            ← Back to Lounge
          </button>
        </div>
      </div>
    </motion.div>
  );
}
