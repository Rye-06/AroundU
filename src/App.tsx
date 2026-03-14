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
  ArrowRight,
  CalendarPlus,
  Clock,
  MapPin,
  Tag,
  UserPlus,
  X,
  ChevronDown,
  Zap,
  Music,
  Dumbbell,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Screen = 'lounge' | 'map' | 'communities' | 'messages' | 'create';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('lounge');

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Sidebar */}
      {currentScreen !== 'map' && (
        <aside className="w-20 md:w-64 bg-primary-50 border-r border-primary-100 flex flex-col h-full shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary-600 hidden md:block">CampusPulse</h1>
            <div className="md:hidden w-8 h-8 bg-primary-500 rounded-full mx-auto" />
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
              label="Create Event"
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

          <div className="p-4 border-t border-primary-100">
            <div className="flex items-center space-x-3 p-2">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Alex Rivers" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-ink-800">Alex Rivers</p>
                <p className="text-xs text-ink-500">Online now</p>
              </div>
            </div>
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
          ? "bg-white text-primary-600 shadow-sm" 
          : "text-ink-500 hover:bg-white/50"
      )}
    >
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );
}

// --- SCREENS ---

function LoungeScreen({ onCreateEvent }: { onCreateEvent: () => void }) {
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

function FeedItem({ name, time, content, avatar, action }: { name: string, time: string, content: string, avatar: string, action: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-ink-800">{name}</span>
            <span className="text-xs text-ink-400">{time}</span>
          </div>
          <p className="mt-1 text-ink-600">{content}</p>
          <div className="mt-4">
            <button className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs border border-primary-100 hover:bg-primary-100 transition-colors font-medium">
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ title, desc, tags, members, color, icon }: { title: string, desc: string, tags: string[], members: number, color: 'indigo' | 'coral', icon: React.ReactNode }) {
  const bgColor = color === 'indigo' ? 'bg-primary-50/60' : 'bg-coral-50/60';
  const borderColor = color === 'indigo' ? 'border-primary-200' : 'border-coral-100';
  const iconColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';

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
          <div className={cn("w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-medium ring-2 ring-white", color === 'indigo' ? 'bg-primary-200 text-primary-700' : 'bg-coral-100 text-coral-500')}>
            +{members}
          </div>
        </div>
      </div>
      <h4 className="mt-4 font-semibold text-ink-800">{title}</h4>
      <p className="text-sm text-ink-600 mt-1">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={cn("text-[10px] px-2 py-0.5 bg-white/70 rounded-full border uppercase tracking-wider font-medium", borderColor)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function NearbyEvent({ status, title, location, color }: { status: string, title: string, location: string, color: 'indigo' | 'coral' }) {
  const dotColor = color === 'indigo' ? 'bg-primary-500' : 'bg-coral-500';
  const textColor = color === 'indigo' ? 'text-primary-500' : 'text-coral-500';

  return (
    <div className="group bg-white p-4 rounded-2xl border border-surface-200 hover:border-primary-200 transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <span className={cn("text-xs font-bold uppercase tracking-widest", textColor)}>{status}</span>
      </div>
      <p className="mt-2 text-ink-800 font-semibold">{title}</p>
      <p className="text-xs text-ink-500 mt-1">{location}</p>
    </div>
  );
}

// --- CREATE EVENT SCREEN ---

const eventCategories = [
  { value: 'study', label: 'Study', icon: BookOpen, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'social', label: 'Social', icon: Coffee, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { value: 'sports', label: 'Sports', icon: Dumbbell, color: 'bg-green-50 text-green-600 border-green-100' },
  { value: 'food', label: 'Food', icon: Utensils, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { value: 'music', label: 'Music', icon: Music, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'other', label: 'Other', icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const campusLocations = [
  { building: 'Bahen Centre', rooms: ['Room 2230', 'Room 3200', 'Lobby', 'Atrium'] },
  { building: 'Robarts Library', rooms: ['4th Floor', '8th Floor', 'Reading Room', 'Café'] },
  { building: 'Hart House', rooms: ['Great Hall', 'Café', 'Music Room', 'Common Room'] },
  { building: 'Sidney Smith Hall', rooms: ['Room 1070', 'Room 2125', 'Lobby'] },
  { building: 'Student Union', rooms: ['2nd Floor Lounge', 'Meeting Room A', 'Courtyard'] },
  { building: 'Athletic Centre', rooms: ['Court 1', 'Court 3', 'Pool Level', 'Track'] },
  { building: 'Outdoor', rooms: ['King\'s College Circle', 'Front Campus', 'Queen\'s Park', 'Philosopher\'s Walk'] },
];

const durations = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hrs' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

function CreateEventScreen() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    building: '',
    room: '',
    customLocation: '',
    duration: 30,
    maxAttendees: 5,
    tags: [] as string[],
    startsIn: 'now',
  });
  const [tagInput, setTagInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const selectedBuilding = campusLocations.find(l => l.building === form.building);

  function updateForm(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim()) && form.tags.length < 5) {
      updateForm('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    updateForm('tags', form.tags.filter(t => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const locationDisplay = form.building 
    ? `${form.building}${form.room ? ` · ${form.room}` : ''}`
    : form.customLocation || 'Choose a location';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-ink-900">Create an Event</h2>
          <p className="text-ink-500 mt-2">Set it up and ping nearby people to join.</p>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-400/20 text-emerald-500 rounded-2xl flex items-center gap-3"
            >
              <Check className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">Event created!</p>
                <p className="text-xs opacity-80">Pinging 12 people nearby…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Name */}
          <FieldGroup label="Event Name" required>
            <input
              type="text"
              value={form.title}
              onChange={e => updateForm('title', e.target.value)}
              placeholder="e.g. Coffee & Cram for CSC108"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-surface-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
            />
          </FieldGroup>

          {/* Category */}
          <FieldGroup label="Category" required>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {eventCategories.map(cat => {
                const Icon = cat.icon;
                const isSelected = form.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateForm('category', cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
                      isSelected 
                        ? "border-primary-400 bg-primary-50 text-primary-600 scale-[1.03] shadow-sm" 
                        : cn("border-transparent", cat.color, "hover:border-surface-300")
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          {/* Description */}
          <FieldGroup label="What's the plan?">
            <textarea
              value={form.description}
              onChange={e => updateForm('description', e.target.value)}
              placeholder="Give people a quick idea of what to expect…"
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-surface-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all resize-none"
            />
          </FieldGroup>

          {/* Location */}
          <FieldGroup label="Location" required>
            <button
              type="button"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white border text-sm transition-all",
                form.building || form.customLocation
                  ? "border-primary-200 text-ink-800"
                  : "border-surface-200 text-ink-400"
              )}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{locationDisplay}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-ink-400 transition-transform", showLocationPicker && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showLocationPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-white border border-surface-200 rounded-xl space-y-4">
                    {/* Building Grid */}
                    <div>
                      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2.5 block">Building</label>
                      <div className="grid grid-cols-2 gap-2">
                        {campusLocations.map(loc => (
                          <button
                            key={loc.building}
                            type="button"
                            onClick={() => updateForm('building', form.building === loc.building ? '' : loc.building)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                              form.building === loc.building
                                ? "bg-primary-500 text-white border-primary-500"
                                : "bg-surface-50 text-ink-600 border-surface-200 hover:border-primary-200"
                            )}
                          >
                            {loc.building}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Selector */}
                    {selectedBuilding && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2.5 block">
                          Specific Area
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedBuilding.rooms.map(room => (
                            <button
                              key={room}
                              type="button"
                              onClick={() => updateForm('room', form.room === room ? '' : room)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                form.room === room
                                  ? "bg-primary-100 text-primary-700 border-primary-200"
                                  : "bg-surface-50 text-ink-500 border-surface-200 hover:border-primary-200"
                              )}
                            >
                              {room}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Custom Location */}
                    <div className="pt-3 border-t border-surface-200">
                      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2 block">Or type a custom location</label>
                      <input
                        type="text"
                        value={form.customLocation}
                        onChange={e => { updateForm('customLocation', e.target.value); updateForm('building', ''); updateForm('room', ''); }}
                        placeholder="e.g. The bench by the fountain"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-200 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FieldGroup>

          {/* Timing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Time */}
            <FieldGroup label="Starts">
              <div className="flex gap-2">
                {['now', '15min', '30min', '1hr'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateForm('startsIn', opt)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      form.startsIn === opt
                        ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                        : "bg-white text-ink-600 border-surface-200 hover:border-primary-200"
                    )}
                  >
                    {opt === 'now' ? 'Now' : opt === '15min' ? '15m' : opt === '30min' ? '30m' : '1h'}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Duration */}
            <FieldGroup label="Duration">
              <div className="grid grid-cols-3 gap-2">
                {durations.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => updateForm('duration', d.value)}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      form.duration === d.value
                        ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                        : "bg-white text-ink-600 border-surface-200 hover:border-primary-200"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>

          {/* Max Attendees */}
          <FieldGroup label="Max People">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => updateForm('maxAttendees', Math.max(2, form.maxAttendees - 1))}
                className="w-10 h-10 rounded-full bg-white border border-surface-200 text-ink-600 text-lg font-bold hover:border-primary-200 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-3xl font-bold text-primary-500 w-10 text-center">{form.maxAttendees}</span>
              <button
                type="button"
                onClick={() => updateForm('maxAttendees', Math.min(50, form.maxAttendees + 1))}
                className="w-10 h-10 rounded-full bg-white border border-surface-200 text-ink-600 text-lg font-bold hover:border-primary-200 transition-colors flex items-center justify-center"
              >
                +
              </button>
              <span className="text-xs text-ink-400 ml-2">people max</span>
            </div>
          </FieldGroup>

          {/* Tags */}
          <FieldGroup label="Tags" hint="Add up to 5 tags to help people find your event">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                placeholder="e.g. chill, midterm-prep, newbies-welcome"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2.5 bg-surface-100 text-ink-600 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium border border-primary-100">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FieldGroup>

          {/* Location Info */}
          <div className="p-4 bg-surface-100 rounded-xl flex items-center gap-3 text-sm text-ink-500">
            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
            <span>Your proximity will be shared with attendees so they can find you.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title.trim() || !form.category}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all duration-200 active:scale-[0.98] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Event & Ping Nearby
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function FieldGroup({ label, required, hint, children }: { label: string, required?: boolean, hint?: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-baseline gap-1 text-xs font-semibold text-ink-600 uppercase tracking-wider mb-2.5">
        {label}
        {required && <span className="text-coral-400">*</span>}
      </label>
      {hint && <p className="text-xs text-ink-400 -mt-1 mb-2.5">{hint}</p>}
      {children}
    </div>
  );
}

// --- MAP SCREEN ---

const mapEvents = [
  {
    id: 'study1',
    title: 'Group Study — CSC108',
    description: 'Cramming for the midterm together. Bring your notes and laptop. We have snacks! Everyone welcome, no matter your level.',
    location: 'Bahen Centre, Room 2230',
    category: 'Study',
    host: 'Jordan Chen',
    attendees: 3,
    maxAttendees: 8,
    timeLeft: '45 mins left',
    photo: 'https://picsum.photos/seed/studygroup/600/400',
    icon: BookOpen,
    top: '30%',
    left: '40%',
  },
  {
    id: 'coffee1',
    title: 'Coffee & Chat Meetup',
    description: 'Just grabbing a coffee and looking for some company. Open conversation — talk about anything from courses to weekend plans.',
    location: 'Hart House Café',
    category: 'Social',
    host: 'Maya Patel',
    attendees: 2,
    maxAttendees: 5,
    timeLeft: 'Starts in 30 min',
    photo: 'https://picsum.photos/seed/coffeechat/600/400',
    icon: Coffee,
    top: '65%',
    left: '70%',
  },
  {
    id: 'sports1',
    title: 'Pickup Basketball',
    description: 'Need a couple more for 3v3. All skill levels welcome — we\'re here to have fun, not compete. Court 3 is booked for the next hour.',
    location: 'Athletic Centre, Court 3',
    category: 'Sports',
    host: 'Marcus Wright',
    attendees: 4,
    maxAttendees: 6,
    timeLeft: 'Starts in 1 hour',
    photo: 'https://picsum.photos/seed/basketball/600/400',
    icon: Dumbbell,
    top: '55%',
    left: '25%',
  },
];

function MapScreen({ onBack, onCreateEvent, onGoToMessages }: { onBack: () => void, onCreateEvent: () => void, onGoToMessages: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const activeEvent = mapEvents.find(e => e.id === selectedEvent);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-primary-50 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-200 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-coral-100 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-surface-200 flex items-center space-x-2">
          <button onClick={onBack} className="text-ink-500 hover:text-ink-800 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <span className="text-surface-300">|</span>
          <h1 className="text-lg font-semibold text-ink-600">Campus Map</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm border border-surface-200 hover:bg-white transition-colors">
            <Search className="w-5 h-5 text-ink-400" />
          </button>
        </div>
      </header>

      {/* Map Markers */}
      {mapEvents.map(event => {
        const Icon = event.icon;
        return (
          <div 
            key={event.id}
            className="absolute z-10 group cursor-pointer"
            style={{ top: event.top, left: event.left }}
            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
          >
            <div className="flex flex-col items-center">
              {event.attendees > 0 && (
                <div className="mb-3 flex -space-x-2 bg-white/90 p-1.5 rounded-full shadow-sm border border-surface-200">
                  {[...Array(Math.min(event.attendees, 3))].map((_, i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/map${i}${event.id}/50/50`} 
                      alt="avatar" 
                      className="w-6 h-6 rounded-full border-2 border-white"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              )}
              <div className={cn(
                "w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border transition-all duration-200",
                selectedEvent === event.id 
                  ? "border-primary-400 scale-110 shadow-lg shadow-primary-200" 
                  : "border-primary-100 group-hover:scale-110"
              )}>
                <div className="text-primary-400"><Icon className="w-5 h-5" /></div>
              </div>
              <div className={cn(
                "mt-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-surface-200 shadow-sm transition-all",
                selectedEvent === event.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <span className="text-xs font-semibold text-ink-700 whitespace-nowrap">{event.title}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating Create Event Button */}
      <button
        onClick={onCreateEvent}
        className="absolute bottom-28 right-6 z-20 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-xl shadow-primary-300 flex items-center justify-center transition-all duration-200 active:scale-95 hover:scale-105"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Event Detail Slideover */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            key={activeEvent.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="absolute bottom-6 left-6 right-6 z-20 max-w-md mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-surface-200 overflow-hidden">
              {/* Event Photo */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={activeEvent.photo} 
                  alt={activeEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    {activeEvent.category}
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-ink-900">{activeEvent.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-500">
                  <MapPin className="w-3.5 h-3.5 text-primary-400" />
                  <span>{activeEvent.location}</span>
                  <span className="text-surface-300">·</span>
                  <Clock className="w-3.5 h-3.5 text-coral-400" />
                  <span>{activeEvent.timeLeft}</span>
                </div>

                <p className="mt-3 text-sm text-ink-600 leading-relaxed">{activeEvent.description}</p>

                {/* Host & Attendees */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://picsum.photos/seed/${activeEvent.host.toLowerCase().replace(' ', '')}/50/50`}
                      alt={activeEvent.host}
                      className="w-7 h-7 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs text-ink-600">
                      Hosted by <strong>{activeEvent.host}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activeEvent.attendees}/{activeEvent.maxAttendees}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3">
                  <button 
                    onClick={() => { setSelectedEvent(null); onGoToMessages(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-md shadow-primary-200 transition-all active:scale-[0.98] text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Join Group Chat
                  </button>
                  <button className="px-4 py-3 bg-surface-100 hover:bg-surface-200 text-ink-600 font-semibold rounded-xl transition-colors text-sm">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
        <div className="bg-white/70 backdrop-blur-xl border border-surface-200 rounded-[2.5rem] shadow-lg flex items-center p-4 gap-4">
          <button className="flex-1 text-center py-2 px-4 rounded-full bg-primary-100 text-primary-600 text-sm font-medium hover:bg-primary-200 transition-colors">
            Share Location
          </button>
          <div className="w-[1px] h-6 bg-surface-200" />
          <button className="p-2 text-ink-400 hover:text-ink-600 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

// --- COMMUNITIES SCREEN (updated colors) ---

function CommunitiesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-medium text-ink-500">
            <a href="#" className="text-ink-900">Find a Buddy</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Shared Learning</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Communities</a>
          </div>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm">Post a Skill</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <section className="mb-16 text-left max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-ink-900 mb-4">
            Learn something new, <br/><span className="text-primary-500">together.</span>
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed">
            Connect with students to trade skills. No money, just shared learning and community growth.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="relative flex-grow max-w-sm">
              <input 
                type="text" 
                className="w-full border border-surface-200 rounded-lg focus:ring-primary-400 focus:border-primary-400 py-3 px-4 text-sm" 
                placeholder="Search skills (e.g. Python, Pottery...)"
              />
            </div>
            <button className="bg-surface-100 px-6 py-3 rounded-lg font-medium hover:bg-surface-200 transition-all text-sm">Browse</button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard 
            name="Sarah Chen"
            role="Design Student · 2km away"
            canHelp={['UI/UX Design', 'Pottery']}
            wantsToLearn={['Python', 'Cooking']}
            avatar="https://picsum.photos/seed/sarah/100/100"
          />
          <SkillCard 
            name="Marcus Wright"
            role="Software Engineer · 5km away"
            canHelp={['Python', 'React']}
            wantsToLearn={['Guitar', 'Photography']}
            avatar="https://picsum.photos/seed/marcus/100/100"
          />
          <SkillCard 
            name="Elena Rossi"
            role="Chef · 1km away"
            canHelp={['Italian Cooking', 'Gardening']}
            wantsToLearn={['Web Basics', 'Yoga']}
            avatar="https://picsum.photos/seed/elena/100/100"
          />
          <SkillCard 
            name="Jordan Blake"
            role="Music Producer · 10km away"
            canHelp={['Audio Editing', 'Piano']}
            wantsToLearn={['Graphic Design']}
            avatar="https://picsum.photos/seed/jordanb/100/100"
          />
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-300 transition-colors">
            <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center mb-4 group-hover:bg-primary-50">
              <Plus className="w-6 h-6 text-ink-400 group-hover:text-primary-500" />
            </div>
            <h3 className="font-medium text-ink-800">Add your profile</h3>
            <p className="text-sm text-ink-500 mt-1">Join the community and start exchanging</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-surface-200 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-ink-400">© 2026 CampusPulse. Shared learning for everyone.</div>
          <div className="flex gap-8 text-sm text-ink-500">
            <a href="#" className="hover:text-ink-900">Privacy Policy</a>
            <a href="#" className="hover:text-ink-900">Terms of Service</a>
            <a href="#" className="hover:text-ink-900">Community Guidelines</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function SkillCard({ name, role, canHelp, wantsToLearn, avatar }: { name: string, role: string, canHelp: string[], wantsToLearn: string[], avatar: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-200 hover:border-primary-200 transition-colors flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
        <div>
          <h3 className="font-semibold text-ink-800">{name}</h3>
          <p className="text-xs text-ink-400">{role}</p>
        </div>
      </div>
      <div className="space-y-4 mb-6 flex-grow">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400 mb-2">Can Help With</p>
          <div className="flex flex-wrap gap-2">
            {canHelp.map(s => <span key={s} className="px-2 py-0.5 rounded bg-primary-50 text-primary-600 text-xs font-medium">{s}</span>)}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400 mb-2">Wants to Learn</p>
          <div className="flex flex-wrap gap-2">
            {wantsToLearn.map(s => <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-500 text-xs font-medium">{s}</span>)}
          </div>
        </div>
      </div>
      <button className="w-full py-2 border border-surface-200 rounded-lg text-sm font-medium hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all">Send Message</button>
    </div>
  );
}

// --- MESSAGES SCREEN (updated colors) ---

function MessagesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex overflow-hidden text-ink-700"
    >
      <aside className="w-80 bg-surface-50 border-r border-surface-200 flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-ink-800">Messages</h1>
          <p className="text-xs text-ink-400 mt-1">Stay connected</p>
          <div className="mt-6">
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-white border border-surface-200 rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary-200 transition-all placeholder-ink-400 shadow-sm" 
                placeholder="Search conversations..."
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-ink-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
          <div className="mb-4">
            <h3 className="px-3 text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">Direct Messages</h3>
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
            <h3 className="px-3 text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">Groups</h3>
            <div className="flex items-center gap-3 p-3 hover:bg-surface-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ink-700">Book Club</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-surface-100 rounded-2xl cursor-pointer transition-colors mb-1">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center text-coral-500">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ink-700">Campus Runners</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-surface-200 flex items-center gap-3">
          <img src="https://picsum.photos/seed/sam/100/100" alt="Sam" className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Sam Wilson</div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
            </div>
          </div>
          <button className="text-ink-400 hover:text-ink-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-white flex flex-col relative">
        <header className="h-16 border-b border-surface-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
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
              <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-100 flex items-center justify-center text-[10px] font-bold text-ink-500">+12</div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-800">Book Club</h2>
              <p className="text-[11px] text-ink-400">Discussing "The Midnight Library" this week</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-ink-400">
            <button className="hover:text-primary-500 transition-colors"><Bell className="h-5 w-5" /></button>
            <button className="hover:text-primary-500 transition-colors"><MoreVertical className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-ink-400 bg-white px-4">Monday, October 23</span>
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
            content="I'd love that! See you there around 4?"
            avatar="https://picsum.photos/seed/mia/100/100"
          />
        </div>

        <footer className="p-6 bg-white border-t border-surface-100">
          <div className="max-w-4xl mx-auto flex items-end gap-4 bg-surface-50 p-2 rounded-2xl border border-surface-200">
            <button className="p-2 text-ink-400 hover:text-primary-500 transition-colors"><Plus className="h-6 w-6" /></button>
            <textarea 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0 resize-none placeholder-ink-400 max-h-32" 
              placeholder="Type a message..." 
              rows={1}
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-2 text-ink-400 hover:text-primary-500 transition-colors"><Smile className="h-6 w-6" /></button>
              <button className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-200">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      <aside className="w-72 bg-white border-l border-surface-200 hidden xl:flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="font-semibold text-ink-800 mb-6">Group Info</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">About</label>
              <p className="mt-2 text-xs text-ink-600 leading-relaxed">
                A quiet space for book lovers on campus. We meet every Friday afternoon for tea and discussion.
              </p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Upcoming Event</label>
              <div className="mt-2 p-3 bg-primary-50 rounded-xl border border-primary-100">
                <span className="text-[10px] font-bold text-primary-500 block mb-1">THIS FRIDAY</span>
                <span className="text-xs font-semibold block">Midnight Library Discussion</span>
                <span className="text-[10px] text-ink-500 block">4:00 PM · Union Lounge</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Shared Files (3)</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 p-2 hover:bg-surface-50 rounded-lg cursor-pointer">
                  <div className="w-8 h-8 bg-coral-50 text-coral-500 rounded flex items-center justify-center">
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
      active ? "bg-white shadow-sm border border-surface-200" : "hover:bg-surface-100"
    )}>
      <div className="relative">
        <img src={avatar} alt={name} className={cn("w-10 h-10 rounded-full", !online && "grayscale")} referrerPolicy="no-referrer" />
        {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-[10px] text-ink-400">{time}</span>
        </div>
        <p className={cn("text-xs text-ink-400 truncate", active && "italic")}>"{status}"</p>
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
          <span className="text-sm font-semibold text-ink-700">{name}</span>
          <span className="text-[10px] text-ink-400">{time}</span>
        </div>
        <div className={cn(
          "p-4 rounded-2xl leading-relaxed text-sm shadow-sm",
          isSelf 
            ? "bg-primary-500 text-white rounded-tr-none max-w-lg" 
            : "bg-primary-50/50 text-ink-700 rounded-tl-none"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
}
