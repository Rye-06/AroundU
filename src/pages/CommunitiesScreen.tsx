import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { type BuddyMatchRecord, getBuddyMatches } from '../lib/api';

const MIN_VISIBLE_MATCH_SCORE = 0.65;

type MatchEntry = BuddyMatchRecord & {
  rating: number;
  fitLabel: 'Good match';
};

function prettyLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

type CommunitiesScreenProps = {
  currentUserName?: string;
};

export function CommunitiesScreen({ currentUserName = 'Jennifer' }: CommunitiesScreenProps) {
  const [rawMatches, setRawMatches] = useState<BuddyMatchRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoadError(null);
    getBuddyMatches(currentUserName, controller.signal)
      .then(data => setRawMatches(data))
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setRawMatches([]);
        setLoadError('Could not load matches right now. Check that backend is running on port 3001.');
      });

    return () => controller.abort();
  }, [currentUserName]);

  const rankedMatches = useMemo<MatchEntry[]>(() => {
    return rawMatches
      .filter(match => match.rating > MIN_VISIBLE_MATCH_SCORE)
      .sort((a, b) => b.rating - a.rating)
      .map(match => ({
        ...match,
        fitLabel: 'Good match',
      }));
  }, [rawMatches]);

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

        {loadError ? (
          <section className="mt-8 rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-rose-800">Match service unavailable</h3>
            <p className="mt-2 text-sm text-rose-700">{loadError}</p>
          </section>
        ) : isEmpty ? (
          <section className="mt-8 rounded-[2rem] border border-surface-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-ink-800">We&apos;re finding your people.</h3>
            <p className="mt-2 text-sm text-ink-500">Try updating your interests. More matches will appear soon.</p>
          </section>
        ) : (
          <section className="mt-10 pb-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-ink-900">Good Matches</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rankedMatches.map(match => (
                <MatchCard key={match.username} match={match} compact />
              ))}
            </div>
          </section>
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
