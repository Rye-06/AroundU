import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  ENERGY_OPTIONS,
  FITNESS_OPTIONS,
  GENDER_OPTIONS,
  GROUP_PREFERENCE_OPTIONS,
  INTEREST_OPTIONS,
  MBTI_OPTIONS,
  YEAR_OPTIONS,
  type AroundUAIProfile,
  type EnergyLevel,
  type FitnessLevel,
  type GroupPreference,
} from '../lib/profile';
import { AnimatedSelect } from '../components/AnimatedSelect';

type EditProfileScreenProps = {
  profile: AroundUAIProfile;
  onBack: () => void;
  onSave: (profile: AroundUAIProfile) => void;
};

export function EditProfileScreen({ profile, onBack, onSave }: EditProfileScreenProps) {
  const [name, setName] = useState(profile.name);
  const [yearOfStudy, setYearOfStudy] = useState(profile.user_profile.year_of_study);
  const [major, setMajor] = useState(profile.user_profile.major);
  const [age, setAge] = useState(profile.user_profile.age);
  const [gender, setGender] = useState(profile.user_profile.gender);
  const [mbti, setMbti] = useState(profile.user_profile.mbti);
  const [fitness, setFitness] = useState<FitnessLevel>(profile.user_profile.fitness);
  const [classes, setClasses] = useState<string[]>(profile.user_profile.class);
  const [clubs, setClubs] = useState<string[]>(profile.user_profile.club);
  const [interests, setInterests] = useState<string[]>(profile.user_profile.interests);
  const [extroversion, setExtroversion] = useState(profile.user_profile.personality.extroversion);
  const [groupPreference, setGroupPreference] = useState<GroupPreference>(profile.user_profile.personality.group_preference);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(profile.user_profile.personality.energy_level);

  const canSave = useMemo(() => {
    return (
      name.trim().length > 1
      && major.trim().length > 1
      && age >= 16
      && age <= 120
      && mbti.trim().length > 0
      && interests.length > 0
      && extroversion >= 1
      && extroversion <= 5
    );
  }, [age, extroversion, interests.length, major, mbti, name]);

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      name: name.trim(),
      user_profile: {
        ...profile.user_profile,
        year_of_study: yearOfStudy,
        major: major.trim(),
        age,
        gender,
        mbti,
        fitness,
        class: classes,
        club: clubs,
        interests,
        personality: {
          extroversion,
          group_preference: groupPreference,
          energy_level: energyLevel,
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="h-full overflow-y-auto bg-surface-50 custom-scrollbar"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              canSave
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'cursor-not-allowed bg-surface-100 text-ink-400',
            )}
          >
            <Check className="h-4 w-4" />
            Save changes
          </button>
        </div>

        <div className="space-y-4">
          <SectionCard title="Basics" subtitle="Identity and academic details.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" value={name} onChange={setName} placeholder="Your name" />
              <NumberSelect
                label="Year of study"
                value={yearOfStudy}
                options={YEAR_OPTIONS}
                onChange={setYearOfStudy}
                format={option => `Year ${option}`}
              />
              <TextField label="Major" value={major} onChange={setMajor} placeholder="Computer Science" />
              <NumberField label="Age" value={age} onChange={setAge} min={16} max={120} />

              <SelectField label="Gender" value={gender} onChange={setGender} options={GENDER_OPTIONS} format={option => option.replaceAll('_', ' ')} />
              <SelectField label="MBTI" value={mbti} onChange={setMbti} options={MBTI_OPTIONS} />
            </div>
          </SectionCard>

          <SectionCard title="Lifestyle" subtitle="Adjust how active and social recommendations should feel.">
            <div>
              <p className="mb-2 ml-1 text-xs font-semibold text-ink-500">Fitness</p>
              <div className="space-y-2">
                {FITNESS_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFitness(option.value)}
                    className={cn(
                      'w-full rounded-2xl border p-3 text-left transition-all',
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

            <div className="mt-4">
              <p className="mb-2 ml-1 text-xs font-semibold text-ink-500">Interests</p>
              <TagPicker values={interests} options={INTEREST_OPTIONS} onChange={setInterests} />
            </div>
          </SectionCard>

          <SectionCard title="Campus context" subtitle="Classes and clubs help us suggest relevant people and meetups.">
            <TagEditor label="Classes" values={classes} placeholder="Add class code" onChange={setClasses} />
            <div className="mt-4" />
            <TagEditor label="Clubs" values={clubs} placeholder="Add club" onChange={setClubs} />
          </SectionCard>

          <SectionCard title="Personality settings" subtitle="Fine-tune your social pace.">
            <div>
              <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">Extroversion ({extroversion}/5)</label>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={extroversion}
                onChange={e => setExtroversion(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-200 accent-primary-500"
              />
            </div>

            <div className="mt-4">
              <p className="mb-2 ml-1 text-xs font-semibold text-ink-500">Group preference</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {GROUP_PREFERENCE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGroupPreference(option.value)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
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

            <div className="mt-4">
              <p className="mb-2 ml-1 text-xs font-semibold text-ink-500">Energy level</p>
              <div className="grid grid-cols-3 gap-2">
                {ENERGY_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEnergyLevel(option.value)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm font-medium transition-all',
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
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-surface-100 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-ink-700 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
      />
    </div>
  );
}

function NumberSelect({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  format?: (option: number) => string;
}) {
  return (
    <div>
      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">{label}</label>
      <AnimatedSelect
        value={String(value)}
        onChange={next => onChange(Number(next))}
        options={options.map(option => ({ value: String(option), label: format ? format(option) : String(option) }))}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  format?: (option: string) => string;
}) {
  return (
    <div>
      <label className="mb-1.5 ml-1 block text-xs font-semibold text-ink-500">{label}</label>
      <AnimatedSelect
        value={value}
        onChange={onChange}
        options={options.map(option => ({ value: option, label: format ? format(option) : option }))}
      />
    </div>
  );
}

function TagPicker({
  values,
  options,
  onChange,
}: {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter(item => item !== option));
      return;
    }

    onChange([...values, option]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => toggle(option)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
            values.includes(option)
              ? 'border-primary-300 bg-primary-50 text-primary-700'
              : 'border-surface-200 bg-surface-50 text-ink-600 hover:border-primary-200',
          )}
        >
          {values.includes(option) && <Check className="-mt-0.5 mr-1 inline h-3 w-3" />}
          {option}
        </button>
      ))}
    </div>
  );
}

function TagEditor({
  label,
  values,
  placeholder,
  onChange,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const normalized = draft.trim();
    if (!normalized || values.includes(normalized)) {
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
            className="inline-flex items-center gap-1 rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-200 hover:text-primary-700"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
