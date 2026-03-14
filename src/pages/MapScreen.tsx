import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus, Home, MessageSquare, Plus, Search } from 'lucide-react';
import CampusMap from '../components/map/CampusMap';
import { mapEvents } from '../data/mockData';
import { fetchEventsForMap, type MapEventPayload } from '../lib/api';
import { type AroundUAIProfile } from '../lib/profile';

type MapEvent = MapEventPayload & {
  id: string;
  title: string;
};

const SAMPLE_MARKER_EVENTS: MapEvent[] = [
  {
    id: 'sample-robarts-study',
    title: 'Open Study Circle',
    category: 'Study',
    description: 'Drop in for a collaborative review session before tomorrow\'s classes.',
    preview: 'Quiet collaborative study on Robarts 4th floor.',
    lat: 43.6644,
    lng: -79.3991,
    attendees: 6,
    tags: ['Focus', 'Open'],
    activityLevel: 'moderate',
    groupSize: 'medium',
  } as MapEvent,
  {
    id: 'sample-harthouse-coffee',
    title: 'Coffee + Catchup',
    category: 'Social',
    description: 'Friendly social meetup for anyone between lectures.',
    preview: 'Warm, low-key conversation at Hart House Cafe.',
    lat: 43.6635,
    lng: -79.3949,
    attendees: 4,
    tags: ['Chill', 'New Friends'],
    activityLevel: 'quiet',
    groupSize: 'small',
  } as MapEvent,
  {
    id: 'sample-athletic-run',
    title: 'Evening Run Group',
    category: 'Sports',
    description: 'Light pace run around campus paths. All levels welcome.',
    preview: 'Meet at the Athletic Centre entrance in 20 mins.',
    lat: 43.6672,
    lng: -79.4012,
    attendees: 8,
    tags: ['Active', 'Beginner Friendly'],
    activityLevel: 'high',
    groupSize: 'large',
  } as MapEvent,
  {
    id: 'sample-food',
    title: 'Late Night Snack Loop',
    category: 'Food',
    description: 'Quick food crawl around nearby spots before heading back to res.',
    preview: 'Food vibe near Student Union.',
    lat: 43.6618,
    lng: -79.3975,
    attendees: 5,
    activityLevel: 'moderate',
    groupSize: 'medium',
  } as MapEvent,
  {
    id: 'sample-music',
    title: 'Acoustic Jam Session',
    category: 'Music',
    description: 'Bring your instrument and join a relaxed campus jam.',
    preview: 'Casual music meetup in Hart House area.',
    lat: 43.6646,
    lng: -79.3936,
    attendees: 7,
    activityLevel: 'moderate',
    groupSize: 'medium',
  } as MapEvent,
  {
    id: 'sample-other',
    title: 'Open Campus Club Meetup',
    category: 'Other',
    description: 'General interest community meetup for anyone nearby.',
    preview: 'Meet students from different programs.',
    lat: 43.6662,
    lng: -79.3961,
    attendees: 6,
    activityLevel: 'quiet',
    groupSize: 'medium',
  } as MapEvent,
  {
    id: 'sample-icebreaker-1',
    title: 'Icebreaker Post',
    category: 'Icebreaker',
    description: 'Anyone up for a quick coffee chat between classes?',
    preview: 'Conversation starter nearby.',
    lat: 43.6622,
    lng: -79.3942,
    markerType: 'icebreaker',
    activityLevel: 'quiet',
    groupSize: 'small',
  } as MapEvent,
  {
    id: 'sample-icebreaker-2',
    title: 'Icebreaker Post',
    category: 'Icebreaker',
    description: 'Looking for a study accountability buddy this evening.',
    preview: 'Say hi and join the thread.',
    lat: 43.6656,
    lng: -79.398,
    markerType: 'icebreaker',
    activityLevel: 'moderate',
    groupSize: 'small',
  } as MapEvent,
];

type MapScreenProps = {
  onBack: () => void;
  onCreateEvent: () => void;
  onGoToMessages: () => void;
  profile: AroundUAIProfile;
  profilePhotoUrl: string;
  userEvents?: MapEvent[];
  initialFocusEventId?: string | null;
  onFocusHandled?: () => void;
};

const CAMPUS_FALLBACK_POSITION = { lat: 43.6631, lng: -79.3958 };

export function MapScreen({ onBack, onCreateEvent, onGoToMessages, profile, profilePhotoUrl, userEvents = [], initialFocusEventId, onFocusHandled }: MapScreenProps) {
  const [backendEvents, setBackendEvents] = useState<MapEvent[]>([]);
  const [userPosition, setUserPosition] = useState(CAMPUS_FALLBACK_POSITION);

  useEffect(() => {
    const controller = new AbortController();

    fetchEventsForMap(controller.signal)
      .then((events) => {
        setBackendEvents(events as MapEvent[]);
      })
      .catch(() => {
        setBackendEvents([]);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserPosition(CAMPUS_FALLBACK_POSITION);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 12000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const displayedEvents = useMemo<MapEvent[]>(
    () => {
      if (backendEvents.length > 0) {
        return [...backendEvents, ...userEvents];
      }

      return [...SAMPLE_MARKER_EVENTS, ...mapEvents, ...userEvents];
    },
    [backendEvents, userEvents]
  );
  const [showFabMenu, setShowFabMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full overflow-hidden bg-surface-50"
    >
      <div className="absolute inset-0 p-3 sm:p-5">
        <CampusMap
          events={displayedEvents}
          userProfile={profile}
          userPhotoUrl={profilePhotoUrl}
          userPosition={userPosition}
          focusEventId={initialFocusEventId}
          onFocusHandled={onFocusHandled}
          className="h-full"
        />
      </div>

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-surface-200 bg-white/88 px-4 py-2.5 shadow-sm backdrop-blur-md">
            <button onClick={onBack} className="text-ink-500 transition-colors hover:text-ink-800" aria-label="Back to lounge">
              <Home className="h-5 w-5" />
            </button>
            <span className="text-surface-300">|</span>
            <h1 className="text-sm font-semibold text-ink-700 sm:text-base">Campus Map</h1>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={onGoToMessages}
              className="rounded-full border border-surface-200 bg-white/88 p-2.5 text-ink-500 shadow-sm backdrop-blur-md transition-colors hover:text-ink-800"
              aria-label="Open messages"
            >
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              className="rounded-full border border-surface-200 bg-white/88 p-2.5 text-ink-500 shadow-sm backdrop-blur-md transition-colors hover:text-ink-800"
              aria-label="Search nearby events"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <AnimatePresence>
            {showFabMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.92 }}
                className="flex flex-col items-center gap-2"
              >
                <button
                  onClick={() => { setShowFabMenu(false); onGoToMessages(); }}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-200 bg-white/95 px-4 py-2.5 text-xs font-semibold text-ink-700 shadow-md backdrop-blur-md transition-colors hover:bg-white"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-primary-600" />
                  Say Something
                </button>

                <button
                  onClick={() => { setShowFabMenu(false); onCreateEvent(); }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-300/60 bg-primary-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(123,151,128,0.32)] transition-colors hover:bg-primary-600"
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Host Event
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowFabMenu(prev => !prev)}
            className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-primary-300/50 bg-primary-500 text-white shadow-[0_12px_30px_rgba(123,151,128,0.35)] transition-all duration-300 hover:bg-primary-600 active:scale-95"
            aria-label="Toggle quick actions"
            aria-expanded={showFabMenu}
          >
            <div className="pointer-events-none absolute inset-0 z-0 scale-0 rounded-full bg-white/20 group-hover:animate-ripple" />
            <Plus className={`relative z-10 h-6 w-6 transition-transform duration-300 ${showFabMenu ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
