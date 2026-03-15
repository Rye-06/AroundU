import { motion } from 'framer-motion';
import { FeedItem } from '../components/FeedItem';
import { NearbyEvent } from '../components/NearbyEvent';
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
              <h3 className="text-2xl font-semibold text-ink-800">Going on right now</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <NearbyEvent 
                status="In 2 hours" 
                title="Anime Break Circle" 
                location="Student Union Lounge"
                color="coral"
              />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-10 mt-2 lg:mt-0">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-semibold text-ink-800">Nearby chatter</h3>
              <button onClick={onDropThought} className="btn-tactile btn-tactile-soft text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors rounded-lg px-2 py-1">Drop a thought</button>
            </div>
            <div className="space-y-4">
              {icebreakers.map(post => (
                <div key={post.id}>
                  <FeedItem
                    name={post.authorName}
                    time={post.createdLabel}
                    content={post.content}
                    avatar={post.avatarUrl}
                    action="Reply"
                    onAction={onOpenMessages}
                  />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
