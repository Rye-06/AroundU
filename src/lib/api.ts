const DIRECT_BACKEND_FALLBACK_URL = 'http://localhost:3001';
const DEFAULT_API_BASE_URL = import.meta.env.DEV ? DIRECT_BACKEND_FALLBACK_URL : '/api';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
  message?: string;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  const isAbortError = (err: unknown) =>
    err instanceof DOMException
    && (err.name === 'AbortError' || err.name === 'TimeoutError');

  const perform = async (baseUrl: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      body: options.body,
      signal,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    let payload: ApiEnvelope<T> = {};
    if (text) {
      try {
        payload = JSON.parse(text) as ApiEnvelope<T>;
      } catch {
        payload = { error: text };
      }
    }

    if (!response.ok) {
      throw new Error(payload.error || `Request failed (${response.status})`);
    }

    return payload.data as T;
  };

  try {
    return await perform(API_BASE_URL);
  } catch (err) {
    if (isAbortError(err)) {
      throw err;
    }

    if (API_BASE_URL === '/api') {
      return perform(DIRECT_BACKEND_FALLBACK_URL);
    }

    throw err;
  }
}

function listResource<T>(resource: string, signal?: AbortSignal): Promise<T[]> {
  return request<T[]>(`/${resource}`, {}, signal).then((rows) => (Array.isArray(rows) ? rows : []));
}

function getResourceById<T>(resource: string, id: string, signal?: AbortSignal): Promise<T> {
  return request<T>(`/${resource}/${id}`, {}, signal);
}

function createResource<TResponse, TBody>(resource: string, body: TBody, signal?: AbortSignal): Promise<TResponse> {
  return request<TResponse>(
    `/${resource}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    signal
  );
}

function updateResource<TResponse, TBody>(
  resource: string,
  id: string,
  body: TBody,
  signal?: AbortSignal
): Promise<TResponse> {
  return request<TResponse>(
    `/${resource}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    signal
  );
}

function deleteResource(resource: string, id: string, signal?: AbortSignal): Promise<void> {
  return request<void>(
    `/${resource}/${id}`,
    {
      method: 'DELETE',
    },
    signal
  );
}

// -------- Events --------
export type ApiEventRecord = {
  id: string;
  host_user_id?: string;
  title: string;
  description?: string;
  event_type?: string;
  interest_tag?: string[];
  skill_level_required?: string;
  latitude?: number;
  longitude?: number;
  event_time?: string;
  max_participants?: number;
  created_at?: string;
};

export type CreateEventBody = Omit<ApiEventRecord, 'id' | 'created_at'>;
export type UpdateEventBody = Partial<CreateEventBody>;

export type CoordinatePoint = {
  latitude: number;
  longitude: number;
};

export type CreateEventSubmission = {
  host_user_id: string;
  title: string;
  description: string;
  event_type: string;
  interest_tag: string[];
  skill_level_required: string;
  latitude: number;
  longitude: number;
  event_time: string;
  max_participants: number;
  creator_location: CoordinatePoint | null;
};

export function toCreateEventBody(payload: CreateEventSubmission): CreateEventBody {
  return {
    host_user_id: payload.host_user_id,
    title: payload.title,
    description: payload.description,
    event_type: payload.event_type,
    interest_tag: payload.interest_tag,
    skill_level_required: payload.skill_level_required,
    latitude: payload.latitude,
    longitude: payload.longitude,
    event_time: payload.event_time,
    max_participants: payload.max_participants,
  };
}

export const getEvents = (signal?: AbortSignal) => listResource<ApiEventRecord>('events', signal);
export const getEventById = (id: string, signal?: AbortSignal) => getResourceById<ApiEventRecord>('events', id, signal);
export const createEvent = (body: CreateEventBody, signal?: AbortSignal) => createResource<ApiEventRecord, CreateEventBody>('events', body, signal);
export const updateEvent = (id: string, body: UpdateEventBody, signal?: AbortSignal) => updateResource<ApiEventRecord, UpdateEventBody>('events', id, body, signal);
export const deleteEvent = (id: string, signal?: AbortSignal) => deleteResource('events', id, signal);

// -------- Users --------
export type UserProfilePayload = {
  year_of_study?: number;
  major?: string;
  mbti?: string;
  mood?: string;
  fitness?: string;
  extroversion?: number;
  group_preference?: string;
  energy_level?: string;
};

export type ApiUserRecord = {
  id: string;
  name: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateUserAggregateBody = {
  name: string;
  bio?: string;
  profile?: UserProfilePayload;
  classes?: string[];
  clubs?: string[];
  interests?: string[];
};

export type CreateUserAggregateResponse = {
  id: string;
  name: string;
};

export const getUsers = (signal?: AbortSignal) => listResource<ApiUserRecord>('users', signal);
export const getUserById = (id: string, signal?: AbortSignal) => getResourceById<ApiUserRecord>('users', id, signal);
export const createUserAggregate = (body: CreateUserAggregateBody, signal?: AbortSignal) =>
  createResource<CreateUserAggregateResponse, CreateUserAggregateBody>('users', body, signal);
export const updateUser = (id: string, body: Partial<ApiUserRecord>, signal?: AbortSignal) =>
  updateResource<ApiUserRecord, Partial<ApiUserRecord>>('users', id, body, signal);
export const deleteUser = (id: string, signal?: AbortSignal) => deleteResource('users', id, signal);

// -------- Event Participants --------
export type EventParticipantRecord = {
  id: string;
  event_id: string;
  user_id: string;
  created_at?: string;
};

export type CreateEventParticipantBody = Omit<EventParticipantRecord, 'id' | 'created_at'>;

export const getEventParticipants = (signal?: AbortSignal) => listResource<EventParticipantRecord>('event-participants', signal);
export const getEventParticipantById = (id: string, signal?: AbortSignal) =>
  getResourceById<EventParticipantRecord>('event-participants', id, signal);
export const createEventParticipant = (body: CreateEventParticipantBody, signal?: AbortSignal) =>
  createResource<EventParticipantRecord, CreateEventParticipantBody>('event-participants', body, signal);
export const updateEventParticipant = (id: string, body: Partial<CreateEventParticipantBody>, signal?: AbortSignal) =>
  updateResource<EventParticipantRecord, Partial<CreateEventParticipantBody>>('event-participants', id, body, signal);
export const deleteEventParticipant = (id: string, signal?: AbortSignal) => deleteResource('event-participants', id, signal);

// -------- Recommendations --------
export type RecommendationRecord = {
  id: string;
  user_id?: string;
  recommended_user_id?: string;
  score?: number;
  reason?: string;
  created_at?: string;
  [key: string]: unknown;
};

export const getRecommendations = (signal?: AbortSignal) => listResource<RecommendationRecord>('recommendations', signal);
export const getRecommendationById = (id: string, signal?: AbortSignal) =>
  getResourceById<RecommendationRecord>('recommendations', id, signal);
export const createRecommendation = (body: Partial<RecommendationRecord>, signal?: AbortSignal) =>
  createResource<RecommendationRecord, Partial<RecommendationRecord>>('recommendations', body, signal);
export const updateRecommendation = (id: string, body: Partial<RecommendationRecord>, signal?: AbortSignal) =>
  updateResource<RecommendationRecord, Partial<RecommendationRecord>>('recommendations', id, body, signal);
export const deleteRecommendation = (id: string, signal?: AbortSignal) => deleteResource('recommendations', id, signal);

export type BuddyMatchRecord = {
  username: string;
  name: string;
  avatar: string;
  year: number | null;
  major: string;
  interests: string[];
  sharedClasses: string[];
  sharedClubs: string[];
  groupPreference: string;
  energyLevel: string;
  aiReason: string;
  rating: number;
  isTopMatch: boolean;
};

export const getBuddyMatches = (forName = 'Jennifer', signal?: AbortSignal) =>
  request<BuddyMatchRecord[]>(`/recommendations/buddy-matches-json?for=${encodeURIComponent(forName)}`, {}, signal).then(rows =>
    Array.isArray(rows) ? rows : []
  );

// -------- Interests --------
export type InterestRecord = {
  id: string;
  name: string;
  created_at?: string;
};

export const getInterests = (signal?: AbortSignal) => listResource<InterestRecord>('interests', signal);
export const getInterestById = (id: string, signal?: AbortSignal) => getResourceById<InterestRecord>('interests', id, signal);
export const createInterest = (body: { name: string }, signal?: AbortSignal) =>
  createResource<InterestRecord, { name: string }>('interests', body, signal);
export const updateInterest = (id: string, body: Partial<{ name: string }>, signal?: AbortSignal) =>
  updateResource<InterestRecord, Partial<{ name: string }>>('interests', id, body, signal);
export const deleteInterest = (id: string, signal?: AbortSignal) => deleteResource('interests', id, signal);

// -------- Chats --------
export type ApiChatRecord = {
  id: string;
  event_id?: string | null;
  created_at?: string;
};

export type CreateChatBody = Omit<ApiChatRecord, 'id' | 'created_at'>;
export type UpdateChatBody = Partial<CreateChatBody>;

export const getChats = (signal?: AbortSignal) => listResource<ApiChatRecord>('chats', signal);
export const getChatById = (id: string, signal?: AbortSignal) => getResourceById<ApiChatRecord>('chats', id, signal);
export const createChat = (body: CreateChatBody, signal?: AbortSignal) => createResource<ApiChatRecord, CreateChatBody>('chats', body, signal);
export const updateChat = (id: string, body: UpdateChatBody, signal?: AbortSignal) => updateResource<ApiChatRecord, UpdateChatBody>('chats', id, body, signal);
export const deleteChat = (id: string, signal?: AbortSignal) => deleteResource('chats', id, signal);

// -------- Messages --------
export type ApiMessageRecord = {
  id: string;
  chat_id?: string | null;
  sender_id?: string | null;
  content: string;
  created_at?: string;
};

export type CreateMessageBody = Omit<ApiMessageRecord, 'id' | 'created_at'>;
export type UpdateMessageBody = Partial<CreateMessageBody>;

export const getMessages = (signal?: AbortSignal) => listResource<ApiMessageRecord>('messages', signal);
export const getMessageById = (id: string, signal?: AbortSignal) => getResourceById<ApiMessageRecord>('messages', id, signal);
export const createMessage = (body: CreateMessageBody, signal?: AbortSignal) => createResource<ApiMessageRecord, CreateMessageBody>('messages', body, signal);
export const updateMessage = (id: string, body: UpdateMessageBody, signal?: AbortSignal) => updateResource<ApiMessageRecord, UpdateMessageBody>('messages', id, body, signal);
export const deleteMessage = (id: string, signal?: AbortSignal) => deleteResource('messages', id, signal);

// -------- Map Adapter --------
export type MapEventPayload = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  activityLevel?: 'quiet' | 'moderate' | 'high';
  groupSize?: 'small' | 'medium' | 'large';
  markerType?: 'event' | 'icebreaker' | string;
  attendees?: number;
  tags?: string[];
  lat?: number;
  lng?: number;
  preview?: string;
  [key: string]: unknown;
};

function toActivityLevel(eventType?: string): 'quiet' | 'moderate' | 'high' {
  const normalized = String(eventType || '').toLowerCase();
  if (normalized.includes('sports')) return 'high';
  if (normalized.includes('social')) return 'quiet';
  return 'moderate';
}

function toCategory(eventType?: string): string {
  const normalized = String(eventType || '').toLowerCase();
  if (normalized.includes('academic') || normalized.includes('study')) return 'Study';
  if (normalized.includes('sport')) return 'Sports';
  if (normalized.includes('social')) return 'Social';
  if (normalized.includes('music')) return 'Music';
  if (normalized.includes('food')) return 'Food';
  return eventType || 'Other';
}

function toMapEventPayload(event: ApiEventRecord): MapEventPayload {
  const category = toCategory(event.event_type);
  const preview = event.description?.slice(0, 96);

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category,
    activityLevel: toActivityLevel(event.event_type),
    groupSize: 'medium',
    attendees: 1,
    tags: event.interest_tag || [],
    lat: typeof event.latitude === 'number' ? event.latitude : undefined,
    lng: typeof event.longitude === 'number' ? event.longitude : undefined,
    preview,
    timeLeft: event.event_time,
    maxAttendees: event.max_participants,
  };
}

export async function fetchEventsForMap(signal?: AbortSignal): Promise<MapEventPayload[]> {
  const rows = await getEvents(signal);
  return rows.map((row) => toMapEventPayload(row));
}
