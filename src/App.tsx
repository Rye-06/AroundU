import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Map as MapIcon,
  CalendarPlus,
  BookOpen,
  Coffee,
  Dumbbell,
  Utensils,
  Music,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { AuthScreen, type AuthSubmitPayload } from './pages/AuthScreen';
import { OnboardingScreen, type OnboardingPayload } from './pages/OnboardingScreen';
import { LoungeScreen } from './pages/LoungeScreen';
import { MapScreen } from './pages/MapScreen';
import { CreateEventScreen } from './pages/CreateEventScreen';
import { CommunitiesScreen } from './pages/CommunitiesScreen';
import { MessagesScreen } from './pages/MessagesScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { EditProfileScreen } from './pages/EditProfileScreen';
import { EventNotificationStack, type EventToast } from './components/EventNotificationStack';
import { AroundUEmblem, AroundULogo } from './components/AroundULogo';
import { SplashScreen } from './components/SplashScreen';
import { ConstellationBackground } from './components/ConstellationBackground';
import { MoodCheckInModal } from './components/MoodCheckInModal';
import { DEFAULT_AI_PROFILE, type AroundUAIProfile, type MoodOption } from './lib/profile';
import { createUserAggregate, type CreateEventSubmission } from './lib/api';

type AppMapEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  host: string;
  attendees: number;
  maxAttendees: number;
  timeLeft: string;
  photo: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  top: string;
  left: string;
  activityLevel: 'quiet' | 'moderate' | 'high';
  activityType: string;
  groupSize: 'small' | 'medium' | 'large';
  markerType?: 'event' | 'icebreaker' | string;
  lat?: number;
  lng?: number;
  preview?: string;
  host_user_id?: string;
};

type PostedEventPayload = {
  id?: string;
  host_user_id: string;
  title: string;
  description: string;
  event_type: string;
  interest_tag: string[];
  skill_level_required: string;
  latitude: number;
  longitude: number;
  event_time: string;
  max_participants: number;
  creator_location: {
    latitude: number;
    longitude: number;
  } | null;
};

type Screen = 'auth' | 'onboarding' | 'lounge' | 'map' | 'communities' | 'messages' | 'create' | 'profile' | 'editProfile';
const USER_ID_STORAGE_KEY = 'aroundu.user.id';

type IcebreakerPost = {
  id: string;
  authorName: string;
  content: string;
  createdAt: number;
  createdLabel: string;
  avatarUrl: string;
  latitude: number;
  longitude: number;
};

const INITIAL_ICEBREAKERS: IcebreakerPost[] = [
  {
    id: 'icebreaker-init-1',
    authorName: 'Jordan Chen',
    content: 'Anyone else procrastinating right now? I am near Robarts.',
    createdAt: Date.now() - 20 * 60 * 1000,
    createdLabel: '20m ago',
    avatarUrl: 'https://picsum.photos/seed/jordan/100/100',
    latitude: 43.6622,
    longitude: -79.3942,
  },
  {
    id: 'icebreaker-init-2',
    authorName: 'Maya Patel',
    content: 'Looking for a quick coffee chat before my next class.',
    createdAt: Date.now() - 58 * 60 * 1000,
    createdLabel: '58m ago',
    avatarUrl: 'https://picsum.photos/seed/maya/100/100',
    latitude: 43.6656,
    longitude: -79.398,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [showSplash, setShowSplash] = useState(true);
  const [eventNotifications, setEventNotifications] = useState<EventToast[]>([]);
  const [userMapEvents, setUserMapEvents] = useState<AppMapEvent[]>([]);
  const [mapFocusEventId, setMapFocusEventId] = useState<string | null>(null);
  const [icebreakers, setIcebreakers] = useState<IcebreakerPost[]>(INITIAL_ICEBREAKERS);
  const [aiProfile, setAiProfile] = useState<AroundUAIProfile>(DEFAULT_AI_PROFILE);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [selectedMessageEventId, setSelectedMessageEventId] = useState<string | null>(null);
  const profilePhotoUrl = `https://picsum.photos/seed/${encodeURIComponent(aiProfile.name || 'aroundu-user')}/160/160`;

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1700);
    return () => window.clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const storedUserId = window.localStorage.getItem(USER_ID_STORAGE_KEY);
    if (storedUserId) {
      setSessionUserId(storedUserId);
    }
  }, []);

  const buildMapEventFromPost = (post: PostedEventPayload): AppMapEvent => {
    const eventType = post.event_type.toLowerCase();
    const categoryLabel = post.event_type.charAt(0).toUpperCase() + post.event_type.slice(1);

    const iconByCategory = {
      study: BookOpen,
      social: Coffee,
      sports: Dumbbell,
      food: Utensils,
      music: Music,
      other: Zap,
    } as const;

    const activityByCategory = {
      study: 'moderate',
      social: 'quiet',
      sports: 'high',
      food: 'moderate',
      music: 'moderate',
      other: 'moderate',
    } as const;

    const groupSizeByCategory = {
      study: 'medium',
      social: 'small',
      sports: 'large',
      food: 'medium',
      music: 'medium',
      other: 'medium',
    } as const;

    const icon = iconByCategory[eventType as keyof typeof iconByCategory] ?? Zap;
    const activityLevel = activityByCategory[eventType as keyof typeof activityByCategory] ?? 'moderate';
    const groupSize = groupSizeByCategory[eventType as keyof typeof groupSizeByCategory] ?? 'medium';

    const spreadIndex = userMapEvents.length;
    const top = 30 + ((spreadIndex * 13) % 40);
    const left = 28 + ((spreadIndex * 17) % 44);
    const nextId = post.id || `user-event-${Date.now()}-${Math.floor(Math.random() * 10000)}`;



    return {
      id: nextId,
      title: post.title,
      description: post.description,
      location: `${post.latitude.toFixed(5)}, ${post.longitude.toFixed(5)}`,
      category: categoryLabel,
      host: aiProfile.name,
      attendees: 1,
      maxAttendees: post.max_participants,
      timeLeft: post.event_time,
      photo: `https://picsum.photos/seed/${nextId}/600/400`,
      tags: post.interest_tag.length > 0 ? post.interest_tag : [categoryLabel],
      icon,
      top: `${top}%`,
      left: `${left}%`,
      activityLevel,
      activityType: post.event_type,
      groupSize,
      host_user_id: post.host_user_id,
    };
  };

  const handleEventPosted = (post: PostedEventPayload) => {
    const mapEvent = buildMapEventFromPost(post);

    const notification: EventToast = {
      id: mapEvent.id,
      title: post.title,
      subtitle: post.description.slice(0, 80),
      location: `${post.latitude.toFixed(5)}, ${post.longitude.toFixed(5)}`,
      interestTag: post.interest_tag[0],
      ctaLabel: 'View',
      durationMs: 5000,
    };

    setUserMapEvents(prev => [mapEvent, ...prev]);
    setEventNotifications(prev => [notification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setEventNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const openNotification = (id: string) => {
    setMapFocusEventId(id);
    setCurrentScreen('map');
    dismissNotification(id);
  };

  const createIcebreaker = (location: { latitude: number; longitude: number }, draftThought?: string) => {
    const thought = draftThought ?? window.prompt('Post a nearby icebreaker prompt', 'Anyone else procrastinating right now?');

    if (!thought || !thought.trim()) {
      return;
    }

    const nextId = `icebreaker-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newPost: IcebreakerPost = {
      id: nextId,
      authorName: aiProfile.name,
      content: thought.trim(),
      createdAt: Date.now(),
      createdLabel: 'Just now',
      avatarUrl: profilePhotoUrl,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setIcebreakers(prev => [newPost, ...prev]);
    setUserMapEvents(prev => [
      {
        id: nextId,
        title: 'Icebreaker Post',
        description: newPost.content,
        location: `${newPost.latitude.toFixed(5)}, ${newPost.longitude.toFixed(5)}`,
        category: 'Icebreaker',
        host: newPost.authorName,
        attendees: 1,
        maxAttendees: 99,
        timeLeft: 'Live now',
        photo: `https://picsum.photos/seed/${nextId}/600/400`,
        tags: ['Icebreaker'],
        icon: MessageSquare,
        top: '50%',
        left: '50%',
        activityLevel: 'quiet',
        activityType: 'icebreaker',
        groupSize: 'small',
        markerType: 'icebreaker',
        lat: newPost.latitude,
        lng: newPost.longitude,
        preview: 'Tap to reply and start a conversation.',
      },
      ...prev,
    ]);

    setCurrentScreen('map');
  };

  const handleAuth = (payload: AuthSubmitPayload) => {
    setAuthMode(payload.mode);

    if (payload.mode === 'signup') {
      setAiProfile(prev => ({
        ...prev,
        name: payload.name ?? prev.name,
      }));

      // New account flow should create and persist a fresh user id after onboarding.
      setSessionUserId(null);
      window.localStorage.removeItem(USER_ID_STORAGE_KEY);
      setHasCompletedOnboarding(false);
      setShowMoodCheckIn(false);
      setCurrentScreen('onboarding');
      return;
    }

    if (hasCompletedOnboarding) {
      setCurrentScreen('lounge');
      setShowMoodCheckIn(true);
      return;
    }

    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async (payload: OnboardingPayload) => {
    const nextProfile = {
      ...aiProfile,
      user_profile: {
        ...aiProfile.user_profile,
        ...payload,
        personality: {
          ...aiProfile.user_profile.personality,
          ...payload.personality,
        },
      },
    };

    setAiProfile(prev => ({
      ...prev,
      user_profile: {
        ...prev.user_profile,
        ...payload,
        personality: {
          ...prev.user_profile.personality,
          ...payload.personality,
        },
      },
    }));

    if (authMode === 'signup') {
      try {
        const created = await createUserAggregate({
          name: nextProfile.name,
          profile: {
            year_of_study: nextProfile.user_profile.year_of_study,
            major: nextProfile.user_profile.major,
            mbti: nextProfile.user_profile.mbti,
            mood: nextProfile.user_profile.mood,
            fitness: nextProfile.user_profile.fitness,
            extroversion: nextProfile.user_profile.personality.extroversion,
            group_preference: nextProfile.user_profile.personality.group_preference,
            energy_level: nextProfile.user_profile.personality.energy_level,
          },
          classes: nextProfile.user_profile.class,
          clubs: nextProfile.user_profile.club,
          interests: nextProfile.user_profile.interests,
        });

        if (created?.id) {
          setSessionUserId(created.id);
          window.localStorage.setItem(USER_ID_STORAGE_KEY, created.id);
        }
      } catch (error) {
        console.error('Failed to store new user profile:', error);
      }
    }

    setHasCompletedOnboarding(true);
    setCurrentScreen('lounge');
    setShowMoodCheckIn(true);
  };

  const handleMoodSelect = (mood: MoodOption) => {
    setAiProfile(prev => ({
      ...prev,
      user_profile: {
        ...prev.user_profile,
        mood,
      },
    }));
    setShowMoodCheckIn(false);
  };

  const handleProfileSave = (profile: AroundUAIProfile) => {
    setAiProfile(profile);
    setCurrentScreen('profile');
  };

  const handleJoinEventChat = ({
    eventId,
    eventTitle: _eventTitle,
    hostUserId: _hostUserId,
    participantUserIds: _participantUserIds,
  }: {
    eventId: string;
    eventTitle: string;
    hostUserId?: string;
    participantUserIds: string[];
  }) => {
    if (!sessionUserId) {
      return;
    }

    setSelectedMessageEventId(eventId);
    setCurrentScreen('messages');
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  // Full-screen flows (no sidebar)
  if (currentScreen === 'auth') {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Sidebar */}
      {currentScreen !== 'map' && (
        <aside className="w-20 md:w-64 bg-surface-50 border-r border-surface-200 flex flex-col h-full shrink-0">
          <div className="p-6">
            <div className="hidden md:block">
              <AroundULogo compact showTagline />
            </div>
            <div className="md:hidden mx-auto w-fit">
              <AroundUEmblem className="h-8 w-8" />
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavButton 
              active={currentScreen === 'lounge'} 
              onClick={() => setCurrentScreen('lounge')}
              icon={<Home className="w-6 h-6" />}
              label="Lounge"
            />
            <NavButton 
              active={currentScreen === 'map'} 
              onClick={() => setCurrentScreen('map')}
              icon={<MapIcon className="w-6 h-6" />}
              label="Campus Map"
            />
            <NavButton 
              active={currentScreen === 'create'} 
              onClick={() => setCurrentScreen('create')}
              icon={<CalendarPlus className="w-6 h-6" />}
              label="Host Event"
            />
            <NavButton 
              active={currentScreen === 'communities'} 
              onClick={() => setCurrentScreen('communities')}
              icon={<Users className="w-6 h-6" />}
              label="Communities"
            />
            <NavButton 
              active={currentScreen === 'messages'} 
              onClick={() => setCurrentScreen('messages')}
              icon={<MessageSquare className="w-6 h-6" />}
              label="Messages"
            />
          </nav>

          <div className="p-4 border-t border-surface-200">
            <button
              onClick={() => setCurrentScreen('profile')}
              className="flex items-center space-x-3 p-2 w-full rounded-2xl hover:bg-surface-100 transition-colors cursor-pointer"
            >
              <img 
                src={profilePhotoUrl}
                alt={aiProfile.name} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-ink-800">{aiProfile.name}</p>
                <p className="text-xs text-ink-500 font-medium">Online now</p>
              </div>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {currentScreen !== 'map' && <ConstellationBackground />}

        <AnimatePresence mode="wait">
          {currentScreen === 'lounge' && <LoungeScreen key="lounge" onCreateEvent={() => setCurrentScreen('create')} icebreakers={icebreakers} onDropThought={() => createIcebreaker({ latitude: 43.6629, longitude: -79.3957 })} onOpenMessages={() => setCurrentScreen('messages')} />}
          {currentScreen === 'map' && <MapScreen key="map" onBack={() => setCurrentScreen('lounge')} onCreateEvent={() => setCurrentScreen('create')} onGoToMessages={() => setCurrentScreen('messages')} onCreateIcebreaker={createIcebreaker} onJoinEventChat={handleJoinEventChat} currentUserId={sessionUserId} profile={aiProfile} profilePhotoUrl={profilePhotoUrl} userEvents={userMapEvents} initialFocusEventId={mapFocusEventId} onFocusHandled={() => setMapFocusEventId(null)} />}
          {currentScreen === 'create' && <CreateEventScreen key="create" hostUserId={sessionUserId ?? ''} onEventPosted={(payload: CreateEventSubmission) => handleEventPosted(payload)} />}
          {currentScreen === 'communities' && <CommunitiesScreen key="communities" />}
          {currentScreen === 'messages' && <MessagesScreen key="messages" preferredEventId={selectedMessageEventId} onPreferredEventHandled={() => setSelectedMessageEventId(null)} currentUserId={sessionUserId} currentUserName={aiProfile.name} currentUserAvatar={profilePhotoUrl} />}
          {currentScreen === 'profile' && <ProfileScreen key="profile" profile={aiProfile} onEdit={() => setCurrentScreen('editProfile')} onBack={() => setCurrentScreen('lounge')} />}
          {currentScreen === 'editProfile' && <EditProfileScreen key="editProfile" profile={aiProfile} onBack={() => setCurrentScreen('profile')} onSave={handleProfileSave} />}
        </AnimatePresence>

        <EventNotificationStack
          notifications={eventNotifications}
          onDismiss={dismissNotification}
          onOpen={openNotification}
        />

        <MoodCheckInModal
          open={showMoodCheckIn}
          onSkip={() => setShowMoodCheckIn(false)}
          onSelectMood={handleMoodSelect}
        />
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 p-3 w-full rounded-xl transition-all duration-300",
        active 
          ? "bg-white text-primary-600 shadow-[0_5px_20px_rgba(112,147,136,0.15)] scale-[1.02]" 
          : "text-ink-500 hover:bg-white/50 hover:shadow-[0_0_10px_rgba(112,147,136,0.05)]"
      )}
    >
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );
}
