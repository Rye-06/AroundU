import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Compass, LocateFixed, MapPin, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { FieldGroup } from '../components/FieldGroup';
import EventLocationPickerMap from '../components/map/EventLocationPickerMap';
import { AnimatedSelect } from '../components/AnimatedSelect';
import {
  createEvent,
  toCreateEventBody,
  type CoordinatePoint,
  type CreateEventSubmission,
} from '../lib/api';

type CreateEventScreenProps = {
  hostUserId: string;
  onEventPosted?: (payload: CreateEventSubmission & { id?: string }) => void;
};

const EVENT_TYPE_OPTIONS = [
  'Study',
  'Social',
  'Sports',
  'Food',
  'Music',
  'Other',
];

const SKILL_LEVEL_OPTIONS = [
  { value: 'all_levels', label: 'All levels' },
  { value: 'beginner', label: 'Beginner friendly' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const INTEREST_OPTIONS = [
  'study-group',
  'coffee-chat',
  'volleyball',
  'gym',
  'anime',
  'coding',
  'music',
  'basketball',
  'foodie',
  'gaming',
  'networking',
  'wellness',
];

function isValidCoordinate(value: number, type: 'lat' | 'lng') {
  if (!Number.isFinite(value)) {
    return false;
  }

  if (type === 'lat') {
    return value >= -90 && value <= 90;
  }

  return value >= -180 && value <= 180;
}

const STARTS_IN_OPTIONS = [
  { value: 5, label: '5m' },
  { value: 10, label: '10m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
  { value: 120, label: '2h' },
];

function toLabel(tag: string) {
  return tag
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function CreateEventScreen({ hostUserId, onEventPosted }: CreateEventScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [interestTag, setInterestTag] = useState<string[]>([]);
  const [skillLevelRequired, setSkillLevelRequired] = useState('all_levels');
  const [startsInMinutes, setStartsInMinutes] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(6);

  const [creatorLocation, setCreatorLocation] = useState<CoordinatePoint | null>(null);
  const [creatorLocationStatus, setCreatorLocationStatus] = useState<'pending' | 'ready' | 'denied' | 'unavailable'>('pending');

  const [meetupLocation, setMeetupLocation] = useState<CoordinatePoint | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setCreatorLocationStatus('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCreatorLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setCreatorLocationStatus('ready');
      },
      () => {
        setCreatorLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 120000,
        timeout: 12000,
      },
    );
  }, []);

  const toggleInterest = (value: string) => {
    setInterestTag(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      }
      return [...prev, value];
    });
  };

  const setMeetupFromCoordinate = (coordinate: CoordinatePoint, nextLabel?: string) => {
    setMeetupLocation(coordinate);
    if (nextLabel) {
      setLocationLabel(nextLabel);
    }
    setErrorMessage('');
  };

  const handleSearchLocation = async () => {
    const query = locationSearch.trim();
    if (!query) {
      return;
    }

    const googleMaps = (window as Window & { google?: any }).google;

    if (!googleMaps?.maps?.Geocoder) {
      setErrorMessage('Place search is unavailable right now. Try selecting directly on the map.');
      return;
    }

    setSearchingLocation(true);
    setErrorMessage('');

    try {
      const geocoder = new googleMaps.maps.Geocoder();
      const result = await geocoder.geocode({ address: query });
      const first = result.results?.[0];

      if (!first?.geometry?.location) {
        setErrorMessage('No matching location found. Try a different search or click the map.');
        return;
      }

      setMeetupFromCoordinate(
        {
          latitude: first.geometry.location.lat(),
          longitude: first.geometry.location.lng(),
        },
        first.formatted_address,
      );
    } catch {
      setErrorMessage('Could not search this location right now. Try selecting on the map.');
    } finally {
      setSearchingLocation(false);
    }
  };

  const eventTimeIso = useMemo(() => {
    const future = new Date(Date.now() + startsInMinutes * 60 * 1000);
    return future.toISOString();
  }, [startsInMinutes]);

  const canSubmit = useMemo(() => {
    if (!hostUserId || !title.trim() || !description.trim() || !eventType || !eventTimeIso) {
      return false;
    }

    if (!meetupLocation) {
      return false;
    }

    if (!isValidCoordinate(meetupLocation.latitude, 'lat') || !isValidCoordinate(meetupLocation.longitude, 'lng')) {
      return false;
    }

    return maxParticipants >= 2;
  }, [description, eventTimeIso, eventType, maxParticipants, meetupLocation, title]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setEventType('');
    setInterestTag([]);
    setSkillLevelRequired('all_levels');
    setStartsInMinutes(30);
    setMaxParticipants(6);
    setMeetupLocation(null);
    setLocationSearch('');
    setLocationLabel('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (!hostUserId) {
      setErrorMessage('Missing user id. Please sign in again so we can attach this event to your account.');
      return;
    }

    if (!eventTimeIso) {
      setErrorMessage('Please set a valid event time.');
      return;
    }

    if (!meetupLocation) {
      setErrorMessage('Please select a meetup location before posting.');
      return;
    }

    if (!isValidCoordinate(meetupLocation.latitude, 'lat') || !isValidCoordinate(meetupLocation.longitude, 'lng')) {
      setErrorMessage('Meetup location coordinates are invalid. Please select a valid point.');
      return;
    }

    const submission: CreateEventSubmission = {
      host_user_id: hostUserId,
      title: title.trim(),
      description: description.trim(),
      event_type: eventType,
      interest_tag: interestTag,
      skill_level_required: skillLevelRequired,
      latitude: meetupLocation.latitude,
      longitude: meetupLocation.longitude,
      event_time: eventTimeIso,
      max_participants: maxParticipants,
      creator_location: creatorLocation,
    };

    try {
      setSubmitting(true);
      setErrorMessage('');

      const createdEvent = await createEvent(toCreateEventBody(submission));
      onEventPosted?.({
        ...submission,
        id: createdEvent?.id,
      });
      setSubmitted(true);
      clearForm();
      window.setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setErrorMessage('Unable to create event right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative h-full overflow-y-auto custom-scrollbar"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10 md:px-8 md:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Host an event</h2>
          <p className="mt-2 text-sm font-medium text-ink-500">Create once, map cleanly to the events schema, and send nearby invites.</p>
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
            >
              <Check className="h-5 w-5" />
              <p className="text-sm font-semibold">Event created and payload mapped successfully.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {!hostUserId && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              We could not find your saved user id yet. Complete sign in/onboarding to post events.
            </div>
          )}

          <FieldGroup label="Title" required>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Morning Study Sprint"
              className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3.5 text-sm text-ink-800 placeholder:text-ink-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </FieldGroup>

          <FieldGroup label="Description" required>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Share what attendees should expect."
              className="w-full resize-none rounded-xl border border-surface-200 bg-white px-4 py-3.5 text-sm text-ink-800 placeholder:text-ink-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FieldGroup label="Event type" required>
              <AnimatedSelect
                value={eventType}
                onChange={setEventType}
                placeholder="Select event type"
                options={[
                  { value: '', label: 'Select event type' },
                  ...EVENT_TYPE_OPTIONS.map(option => ({ value: option, label: option })),
                ]}
              />
            </FieldGroup>

            <FieldGroup label="Skill level required" required>
              <AnimatedSelect
                value={skillLevelRequired}
                onChange={setSkillLevelRequired}
                options={SKILL_LEVEL_OPTIONS.map(option => ({ value: option.value, label: option.label }))}
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Interest tags" hint="Select relevant tags for matching.">
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleInterest(option)}
                  className={cn(
                    'btn-tactile btn-tactile-soft rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                    interestTag.includes(option)
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-surface-200 bg-white text-ink-600 hover:border-primary-200',
                  )}
                >
                  {interestTag.includes(option) && <Check className="-mt-0.5 mr-1 inline h-3 w-3" />}
                  {toLabel(option)}
                </button>
              ))}
            </div>
          </FieldGroup>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FieldGroup label="Event time" required hint="Choose when this event should start.">
              <div className="grid grid-cols-3 gap-2">
                {STARTS_IN_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStartsInMinutes(option.value)}
                    className={cn(
                      'btn-tactile btn-tactile-soft rounded-xl border px-3 py-2.5 text-xs font-semibold',
                      startsInMinutes === option.value
                        ? 'border-primary-300 bg-primary-50 text-primary-700'
                        : 'border-surface-200 bg-white text-ink-600 hover:border-primary-200',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Max participants" required>
              <div className="rounded-xl border border-surface-200 bg-white px-3 py-2">
                <input
                  type="number"
                  min={2}
                  max={100}
                  step={1}
                  value={maxParticipants}
                  onChange={e => {
                    const nextValue = Number(e.target.value);
                    if (Number.isNaN(nextValue)) {
                      return;
                    }

                    setMaxParticipants(Math.min(100, Math.max(1, Math.floor(nextValue))));
                  }}
                  onBlur={e => {
                    const nextValue = Number(e.target.value);
                    if (Number.isNaN(nextValue) || nextValue < 2) {
                      setMaxParticipants(2);
                      return;
                    }

                    setMaxParticipants(Math.min(100, Math.floor(nextValue)));
                  }}
                  className="w-full rounded-lg bg-surface-50 px-3 py-2.5 text-center text-lg font-semibold text-primary-600 outline-none transition focus:bg-white"
                />
              </div>
            </FieldGroup>
          </div>

          <FieldGroup label="Meetup location" required hint="Search any place on Google Maps or click directly on the map.">
            <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleSearchLocation();
                      }
                    }}
                    placeholder="Search any address or place"
                    className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-ink-700 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleSearchLocation()}
                  disabled={searchingLocation || !locationSearch.trim()}
                  className="btn-tactile btn-tactile-soft rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm font-semibold text-ink-600"
                >
                  {searchingLocation ? 'Searching...' : 'Find'}
                </button>
              </div>

              <EventLocationPickerMap
                selectedLocation={meetupLocation}
                onLocationSelect={coordinate => setMeetupFromCoordinate(coordinate, 'Map selected location')}
                className="h-[240px]"
              />

              <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-xs text-ink-600">
                <div className="flex items-center gap-2 font-semibold text-ink-700">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span>Meetup selection status</span>
                </div>
                {meetupLocation ? (
                  <div className="mt-1 space-y-1">
                    <p>{locationLabel || 'Custom meetup coordinate selected'}</p>
                    <p>
                      Lat {meetupLocation.latitude.toFixed(6)} | Lng {meetupLocation.longitude.toFixed(6)}
                    </p>
                    <p className="text-ink-500">Tap another map point anytime to adjust before posting.</p>
                  </div>
                ) : (
                  <p className="mt-1 text-ink-500">No meetup location selected yet.</p>
                )}
              </div>
            </div>
          </FieldGroup>

          <FieldGroup label="Creator location status" hint="Captured once when this screen opens. Not requested again on submit.">
            <div className="rounded-xl border border-surface-200 bg-white p-3 text-sm text-ink-600">
              {creatorLocationStatus === 'ready' && creatorLocation && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ink-700">
                    <LocateFixed className="h-4 w-4 text-primary-500" />
                    <span className="font-semibold">Captured</span>
                  </div>
                  <p>
                    Lat {creatorLocation.latitude.toFixed(6)} | Lng {creatorLocation.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {creatorLocationStatus === 'pending' && (
                <div className="flex items-center gap-2 text-ink-500">
                  <Compass className="h-4 w-4" />
                  <span>Trying to capture creator location...</span>
                </div>
              )}

              {(creatorLocationStatus === 'denied' || creatorLocationStatus === 'unavailable') && (
                <div className="flex items-center gap-2 text-ink-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Creator location unavailable. Event can still be posted with creator_location = null.</span>
                </div>
              )}
            </div>
          </FieldGroup>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="btn-tactile btn-tactile-solid w-full rounded-2xl bg-primary-500 py-4 text-sm font-bold text-white shadow-sm shadow-primary-500/20 transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? 'Posting event...' : 'Create event'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
