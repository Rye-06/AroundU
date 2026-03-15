import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Sparkles, UserRound } from 'lucide-react';
import { type AroundUAIProfile } from '../lib/profile';

type ProfileScreenProps = {
  profile: AroundUAIProfile;
  onEdit: () => void;
  onBack: () => void;
};

export function ProfileScreen({ profile, onEdit, onBack }: ProfileScreenProps) {
  const details = [
    { label: 'Year of study', value: `Year ${profile.user_profile.year_of_study}` },
    { label: 'Major', value: profile.user_profile.major },
    { label: 'Age', value: String(profile.user_profile.age) },
    { label: 'Gender', value: prettyLabel(profile.user_profile.gender) },
    { label: 'MBTI', value: profile.user_profile.mbti },
    { label: 'Fitness', value: prettyLabel(profile.user_profile.fitness) },
    { label: 'Current mood', value: prettyLabel(profile.user_profile.mood) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="h-full overflow-y-auto bg-surface-50 custom-scrollbar"
    >
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        <div className="rounded-[2rem] border border-surface-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Your AroundU profile</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">{profile.name}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
                We use this profile to make recommendations feel more human, relevant, and low-pressure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1 rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Lounge
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1 rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                <Pencil className="h-4 w-4" />
                Edit profile
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {details.map(item => (
              <div key={item.label} className="rounded-2xl border border-surface-100 bg-surface-50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-ink-800">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoListCard title="Classes" values={profile.user_profile.class} emptyLabel="No classes added yet" />
            <InfoListCard title="Clubs" values={profile.user_profile.club} emptyLabel="No clubs added yet" />
          </div>

          <div className="mt-3">
            <InfoListCard title="Interests" values={profile.user_profile.interests} emptyLabel="No interests added yet" />
          </div>

          <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Personality settings</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <StatPill label="Extroversion" value={`${profile.user_profile.personality.extroversion}/5`} />
              <StatPill label="Group preference" value={prettyLabel(profile.user_profile.personality.group_preference)} />
              <StatPill label="Energy level" value={prettyLabel(profile.user_profile.personality.energy_level)} />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-3 text-sm text-ink-600">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span>You can adjust this anytime in Edit Profile, including your classes, clubs, and social preferences.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoListCard({ title, values, emptyLabel }: { title: string; values: string[]; emptyLabel: string }) {
  return (
    <div className="rounded-2xl border border-surface-100 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</p>
      {values.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map(item => (
            <span key={`${title}-${item}`} className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-sm text-ink-400">
          <UserRound className="h-4 w-4" />
          <span>{emptyLabel}</span>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink-800">{value}</p>
    </div>
  );
}

function prettyLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
