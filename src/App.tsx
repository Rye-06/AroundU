/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Search, 
  Plus, 
  Bell, 
  MoreVertical, 
  BookOpen, 
  Leaf, 
  Coffee, 
  Smile, 
  Map as MapIcon,
  Settings,
  Send,
  FileText,
  Check,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Screen = 'lounge' | 'map' | 'communities' | 'messages';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('lounge');

  return (
    <div className="flex h-screen overflow-hidden bg-warm-neutral-50">
      {/* Sidebar - Hidden on Map screen for full immersion */}
      {currentScreen !== 'map' && (
        <aside className="w-20 md:w-64 bg-sage-100 border-r border-sage-200 flex flex-col h-full shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-sage-800 hidden md:block">CampusPulse</h1>
            <div className="md:hidden w-8 h-8 bg-sage-500 rounded-full mx-auto" />
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
              label="Gentle Map"
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

          <div className="p-4 border-t border-sage-200">
            <div className="flex items-center space-x-3 p-2">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Alex Rivers" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold">Alex Rivers</p>
                <p className="text-xs text-sage-500">Studying...</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'lounge' && <LoungeScreen key="lounge" />}
          {currentScreen === 'map' && <MapScreen key="map" onBack={() => setCurrentScreen('lounge')} />}
          {currentScreen === 'communities' && <CommunitiesScreen key="communities" />}
          {currentScreen === 'messages' && <MessagesScreen key="messages" />}
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
        "flex items-center space-x-3 p-3 w-full rounded-xl transition-all duration-200",
        active 
          ? "bg-white text-sage-600 shadow-sm" 
          : "text-sage-500 hover:bg-sage-50"
      )}
    >
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );
}

// --- SCREENS ---

function LoungeScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <header className="max-w-5xl mx-auto pt-12 px-8">
        <h2 className="text-3xl font-light text-sage-800">Hello, Alex.</h2>
        <p className="text-sage-500 mt-2">The campus is quiet today. 4 friends are currently around.</p>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-medium text-sage-700">Gentle Feed</h3>
              <button className="text-sm text-soft-blue-500 hover:underline">Share a thought</button>
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
              <h3 className="text-lg font-medium text-sage-700">People you might enjoy meeting</h3>
              <button className="text-sm text-soft-blue-500 hover:underline">Explore groups</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CommunityCard 
                title="Slow Readers Guild"
                desc="Focusing on deep reading and thoughtful discussion."
                tags={['Literature', 'Quiet']}
                members={12}
                color="blue"
                icon={<BookOpen className="w-6 h-6" />}
              />
              <CommunityCard 
                title="Plant Parents"
                desc="Sharing propagation tips and dorm-room greenery."
                tags={['Gardening', 'Hobbies']}
                members={8}
                color="sage"
                icon={<Leaf className="w-6 h-6" />}
              />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <section>
            <h3 className="text-lg font-medium text-sage-700 mb-6">Happening nearby</h3>
            <div className="space-y-4">
              <NearbyEvent 
                status="Ongoing" 
                title="Mid-day Meditation" 
                location="Small Lawn near Art Hall • 12 mins left"
                color="sage"
              />
              <NearbyEvent 
                status="In 1 hour" 
                title="Vinyl Listening Session" 
                location="Student Lounge, 2nd Floor"
                color="blue"
              />
            </div>
          </section>

          <section className="bg-warm-neutral-100 p-6 rounded-3xl">
            <h3 className="text-sm font-semibold text-sage-800 uppercase tracking-widest mb-4">Your Today</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-sage-600">Focus Time</span>
                <span className="text-sm font-medium">2h 15m</span>
              </div>
              <div className="w-full bg-warm-neutral-200 rounded-full h-1.5">
                <div className="bg-sage-500 h-1.5 rounded-full" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-sage-500 italic text-center pt-2">"Take it one small step at a time."</p>
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}

function FeedItem({ name, time, content, avatar, action }: { name: string, time: string, content: string, avatar: string, action: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-warm-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="font-medium text-sage-800">{name}</span>
            <span className="text-xs text-sage-500">{time}</span>
          </div>
          <p className="mt-1 text-sage-600">{content}</p>
          <div className="mt-4">
            <button className="px-3 py-1 bg-sage-50 text-sage-600 rounded-full text-xs border border-sage-100 hover:bg-sage-100 transition-colors">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ title, desc, tags, members, color, icon }: { title: string, desc: string, tags: string[], members: number, color: 'blue' | 'sage', icon: React.ReactNode }) {
  const bgColor = color === 'blue' ? 'bg-soft-blue-100/50' : 'bg-sage-100/50';
  const borderColor = color === 'blue' ? 'border-soft-blue-200' : 'border-sage-200';
  const iconColor = color === 'blue' ? 'text-soft-blue-500' : 'text-sage-500';

  return (
    <div className={cn("p-6 rounded-3xl border", bgColor, borderColor)}>
      <div className="flex justify-between">
        <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <img 
              key={i}
              className="w-6 h-6 rounded-full ring-2 ring-white" 
              src={`https://picsum.photos/seed/member${i+members}/50/50`} 
              alt="member"
              referrerPolicy="no-referrer"
            />
          ))}
          <div className={cn("w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-medium ring-2 ring-white", color === 'blue' ? 'bg-soft-blue-200' : 'bg-sage-200')}>
            +{members}
          </div>
        </div>
      </div>
      <h4 className="mt-4 font-semibold text-sage-800">{title}</h4>
      <p className="text-sm text-sage-600 mt-1">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={cn("text-[10px] px-2 py-0.5 bg-white/70 rounded-full border uppercase tracking-wider", borderColor)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function NearbyEvent({ status, title, location, color }: { status: string, title: string, location: string, color: 'sage' | 'blue' }) {
  const dotColor = color === 'sage' ? 'bg-sage-500' : 'bg-soft-blue-500';
  const textColor = color === 'sage' ? 'text-sage-500' : 'text-soft-blue-500';

  return (
    <div className="group bg-white p-4 rounded-2xl border border-warm-neutral-200 hover:bg-sage-50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <span className={cn("text-xs font-semibold uppercase tracking-widest", textColor)}>{status}</span>
      </div>
      <p className="mt-2 text-sage-800 font-medium">{title}</p>
      <p className="text-xs text-sage-500 mt-1">{location}</p>
    </div>
  );
}

function MapScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-sage-50 relative overflow-hidden"
    >
      {/* Map Background Simulation */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sage-200 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warm-neutral-200 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-sage-200 border-t border-l opacity-20" />
      </div>

      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-sage-100 flex items-center space-x-2">
          <button onClick={onBack} className="text-sage-500 hover:text-sage-800 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <span className="text-sage-300">|</span>
          <h1 className="text-lg font-medium text-sage-500">Gentle Map</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm border border-sage-100 hover:bg-white transition-colors">
            <Search className="w-5 h-5 text-sage-400" />
          </button>
          <button className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full shadow-sm border border-sage-100 hover:bg-white transition-colors text-sm font-medium text-sage-500">
            My Groups
          </button>
        </div>
      </header>

      {/* Map Markers */}
      <MapMarker 
        top="30%" left="40%" 
        label="Quiet study group here" 
        icon={<Leaf className="w-5 h-5" />}
        avatars={3}
      />
      <MapMarker 
        top="65%" left="70%" 
        label="Cozy coffee chat" 
        icon={<Coffee className="w-5 h-5" />}
        avatars={2}
      />
      <MapMarker 
        top="60%" left="25%" 
        label="Low-key picnic" 
        icon={<Smile className="w-5 h-5" />}
        avatars={0}
      />

      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
        <div className="bg-white/70 backdrop-blur-xl border border-sage-100 rounded-[2.5rem] shadow-lg flex items-center p-4 gap-4">
          <button className="flex-1 text-center py-2 px-4 rounded-full bg-sage-100 text-sage-600 text-sm font-medium hover:bg-sage-200 transition-colors">
            Share Location
          </button>
          <div className="w-[1px] h-6 bg-sage-200" />
          <button className="p-2 text-sage-400 hover:text-sage-500 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

function MapMarker({ top, left, label, icon, avatars }: { top: string, left: string, label: string, icon: React.ReactNode, avatars: number }) {
  return (
    <div className="absolute z-10 group cursor-pointer" style={{ top, left }}>
      <div className="flex flex-col items-center">
        {avatars > 0 && (
          <div className="mb-3 flex -space-x-2 bg-white/90 p-1.5 rounded-full shadow-sm border border-sage-100">
            {[...Array(avatars)].map((_, i) => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/map${i+label}/50/50`} 
                alt="avatar" 
                className="w-6 h-6 rounded-full border-2 border-white"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        )}
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md border border-sage-50 transition-transform group-hover:scale-110">
          <div className="text-sage-400">{icon}</div>
        </div>
        <div className="mt-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-sage-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-sage-500 whitespace-nowrap">{label}</span>
        </div>
      </div>
    </div>
  );
}

function CommunitiesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="text-black">Find a Buddy</a>
            <a href="#" className="hover:text-black transition-colors">Shared Learning</a>
            <a href="#" className="hover:text-black transition-colors">Communities</a>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Post a Skill</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <section className="mb-16 text-left max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Learn something new, <br/><span className="text-indigo-600">together.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Connect with neighbors and students to trade skills. No money, just shared learning and community growth.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="relative flex-grow max-w-sm">
              <input 
                type="text" 
                className="w-full border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4" 
                placeholder="Search skills (e.g. Python, Pottery...)"
              />
            </div>
            <button className="bg-gray-100 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">Browse</button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard 
            name="Sarah Chen"
            role="Design Student • 2km away"
            canHelp={['UI/UX Design', 'Pottery']}
            wantsToLearn={['Python', 'Cooking']}
            avatar="https://picsum.photos/seed/sarah/100/100"
          />
          <SkillCard 
            name="Marcus Wright"
            role="Software Engineer • 5km away"
            canHelp={['Python', 'React']}
            wantsToLearn={['Guitar', 'Photography']}
            avatar="https://picsum.photos/seed/marcus/100/100"
          />
          <SkillCard 
            name="Elena Rossi"
            role="Chef • 1km away"
            canHelp={['Italian Cooking', 'Gardening']}
            wantsToLearn={['Web Basics', 'Yoga']}
            avatar="https://picsum.photos/seed/elena/100/100"
          />
          <SkillCard 
            name="Jordan Blake"
            role="Music Producer • 10km away"
            canHelp={['Audio Editing', 'Piano']}
            wantsToLearn={['Graphic Design']}
            avatar="https://picsum.photos/seed/jordanb/100/100"
          />
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-500" />
            </div>
            <h3 className="font-medium text-gray-900">Add your profile</h3>
            <p className="text-sm text-gray-500 mt-1">Join the community and start exchanging</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-100 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-400">© 2026 CampusPulse. Shared learning for everyone.</div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Community Guidelines</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function SkillCard({ name, role, canHelp, wantsToLearn, avatar }: { name: string, role: string, canHelp: string[], wantsToLearn: string[], avatar: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
      <div className="space-y-4 mb-6 flex-grow">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Can Help With</p>
          <div className="flex flex-wrap gap-2">
            {canHelp.map(s => <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">{s}</span>)}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Wants to Learn</p>
          <div className="flex flex-wrap gap-2">
            {wantsToLearn.map(s => <span key={s} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">{s}</span>)}
          </div>
        </div>
      </div>
      <button className="w-full py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition-all">Send Message</button>
    </div>
  );
}

function MessagesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex overflow-hidden text-slate-700"
    >
      {/* Inbox Sidebar */}
      <aside className="w-80 bg-slate-50 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-slate-800">CampusPulse</h1>
          <p className="text-xs text-slate-400 mt-1">Peaceful Messages</p>
          <div className="mt-6">
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-white border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-300 shadow-sm" 
                placeholder="Search conversations..."
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
          <div className="mb-4">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Messages</h3>
            <ChatListItem 
              name="Mia Thompson" 
              time="12m" 
              status="Open to a quick chat" 
              active 
              online 
              avatar="https://picsum.photos/seed/mia/100/100" 
            />
            <ChatListItem 
              name="Alex Chen" 
              time="2h" 
              status="Reading in the sun ☀️" 
              avatar="https://picsum.photos/seed/alexc/100/100" 
            />
            <ChatListItem 
              name="Jordan Riley" 
              time="5h" 
              status="Looking for coffee?" 
              avatar="https://picsum.photos/seed/jordanr/100/100" 
            />
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shared Interests</h3>
            <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Book Club</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-600">Plant Parents</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <img src="https://picsum.photos/seed/sam/100/100" alt="Sam" className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Sam Wilson</div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 bg-white flex flex-col relative">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2].map(i => (
                <img 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src={`https://picsum.photos/seed/book${i}/50/50`} 
                  alt="member"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Book Club</h2>
              <p className="text-[11px] text-slate-400">Discussing "The Midnight Library" this week</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-indigo-500 transition-colors"><Bell className="h-5 w-5" /></button>
            <button className="hover:text-indigo-500 transition-colors"><MoreVertical className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-slate-300 bg-white px-4">Monday, October 23</span>
          </div>

          <ChatMessage 
            name="Mia Thompson" 
            time="10:42 AM" 
            content="Hey everyone! Has anyone started chapter 4 of 'The Midnight Library' yet? The library metaphor is so cozy."
            avatar="https://picsum.photos/seed/mia/100/100"
          />
          <ChatMessage 
            name="Leo Garcia" 
            time="10:45 AM" 
            content="I'm about halfway through! It definitely makes me think about all the 'what ifs' in life. Perfect reading for a rainy day like today."
            avatar="https://picsum.photos/seed/leo/100/100"
          />
          <ChatMessage 
            name="You" 
            time="11:05 AM" 
            content="I just finished it! Would anyone be up for a coffee chat at the Student Union later today to discuss? ☕️"
            avatar="https://picsum.photos/seed/sam/100/100"
            isSelf
          />
          <ChatMessage 
            name="Mia Thompson" 
            time="11:08 AM" 
            content="I'd love that! I'm currently 'Open to a quick chat' as my status says haha. See you there around 4?"
            avatar="https://picsum.photos/seed/mia/100/100"
          />
        </div>

        <footer className="p-6 bg-white border-t border-slate-50">
          <div className="max-w-4xl mx-auto flex items-end gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><Plus className="h-6 w-6" /></button>
            <textarea 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0 resize-none placeholder-slate-400 max-h-32" 
              placeholder="Type a message..." 
              rows={1}
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"><Smile className="h-6 w-6" /></button>
              <button className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-3 italic">Shift + Enter for new line • Peaceful Messaging enabled</p>
        </footer>
      </div>

      {/* Info Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-100 hidden xl:flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="font-semibold text-slate-800 mb-6">Group Info</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">About</label>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                A quiet space for book lovers on campus. We meet every Friday afternoon for tea and discussion.
              </p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Upcoming Event</label>
              <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-500 block mb-1">THIS FRIDAY</span>
                <span className="text-xs font-semibold block">Midnight Library Discussion</span>
                <span className="text-[10px] text-slate-500 block">4:00 PM • Union Lounge</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shared Files (3)</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium truncate">reading_list_fall.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

function ChatListItem({ name, time, status, active, online, avatar }: { name: string, time: string, status: string, active?: boolean, online?: boolean, avatar: string }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all mb-2",
      active ? "bg-white shadow-sm border border-slate-100" : "hover:bg-slate-100"
    )}>
      <div className="relative">
        <img src={avatar} alt={name} className={cn("w-10 h-10 rounded-full", !online && "grayscale")} referrerPolicy="no-referrer" />
        {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-[10px] text-slate-400">{time}</span>
        </div>
        <p className={cn("text-xs text-slate-400 truncate", active && "italic")}>"{status}"</p>
      </div>
    </div>
  );
}

function ChatMessage({ name, time, content, avatar, isSelf }: { name: string, time: string, content: string, avatar: string, isSelf?: boolean }) {
  return (
    <div className={cn("flex items-start gap-4", isSelf ? "flex-row-reverse" : "max-w-2xl")}>
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full mt-1" referrerPolicy="no-referrer" />
      <div className={cn("space-y-1", isSelf && "items-end flex flex-col")}>
        <div className={cn("flex items-baseline gap-2", isSelf && "flex-row-reverse")}>
          <span className="text-sm font-semibold text-slate-700">{name}</span>
          <span className="text-[10px] text-slate-300">{time}</span>
        </div>
        <div className={cn(
          "p-4 rounded-2xl leading-relaxed text-sm shadow-sm",
          isSelf 
            ? "bg-indigo-600 text-white rounded-tr-none max-w-lg" 
            : "bg-indigo-50/50 text-slate-700 rounded-tl-none"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
}
