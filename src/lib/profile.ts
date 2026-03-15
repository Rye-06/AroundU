export type GroupPreference = 'solo' | 'small_group' | 'medium_group' | 'large_group';
export type EnergyLevel = 'low' | 'moderate' | 'high';
export type FitnessLevel = 'inactive' | 'lightly_active' | 'active' | 'very_active';
export type MoodOption = 'energetic' | 'relaxed' | 'stressed' | 'social' | 'focused' | 'tired';

export type UserProfileData = {
  year_of_study: number;
  major: string;
  age: number;
  gender: string;
  mbti: string;
  mood: MoodOption;
  fitness: FitnessLevel;
  class: string[];
  club: string[];
  personality: {
    extroversion: number;
    group_preference: GroupPreference;
    energy_level: EnergyLevel;
  };
  interests: string[];
};

export type AroundUAIProfile = {
  name: string;
  user_profile: UserProfileData;
};

export const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6];

export const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export const GENDER_OPTIONS = [
  'female',
  'male',
  'non-binary',
  'prefer_not_to_say',
];

export const FITNESS_OPTIONS: Array<{ value: FitnessLevel; label: string; hint: string }> = [
  { value: 'inactive', label: 'Mostly low-key', hint: 'Rest-focused and chill days' },
  { value: 'lightly_active', label: 'Lightly active', hint: 'Walks and occasional activity' },
  { value: 'active', label: 'Active', hint: 'Regular workouts or sports' },
  { value: 'very_active', label: 'Very active', hint: 'High-energy routine most days' },
];

export const INTEREST_OPTIONS = [
  'volleyball',
  'gym',
  'anime',
  'coding',
  'coffee chats',
  'study groups',
  'basketball',
  'music',
  'photography',
  'hiking',
  'gaming',
  'design',
  'movies',
  'cooking',
  'running',
  'reading',
];

export const GROUP_PREFERENCE_OPTIONS: Array<{ value: GroupPreference; label: string }> = [
  { value: 'solo', label: 'Solo' },
  { value: 'small_group', label: 'Small group' },
  { value: 'medium_group', label: 'Medium group' },
  { value: 'large_group', label: 'Large group' },
];

export const ENERGY_OPTIONS: Array<{ value: EnergyLevel; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
];

export const MOOD_OPTIONS: Array<{ value: MoodOption; label: string; glyph: string }> = [
  { value: 'energetic', label: 'Energetic', glyph: 'E' },
  { value: 'relaxed', label: 'Relaxed', glyph: 'R' },
  { value: 'stressed', label: 'Stressed', glyph: 'S' },
  { value: 'social', label: 'Social', glyph: 'C' },
  { value: 'focused', label: 'Focused', glyph: 'F' },
  { value: 'tired', label: 'Tired', glyph: 'T' },
];

export const DEFAULT_AI_PROFILE: AroundUAIProfile = {
  name: 'Alex Rivers',
  user_profile: {
    year_of_study: 1,
    major: 'Computer Science',
    age: 19,
    gender: 'prefer_not_to_say',
    mbti: 'ENFP',
    mood: 'focused',
    fitness: 'active',
    class: ['CSC108', 'MAT137'],
    club: ['AI Club'],
    personality: {
      extroversion: 3,
      group_preference: 'medium_group',
      energy_level: 'moderate',
    },
    interests: ['coding', 'coffee chats'],
  },
};

export function applyProfilePatch(
  profile: AroundUAIProfile,
  updates: Partial<AroundUAIProfile> & {
    user_profile?: Partial<UserProfileData> & {
      personality?: Partial<UserProfileData['personality']>;
    };
  },
): AroundUAIProfile {
  return {
    ...profile,
    ...updates,
    user_profile: {
      ...profile.user_profile,
      ...updates.user_profile,
      personality: {
        ...profile.user_profile.personality,
        ...updates.user_profile?.personality,
      },
    },
  };
}
