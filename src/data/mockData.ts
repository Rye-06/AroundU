import { BookOpen, Coffee, Dumbbell, Utensils, Zap, Music } from 'lucide-react';

export const eventCategories = [
  { value: 'study', label: 'Study', icon: BookOpen, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'social', label: 'Social', icon: Coffee, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { value: 'sports', label: 'Sports', icon: Dumbbell, color: 'bg-green-50 text-green-600 border-green-100' },
  { value: 'food', label: 'Food', icon: Utensils, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { value: 'music', label: 'Music', icon: Music, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'other', label: 'Other', icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

export const campusLocations = [
  { building: 'Bahen Centre', rooms: ['Room 2230', 'Room 3200', 'Lobby', 'Atrium'] },
  { building: 'Robarts Library', rooms: ['4th Floor', '8th Floor', 'Reading Room', 'Café'] },
  { building: 'Hart House', rooms: ['Great Hall', 'Café', 'Music Room', 'Common Room'] },
  { building: 'Sidney Smith Hall', rooms: ['Room 1070', 'Room 2125', 'Lobby'] },
  { building: 'Student Union', rooms: ['2nd Floor Lounge', 'Meeting Room A', 'Courtyard'] },
  { building: 'Athletic Centre', rooms: ['Court 1', 'Court 3', 'Pool Level', 'Track'] },
  { building: 'Outdoor', rooms: ['King\'s College Circle', 'Front Campus', 'Queen\'s Park', 'Philosopher\'s Walk'] },
];

export const durations = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hrs' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

export const mapEvents = [
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
    tags: ['Quiet', 'CSC108', 'Snacks'],
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
    tags: ['Chill', 'Conversation', 'Open'],
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
    tags: ['Active', 'Beginner Friendly', '3v3'],
    icon: Dumbbell,
    top: '55%',
    left: '25%',
  },
];

export const mapIcebreakers = [
  {
    id: 'ice1',
    author: 'Leo Garcia',
    message: 'Anyone else procrastinating right now? 😅',
    avatar: 'https://picsum.photos/seed/leo/50/50',
    top: '40%',
    left: '60%',
  },
  {
    id: 'ice2',
    author: 'Mia Thompson',
    message: 'Looking for a study buddy for the Econ midterm!',
    avatar: 'https://picsum.photos/seed/mia/50/50',
    top: '20%',
    left: '30%',
  },
  {
    id: 'ice3',
    author: 'Sam Wilson',
    message: 'Who wants to grab food at the Student Union? Hungry.',
    avatar: 'https://picsum.photos/seed/sam/50/50',
    top: '75%',
    left: '40%',
  }
];
