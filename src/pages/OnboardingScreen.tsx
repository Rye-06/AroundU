import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConstellationBackground } from '../components/ConstellationBackground';
import {
  ENERGY_OPTIONS,
  FITNESS_OPTIONS,
  GENDER_OPTIONS,
  GROUP_PREFERENCE_OPTIONS,
  INTEREST_OPTIONS,
  MBTI_OPTIONS,
  YEAR_OPTIONS,
  type EnergyLevel,
  type FitnessLevel,
  type GroupPreference,
} from '../lib/profile';

export type OnboardingPayload = {
  year_of_study: number;
  major: string;
  age: number;
  gender: string;
  mbti: string;
  fitness: FitnessLevel;
  interests: string[];
  class: string[];
  club: string[];
  personality: {
    extroversion: number;
    group_preference: GroupPreference;
    energy_level: EnergyLevel;
  };
};

const STEPS = [
  {
    title: 'Academic basics',
    subtitle: 'A quick snapshot helps us match schedules and campus context.',
  },
  {
    title: 'Identity basics',
    subtitle: 'Share what feels right for better social matching quality.',
  },
  {
    title: 'Lifestyle and activity',
    subtitle: 'Tell us your vibe so recommendations feel natural, not random.',
  },
  {
    title: 'Campus involvement',
    subtitle: 'Add classes and clubs so we can surface people and events nearby.',
  },
  {
    title: 'Social preferences',
    subtitle: 'Final step. Tune your comfort level so suggestions feel low-pressure.',
  },
] as const;

export function OnboardingScreen({ onComplete }: { onComplete: (payload: OnboardingPayload) => void }) {
  const [step, setStep] = useState(0);

  const [yearOfStudy, setYearOfStudy] = useState<number>(1);
  const [major, setMajor] = useState('');
  const [age, setAge] = useState<number>(19);

  const [gender, setGender] = useState('prefer_not_to_say');
  const [mbti, setMbti] = useState('ENFP');

  const [fitness, setFitness] = useState<FitnessLevel>('active');
  const [interests, setInterests] = useState<string[]>(['coding']);

  const [classes, setClasses] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);

  const [extroversion, setExtroversion] = useState(3);
  const [groupPreference, setGroupPreference] = useState<GroupPreference>('medium_group');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('moderate');

  const canProceed = useMemo(() => {
    if (step === 0) {
      return major.trim().length > 1 && age >= 16 && age <= 120;
    }

    if (step === 1) {
      return Boolean(gender) && Boolean(mbti);
    }

    if (step === 2) {
      return interests.length > 0;
    }

    if (step === 3) {
      return true;
    }

    return extroversion >= 1 && extroversion <= 5 && Boolean(groupPreference) && Boolean(energyLevel);
  }, [age, energyLevel, extroversion, gender, groupPreference, interests.length, major, mbti, step]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => (prev.includes(interest) ? prev.filter(item => item !== interest) : [...prev, interest]));
  };

  const handleNext = () => {
    if (!canProceed) {
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    onComplete({
      year_of_study: yearOfStudy,
      major: major.trim(),
      age,
      gender,
      mbti,
      fitness,
      interests,
      class: classes,
      club: clubs,
      personality: {
        extroversion,
        group_preference: groupPreference,
        energy_level: energyLevel,
      },
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 px-4 py-8">
      <ConstellationBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="mb-6 rounded-2xl border border-surface-200 bg-white/80 px-5 py-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Setup profile</p>
            <p className="text-xs text-ink-500">Step {step + 1} of {STEPS.length}</p>
          </div>
          <div className="flex gap-2">
            {STEPS.map((_, index) => (
              <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200">
                <motion.div
                  className="h-full rounded-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: index <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-surface-100 bg-white p-8 shadow-xl shadow-surface-200/40 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">{STEPS[step].title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{STEPS[step].subtitle}</p>

              <div className="mt-7 space-y-5">
                {step === 0 && (
                  <>
                    <div>
                      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">Year of study</label>
                      <select
                        value={yearOfStudy}
                        onChange={e => setYearOfStudy(Number(e.target.value))}
                        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                      >
                        {YEAR_OPTIONS.map(value => (
                          <option key={value} value={value}>
                            Year {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">Major</label>
                      <input
                        type="text"
                        value={major}
                        onChange={e => setMajor(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">Age</label>
                      <input
                        type="number"
                        value={age}
                        min={16}
                        max={120}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Gender</label>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {GENDER_OPTIONS.map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setGender(option)}
                            className={cn(
                              'btn-tactile btn-tactile-soft cursor-pointer rounded-2xl border px-3 py-2.5 text-sm font-medium capitalize',
                              gender === option
                                ? 'border-primary-300 bg-primary-50 text-primary-700'
                                : 'border-surface-200 bg-surface-50 text-ink-600 hover:border-primary-200',
                            )}
                          >
                            {option.replaceAll('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">MBTI</label>
                      <select
                        value={mbti}
                        onChange={e => setMbti(e.target.value)}
                        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                      >
                        {MBTI_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Fitness</label>
                      <div className="space-y-2.5">
                        {FITNESS_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFitness(option.value)}
                            className={cn(
                              'btn-tactile btn-tactile-soft w-full cursor-pointer rounded-2xl border p-3 text-left',
                              fitness === option.value
                                ? 'border-primary-300 bg-primary-50'
                                : 'border-surface-200 bg-surface-50 hover:border-primary-200',
                            )}
                          >
                            <p className="text-sm font-semibold text-ink-800">{option.label}</p>
                            <p className="text-xs text-ink-500">{option.hint}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Interests</label>
                      <p className="mb-2 ml-1 text-xs text-ink-400">Choose as many as you like. Add more later any time.</p>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={cn(
                              'btn-tactile btn-tactile-soft cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium',
                              interests.includes(interest)
                                ? 'border-primary-300 bg-primary-50 text-primary-700'
                                : 'border-surface-200 bg-surface-50 text-ink-600 hover:border-primary-200',
                            )}
                          >
                            {interests.includes(interest) && <Check className="-mt-0.5 mr-1 inline h-3 w-3" />}
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <TagEntry
                      label="Classes"
                      placeholder="Add a class code (e.g. CSC108)"
                      values={classes}
                      onChange={setClasses}
                    />

                    <TagEntry
                      label="Clubs"
                      placeholder="Add a club (e.g. AI Club)"
                      values={clubs}
                      onChange={setClubs}
                    />
                  </>
                )}

                {step === 4 && (
                  <>
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Extroversion ({extroversion}/5)</label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={extroversion}
                        onChange={e => setExtroversion(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-200 accent-primary-500"
                      />
                      <div className="mt-1 flex justify-between text-xs text-ink-400">
                        <span>Quiet energy</span>
                        <span>Outgoing energy</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Group preference</label>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {GROUP_PREFERENCE_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setGroupPreference(option.value)}
                            className={cn(
                              'btn-tactile btn-tactile-soft cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold',
                              groupPreference === option.value
                                ? 'border-primary-300 bg-primary-50 text-primary-700'
                                : 'border-surface-200 bg-surface-50 text-ink-600 hover:border-primary-200',
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 ml-1 block text-xs font-semibold text-ink-500">Energy level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {ENERGY_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setEnergyLevel(option.value)}
                            className={cn(
                              'btn-tactile btn-tactile-soft cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium',
                              energyLevel === option.value
                                ? 'border-primary-300 bg-primary-50 text-primary-700'
                                : 'border-surface-200 bg-surface-50 text-ink-600 hover:border-primary-200',
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-surface-100 pt-5">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-tactile btn-tactile-soft flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-medium text-ink-500 transition-colors hover:text-ink-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                'btn-tactile btn-tactile-solid group flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold',
                canProceed
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20 hover:bg-primary-600'
                  : 'cursor-not-allowed bg-surface-100 text-ink-400',
              )}
            >
              <span>{step === STEPS.length - 1 ? 'Finish setup' : 'Continue'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TagEntry({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const normalized = draft.trim();
    if (!normalized) {
      return;
    }

    if (values.includes(normalized)) {
      setDraft('');
      return;
    }

    onChange([...values, normalized]);
    setDraft('');
  };

  const removeTag = (target: string) => {
    onChange(values.filter(value => value !== target));
  };

  return (
    <div>
      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">{label}</label>
      <div className="rounded-2xl border border-surface-200 bg-surface-50 p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map(value => (
            <span key={value} className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
              {value}
              <button type="button" onClick={() => removeTag(value)} className="text-primary-500 hover:text-primary-700" aria-label={`Remove ${value}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder={placeholder}
            className="w-full border-none bg-transparent px-1 py-1.5 text-sm text-ink-700 outline-none placeholder:text-ink-400"
          />
          <button
            type="button"
            onClick={addTag}
            className="btn-tactile btn-tactile-soft inline-flex items-center gap-1 rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-200 hover:text-primary-700"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export type { OnboardingPayload };
