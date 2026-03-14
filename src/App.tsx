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
import { AuthScreen } from './pages/AuthScreen';
import { OnboardingScreen, type OnboardingData } from './pages/OnboardingScreen';
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
import { createEvent, createUserAggregate, type CreateUserAggregateResponse as User } from './lib/api';

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
};

type PostedEventPayload = {
  title: string;
  subtitle: string;
  description: string;
  location?: string;
  interestTag?: string;
  category: string;
};

type Screen = 'auth' | 'onboarding' | 'lounge' | 'map' | 'communities' | 'messages' | 'create' | 'profile' | 'editProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [showSplash, setShowSplash] = useState(true);
  const [eventNotifications, setEventNotifications] = useState<EventToast[]>([]);
  const [userMapEvents, setUserMapEvents] = useState<AppMapEvent[]>([]);
  const [mapFocusEventId, setMapFocusEventId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authName, setAuthName] = useState<string>('');

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1700);
    return () => window.clearTimeout(splashTimer);
  }, []);

  const buildMapEventFromPost = (post: PostedEventPayload): AppMapEvent => {
    const categoryLabel = post.category.charAt(0).toUpperCase() + post.category.slice(1);

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

    const icon = iconByCategory[post.category as keyof typeof iconByCategory] ?? Zap;
    const activityLevel = activityByCategory[post.category as keyof typeof activityByCategory] ?? 'moderate';
    const groupSize = groupSizeByCategory[post.category as keyof typeof groupSizeByCategory] ?? 'medium';

    const spreadIndex = userMapEvents.length;
    const top = 30 + ((spreadIndex * 13) % 40);
    const left = 28 + ((spreadIndex * 17) % 44);
    const nextId = `user-event-${Date.now()}-${Math.floor(Math.random() * 10000)}`;



    return {
      id: nextId,
      title: post.title,
      description: post.description,
      location: post.location ?? 'Campus location',
      category: categoryLabel,
      host: 'Alex Rivers',
      attendees: 1,
      maxAttendees: 8,
      timeLeft: 'Starts now',
      photo: `https://picsum.photos/seed/${nextId}/600/400`,
      tags: [post.interestTag ?? categoryLabel],
      icon,
      top: `${top}%`,
      left: `${left}%`,
      activityLevel,
      activityType: post.category,
      groupSize,
    };
  };

  const handleEventPosted = (post: PostedEventPayload) => {
    const mapEvent = buildMapEventFromPost(post);

    const notification: EventToast = {
      id: mapEvent.id,
      title: post.title,
      subtitle: post.subtitle,
      location: post.location,
      interestTag: post.interestTag,
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

  if (showSplash) {
    return <SplashScreen />;
  }

  // Full-screen flows (no sidebar)
  if (currentScreen === 'auth') {
    return <AuthScreen onAuth={(name) => {
      setAuthName(name);
      setCurrentScreen('onboarding');
    }} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={async (onboardingData: OnboardingData) => {
      const payload = {
        name: authName || 'Student',
        bio: `Hi! I'm interested in ${onboardingData.interests[0]} and meeting new people.`,
        profile: {
          year_of_study: 1,
          major: 'Undeclared',
          mbti: 'UNKNOWN',
          mood: 'good',
          fitness: 'active',
          extroversion: onboardingData.comfort.includes('small') ? 2 : 4,
          group_preference: onboardingData.comfort[0] || 'medium',
          energy_level: 'moderate'
        },
        classes: [],
        clubs: [],
        interests: onboardingData.interests
      };
      //Trying my best here to stay sane
      // Creates the user, passed as a function we created into onboarding screen

      try {
        const createdUser = await createUserAggregate(payload);
        console.log('User created successfully:', createdUser);
        setUser(createdUser);
      } catch (err) {
        console.error('Network error during user creation:', err);
      }

      setCurrentScreen('lounge');
    }} />;
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
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Alex Rivers" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-ink-800">Alex Rivers</p>
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
          {currentScreen === 'lounge' && <LoungeScreen key="lounge" onCreateEvent={() => setCurrentScreen('create')} />}
          {currentScreen === 'map' && <MapScreen key="map" onBack={() => setCurrentScreen('lounge')} onCreateEvent={() => setCurrentScreen('create')} onGoToMessages={() => setCurrentScreen('messages')} userEvents={userMapEvents} initialFocusEventId={mapFocusEventId} onFocusHandled={() => setMapFocusEventId(null)} />}
          {currentScreen === 'create' && <CreateEventScreen key="create" onEventPosted={handleEventPosted} />}
          {currentScreen === 'communities' && <CommunitiesScreen key="communities" />}
          {currentScreen === 'messages' && <MessagesScreen key="messages" />}
          {currentScreen === 'profile' && <ProfileScreen key="profile" onEdit={() => setCurrentScreen('editProfile')} onBack={() => setCurrentScreen('lounge')} />}
          {currentScreen === 'editProfile' && <EditProfileScreen key="editProfile" onBack={() => setCurrentScreen('profile')} />}
        </AnimatePresence>

        <EventNotificationStack
          notifications={eventNotifications}
          onDismiss={dismissNotification}
          onOpen={openNotification}
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
