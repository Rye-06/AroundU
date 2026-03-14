import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Map as MapIcon,
  CalendarPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { AuthScreen } from './pages/AuthScreen';
import { OnboardingScreen } from './pages/OnboardingScreen';
import { LoungeScreen } from './pages/LoungeScreen';
import { MapScreen } from './pages/MapScreen';
import { CreateEventScreen } from './pages/CreateEventScreen';
import { CommunitiesScreen } from './pages/CommunitiesScreen';
import { MessagesScreen } from './pages/MessagesScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { EditProfileScreen } from './pages/EditProfileScreen';

type Screen = 'auth' | 'onboarding' | 'lounge' | 'map' | 'communities' | 'messages' | 'create' | 'profile' | 'editProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');

  // Full-screen flows (no sidebar)
  if (currentScreen === 'auth') {
    return <AuthScreen onAuth={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={() => setCurrentScreen('lounge')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Sidebar */}
      {currentScreen !== 'map' && (
        <aside className="w-20 md:w-64 bg-surface-50 border-r border-surface-200 flex flex-col h-full shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-ink-800 tracking-tight hidden md:block">CampusPulse</h1>
            <div className="md:hidden w-8 h-8 bg-primary-400 rounded-full mx-auto" />
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
        <AnimatePresence mode="wait">
          {currentScreen === 'lounge' && <LoungeScreen key="lounge" onCreateEvent={() => setCurrentScreen('create')} />}
          {currentScreen === 'map' && <MapScreen key="map" onBack={() => setCurrentScreen('lounge')} onCreateEvent={() => setCurrentScreen('create')} onGoToMessages={() => setCurrentScreen('messages')} />}
          {currentScreen === 'create' && <CreateEventScreen key="create" />}
          {currentScreen === 'communities' && <CommunitiesScreen key="communities" />}
          {currentScreen === 'messages' && <MessagesScreen key="messages" />}
          {currentScreen === 'profile' && <ProfileScreen key="profile" onEdit={() => setCurrentScreen('editProfile')} onBack={() => setCurrentScreen('lounge')} />}
          {currentScreen === 'editProfile' && <EditProfileScreen key="editProfile" onBack={() => setCurrentScreen('profile')} />}
        </AnimatePresence>
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
