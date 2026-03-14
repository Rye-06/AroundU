import { motion } from 'framer-motion';
import { Plus, BookOpen, Dumbbell } from 'lucide-react';
import { FeedItem } from '../components/FeedItem';
import { CommunityCard } from '../components/CommunityCard';
import { NearbyEvent } from '../components/NearbyEvent';

export function LoungeScreen({ onCreateEvent }: { onCreateEvent: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <header className="max-w-5xl mx-auto pt-12 px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink-900">Hello, Alex.</h2>
            <p className="text-ink-500 mt-2">4 friends nearby · 8 events happening now</p>
          </div>
          <button 
            onClick={onCreateEvent}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-md shadow-primary-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Event</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-semibold text-ink-800">Activity Feed</h3>
              <button className="text-sm text-primary-500 hover:underline font-medium">Share a thought</button>
            </div>
            <div className="space-y-4">
              <FeedItem 
                name="Jordan Chen" 
                time="20m ago" 
                content="Studying at the library, feel free to join! I'm in the south wing near the windows. ☕️"
                avatar="https://picsum.photos/seed/jordan/100/100"
                action="Wave hello"
              />
              <FeedItem 
                name="Maya Patel" 
                time="1h ago" 
                content="Found a great spot for sketching near the fountain today. The light is perfect."
                avatar="https://picsum.photos/seed/maya/100/100"
                action="Send love"
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-semibold text-ink-800">People you might enjoy meeting</h3>
              <button className="text-sm text-primary-500 hover:underline font-medium">Explore groups</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CommunityCard 
                title="Night Owls Study Crew"
                desc="Late-night study sessions and caffeine-fueled cram groups."
                tags={['Study', 'Night']}
                members={12}
                color="indigo"
                icon={<BookOpen className="w-6 h-6" />}
              />
              <CommunityCard 
                title="Campus Runners"
                desc="Morning runs, gym sessions, and fitness accountability."
                tags={['Fitness', 'Outdoors']}
                members={8}
                color="coral"
                icon={<Dumbbell className="w-6 h-6" />}
              />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-ink-800 mb-6">Happening nearby</h3>
            <div className="space-y-4">
              <NearbyEvent 
                status="Live Now" 
                title="Group Study — CSC108" 
                location="Bahen Centre, Room 2230 · 45 mins left"
                color="indigo"
              />
              <NearbyEvent 
                status="In 30 min" 
                title="Coffee & Chat Meetup" 
                location="Hart House Café"
                color="coral"
              />
              <NearbyEvent 
                status="In 1 hour" 
                title="Pickup Basketball" 
                location="Athletic Centre Court 3"
                color="indigo"
              />
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
