import { motion } from 'framer-motion';
import { BookOpen, Dumbbell } from 'lucide-react';
import { FeedItem } from '../components/FeedItem';
import { CommunityCard } from '../components/CommunityCard';
import { NearbyEvent } from '../components/NearbyEvent';
import { ConstellationDivider } from '../components/ConstellationDivider';
import { ConstellationHero } from '../components/ConstellationHero';

type IcebreakerPost = {
  id: string;
  authorName: string;
  content: string;
  createdLabel: string;
  avatarUrl: string;
};

export function LoungeScreen({
  onCreateEvent,
  icebreakers,
  onDropThought,
  onOpenMessages,
}: {
  onCreateEvent: () => void;
  icebreakers: IcebreakerPost[];
  onDropThought: () => void;
  onOpenMessages: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full overflow-y-auto custom-scrollbar relative"
    >
      <div className="max-w-5xl mx-auto pt-10 px-8 relative z-10">
        <ConstellationHero onCreateEvent={onCreateEvent} />
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-14">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-semibold text-ink-800">Nearby icebreakers</h3>
              <button onClick={onDropThought} className="btn-tactile btn-tactile-soft text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors rounded-lg px-2 py-1">Drop a thought</button>
            </div>
            <div className="space-y-4">
              {icebreakers.map(post => (
                <FeedItem
                  key={post.id}
                  name={post.authorName}
                  time={post.createdLabel}
                  content={post.content}
                  avatar={post.avatarUrl}
                  action="Reply in messages"
                  onAction={onOpenMessages}
                />
              ))}
            </div>
          </section>

          <ConstellationDivider className="my-8" />

          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-semibold text-ink-800">Communities you might like</h3>
              <button className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">See all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CommunityCard 
                title="Night Owls Study"
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

        <aside className="lg:col-span-4 space-y-10 mt-2 lg:mt-0">
          <section>
            <h3 className="text-lg font-semibold text-ink-800 mb-6">Going on right now</h3>
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
