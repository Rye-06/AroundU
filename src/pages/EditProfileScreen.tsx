import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

const ALL_INTERESTS = [
  'Study Groups', 'Coffee Chats', 'Fitness', 'Gaming', 'Music',
  'Art & Design', 'Photography', 'Cooking', 'Reading', 'Hiking',
  'Coding', 'Languages', 'Film', 'Board Games', 'Volunteering',
  'Dance', 'Yoga', 'Writing', 'Sports', 'Podcasts',
];

const COMFORT_OPTIONS = [
  { id: 'small', label: 'Small groups', emoji: '🫂' },
  { id: 'relaxed', label: 'Relaxed hangouts', emoji: '☕️' },
  { id: 'structured', label: 'Structured activities', emoji: '📋' },
];

export function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('Alex Rivers');
  const [bio, setBio] = useState('CS student who loves late-night study sessions and pickup basketball. Always looking for new people to grab coffee with.');
  const [interests, setInterests] = useState(['Study Groups', 'Coffee Chats', 'Fitness', 'Gaming', 'Coding']);
  const [comfort, setComfort] = useState(['small', 'relaxed']);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleComfort = (id: string) => {
    setComfort(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto custom-scrollbar bg-surface-50"
    >
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm shadow-primary-500/20"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-surface-100 shadow-sm p-8 space-y-8">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <img
                src="https://picsum.photos/seed/alex/200/200"
                alt="Profile"
                className="w-24 h-24 rounded-full ring-4 ring-surface-50 shadow-md group-hover:ring-primary-200 transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5 ml-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5 ml-1">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-4 py-3.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all resize-none"
            />
            <p className="text-xs text-ink-400 mt-1 ml-1">{bio.length}/200</p>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-3 ml-1">Interests</label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                    interests.includes(interest)
                      ? "bg-primary-50 border-primary-300 text-primary-700"
                      : "bg-surface-50 border-surface-200 text-ink-500 hover:border-primary-200"
                  )}
                >
                  {interests.includes(interest) && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Comfort Level */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-3 ml-1">Comfort level</label>
            <div className="space-y-2">
              {COMFORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleComfort(opt.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left text-sm",
                    comfort.includes(opt.id)
                      ? "bg-primary-50 border-primary-300"
                      : "bg-surface-50 border-surface-200 hover:border-primary-200"
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="font-medium text-ink-700">{opt.label}</span>
                  {comfort.includes(opt.id) && <Check className="w-4 h-4 text-primary-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
