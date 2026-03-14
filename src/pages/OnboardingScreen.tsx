import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConstellationBackground } from '../components/ConstellationBackground';

const INTERESTS = [
  'Study Groups', 'Coffee Chats', 'Fitness', 'Gaming', 'Music',
  'Art & Design', 'Photography', 'Cooking', 'Reading', 'Hiking',
  'Coding', 'Languages', 'Film', 'Board Games', 'Volunteering',
  'Dance', 'Yoga', 'Writing', 'Sports', 'Podcasts',
];

const COMFORT_LEVELS = [
  { id: 'small', label: 'Small groups', desc: '2–4 people, quiet hangs', emoji: '🫂' },
  { id: 'relaxed', label: 'Relaxed hangouts', desc: 'Casual, no agenda', emoji: '☕️' },
  { id: 'structured', label: 'Structured activities', desc: 'Events with a plan', emoji: '📋' },
];

const LOCATION_PREFS = [
  { id: 'campus', label: 'On campus', desc: 'Libraries, cafes, quads', icon: '🏫' },
  { id: 'nearby', label: 'Nearby off-campus', desc: 'Cafés, parks, co-working', icon: '🌳' },
  { id: 'anywhere', label: 'Anywhere works', desc: 'Open to all locations', icon: '🌍' },
];

const STEPS = [
  { title: "What are you into?", subtitle: "Pick a few things you enjoy. We'll help you find people who share them." },
  { title: "How do you like to hang out?", subtitle: "No wrong answers — this helps us suggest the right vibes." },
  { title: "Where do you like to be?", subtitle: "We'll show you what's happening in places you're comfortable." },
];

export type OnboardingData = {
  interests: string[];
  comfort: string[];
  location: string;
};

export function OnboardingScreen({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedComfort, setSelectedComfort] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  console.log(selectedInterests);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleComfort = (id: string) => {
    setSelectedComfort(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canProceed = step === 0
    ? selectedInterests.length >= 2
    : step === 1
    ? selectedComfort.length >= 1
    : selectedLocation !== '';

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete({
        interests: selectedInterests,
        comfort: selectedComfort,
        location: selectedLocation
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center relative overflow-hidden px-4">
      <ConstellationBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-6 px-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full bg-surface-200 overflow-hidden">
              <motion.div
                className="h-full bg-primary-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-surface-200/40 border border-surface-100 p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold text-ink-900 tracking-tight">{STEPS[step].title}</h2>
              <p className="text-sm text-ink-500 mt-2 mb-8 leading-relaxed">{STEPS[step].subtitle}</p>

              {/* Step 1: Interests */}
              {step === 0 && (
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                        selectedInterests.includes(interest)
                          ? "bg-primary-50 border-primary-300 text-primary-700 shadow-sm"
                          : "bg-surface-50 border-surface-200 text-ink-600 hover:border-primary-200 hover:bg-primary-50/50"
                      )}
                    >
                      {selectedInterests.includes(interest) && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                      {interest}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Comfort Level */}
              {step === 1 && (
                <div className="space-y-3">
                  {COMFORT_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => toggleComfort(level.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
                        selectedComfort.includes(level.id)
                          ? "bg-primary-50 border-primary-300 shadow-sm"
                          : "bg-surface-50 border-surface-200 hover:border-primary-200"
                      )}
                    >
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm text-ink-800">{level.label}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{level.desc}</p>
                      </div>
                      {selectedComfort.includes(level.id) && (
                        <Check className="w-4 h-4 text-primary-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Location */}
              {step === 2 && (
                <div className="space-y-3">
                  {LOCATION_PREFS.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
                        selectedLocation === loc.id
                          ? "bg-primary-50 border-primary-300 shadow-sm"
                          : "bg-surface-50 border-surface-200 hover:border-primary-200"
                      )}
                    >
                      <span className="text-2xl">{loc.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-ink-800">{loc.label}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{loc.desc}</p>
                      </div>
                      {selectedLocation === loc.id && (
                        <Check className="w-4 h-4 text-primary-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 group",
                canProceed
                  ? "bg-primary-500 hover:bg-primary-600 text-white shadow-sm shadow-primary-500/20"
                  : "bg-surface-100 text-ink-400 cursor-not-allowed"
              )}
            >
              <span>{step === 2 ? "Let's go" : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
