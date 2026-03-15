import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { ConstellationBackground } from '../components/ConstellationBackground';

const AI_MATCH_RESULT: Record<string, number> = {
  alex_rivers: 0.95,
  maya_patel: 0.93,
  jordan_chen: 0.91,
  sam_wilson: 0.9,
  nina_lee: 0.88,
  chris_kim: 0.84,
};

type GroupPreference = 'solo' | 'small_group' | 'medium_group' | 'large_group';
type EnergyLevel = 'low' | 'moderate' | 'high';

type BuddyProfile = {
  username: string;
  name: string;
  avatar: string;
  year: number;
  major: string;
  interests: string[];
  sharedClasses: string[];
  sharedClubs: string[];
  groupPreference: GroupPreference;
  energyLevel: EnergyLevel;
  aiReason: string;
};

type MatchEntry = BuddyProfile & {
  rating: number;
  fitLabel: 'Great match' | 'Good fit';
};

const BUDDY_DIRECTORY: BuddyProfile[] = [
  {
    username: 'alex_rivers',
    name: 'Alex Rivers',
    avatar: 'https://picsum.photos/seed/alexbuddy/120/120',
    year: 1,
    major: 'Computer Science',
    interests: ['volleyball', 'gym', 'anime'],
    sharedClasses: ['CSC108'],
    sharedClubs: ['AI Club'],
    groupPreference: 'medium_group',
    energyLevel: 'moderate',
    aiReason: 'You both like volleyball and gym.',
  },
  {
    username: 'maya_patel',
    name: 'Maya Patel',
    avatar: 'https://picsum.photos/seed/mayabuddy/120/120',
    year: 1,
    major: 'Computer Science',
    interests: ['coffee chats', 'anime', 'design'],
    sharedClasses: ['MAT137'],
    sharedClubs: ['Volleyball Club'],
    groupPreference: 'small_group',
    energyLevel: 'moderate',
    aiReason: 'Similar schedules and study habits.',
  },
  {
    username: 'jordan_chen',
    name: 'Jordan Chen',
    avatar: 'https://picsum.photos/seed/jordanbuddy/120/120',
    year: 1,
    major: 'Statistics',
    interests: ['gym', 'running', 'coding'],
    sharedClasses: ['CSC108'],
    sharedClubs: [],
    groupPreference: 'small_group',
    energyLevel: 'high',
    aiReason: 'Both first-years in STEM with active routines.',
  },
  {
    username: 'sam_wilson',
    name: 'Sam Wilson',
    avatar: 'https://picsum.photos/seed/sambuddy/120/120',
    year: 2,
    major: 'Math',
    interests: ['study groups', 'gaming', 'anime'],
    sharedClasses: ['MAT137'],
    sharedClubs: ['AI Club'],
    groupPreference: 'medium_group',
    energyLevel: 'low',
    aiReason: 'You share overlap in anime and collaborative studying.',
  },
  {
    username: 'nina_lee',
    name: 'Nina Lee',
    avatar: 'https://picsum.photos/seed/ninabuddy/120/120',
    year: 1,
    major: 'Computer Engineering',
    interests: ['gym', 'coding', 'music'],
    sharedClasses: [],
    sharedClubs: ['Volleyball Club'],
    groupPreference: 'large_group',
    energyLevel: 'high',
    aiReason: 'Strong overlap in campus activities and social energy.',
  },
];

function prettyLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function CommunitiesScreen() {
  const rankedMatches = useMemo<MatchEntry[]>(() => {
    // Required pipeline: threshold filter first, then descending sort, then sectioning.
    const filteredByThreshold = Object.entries(AI_MATCH_RESULT)
      .filter(([, rating]) => rating >= 0.86)
      .sort((a, b) => b[1] - a[1]);

    const merged = filteredByThreshold
      .map(([username, rating]) => {
        const profile = BUDDY_DIRECTORY.find(candidate => candidate.username === username);
        if (!profile) {
          return null;
        }

        return {
          ...profile,
          rating,
          fitLabel: rating >= 0.92 ? 'Great match' : 'Good fit',
        } as MatchEntry;
      })
      .filter((match): match is MatchEntry => Boolean(match));

    return merged;
  }, []);

  const topMatches = useMemo(() => rankedMatches.filter(match => match.rating >= 0.92), [rankedMatches]);
  const goodMatches = useMemo(() => rankedMatches.filter(match => match.rating >= 0.86 && match.rating < 0.92), [rankedMatches]);

  const isEmpty = rankedMatches.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      className="relative h-full overflow-y-auto custom-scrollbar"
    >
      <ConstellationBackground />

      <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
          <div className="text-sm font-medium text-ink-900">Find a Buddy</div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
        <section className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">Find a Buddy</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            Calm, AI-powered recommendations based on shared interests, study rhythm, and social preferences.
          </p>
        </section>

        {isEmpty ? (
          <section className="mt-8 rounded-[2rem] border border-surface-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-ink-800">We&apos;re finding your people.</h3>
            <p className="mt-2 text-sm text-ink-500">Try updating your interests. More matches will appear soon.</p>
          </section>
        ) : (
          <>
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-ink-900">Top Matches</h3>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Great match</p>
              </div>

              {topMatches.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {topMatches.map(match => (
                    <MatchCard key={match.username} match={match} compact={false} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-surface-200 bg-white p-6 text-sm text-ink-500">
                  No top matches with current filters yet.
                </div>
              )}
            </section>

            <section className="mt-10 pb-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink-900">Good Matches</h3>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Good fit</p>
              </div>

              {goodMatches.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {goodMatches.map(match => (
                    <MatchCard key={match.username} match={match} compact />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-surface-200 bg-white p-5 text-sm text-ink-500">
                  No good matches with current filters right now.
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </motion.div>
  );
}

function MatchCard({ match, compact }: { match: MatchEntry; compact: boolean }) {
  const [messageDraft, setMessageDraft] = useState('');

  const handleSend = () => {
    if (!messageDraft.trim()) {
      return;
    }

    setMessageDraft('');
  };

  return (
    <article
      className={[
        'rounded-[1.6rem] border border-surface-200 bg-white shadow-sm transition-all',
        compact ? 'p-4' : 'p-5 md:p-6',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <img
          src={match.avatar}
          alt={match.name}
          className={compact ? 'h-12 w-12 rounded-full object-cover' : 'h-14 w-14 rounded-full object-cover'}
          referrerPolicy="no-referrer"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={compact ? 'text-base font-semibold text-ink-900' : 'text-lg font-semibold text-ink-900'}>{match.name}</h4>
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{match.fitLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn-tactile btn-tactile-solid rounded-xl bg-primary-500 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-600">
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
          Say hi
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={messageDraft}
          onChange={event => setMessageDraft(event.target.value)}
          placeholder="Send a quick intro..."
          className="h-10 flex-1 rounded-xl border border-surface-200 bg-surface-50 px-3 text-sm text-ink-700 outline-none transition focus:border-primary-300 focus:bg-white"
        />
        <button
          onClick={handleSend}
          className="btn-tactile btn-tactile-solid inline-flex h-10 items-center gap-1 rounded-xl bg-primary-500 px-3 text-xs font-semibold text-white hover:bg-primary-600"
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </button>
      </div>
    </article>
  );
}
