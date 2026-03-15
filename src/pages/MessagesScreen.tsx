import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, MoreVertical, Plus, Smile, Check, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../components/ChatMessage';
import { ConstellationBackground } from '../components/ConstellationBackground';
import {
  createChat,
  createMessage,
  getChats,
  getEventParticipants,
  getEvents,
  getMessages,
  type ApiChatRecord,
  type ApiEventRecord,
  type ApiMessageRecord,
  type EventParticipantRecord,
} from '../lib/api';

type MessagesScreenProps = {
  preferredEventId?: string | null;
  onPreferredEventHandled?: () => void;
  currentUserId: string | null;
  currentUserName: string;
  currentUserAvatar: string;
};

const LIVE_POLL_MS = 4000;

export function MessagesScreen({
  preferredEventId = null,
  onPreferredEventHandled,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: MessagesScreenProps) {
  const [events, setEvents] = useState<ApiEventRecord[]>([]);
  const [participants, setParticipants] = useState<EventParticipantRecord[]>([]);
  const [chats, setChats] = useState<ApiChatRecord[]>([]);
  const [messages, setMessages] = useState<ApiMessageRecord[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const creatingChatByEvent = useRef<Map<string, Promise<ApiChatRecord>>>(new Map());

  const joinedEventIds = useMemo(() => {
    if (!currentUserId) {
      return new Set<string>();
    }

    return new Set(
      participants
        .filter(entry => entry.user_id === currentUserId)
        .map(entry => entry.event_id),
    );
  }, [currentUserId, participants]);

  const joinedEvents = useMemo(() => {
    return events.filter(event => joinedEventIds.has(event.id));
  }, [events, joinedEventIds]);

  const eventChatByEventId = useMemo(() => {
    const map = new Map<string, ApiChatRecord>();

    chats.forEach(chat => {
      if (chat.event_id && !map.has(chat.event_id)) {
        map.set(chat.event_id, chat);
      }
    });

    return map;
  }, [chats]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) {
      return null;
    }

    return joinedEvents.find(event => event.id === selectedEventId) ?? null;
  }, [joinedEvents, selectedEventId]);

  const selectedChat = useMemo(() => {
    if (!selectedEventId) {
      return null;
    }

    return eventChatByEventId.get(selectedEventId) ?? null;
  }, [eventChatByEventId, selectedEventId]);

  const activeMessages = useMemo(() => {
    if (!selectedChat?.id) {
      return [];
    }

    return messages
      .filter(message => message.chat_id === selectedChat.id)
      .sort((a, b) => {
        const left = a.created_at ? new Date(a.created_at).getTime() : 0;
        const right = b.created_at ? new Date(b.created_at).getTime() : 0;
        return left - right;
      });
  }, [messages, selectedChat]);

  const eventRows = useMemo(() => {
    return joinedEvents.map(event => {
      const chat = eventChatByEventId.get(event.id);
      const latestMessage = chat
        ? messages
          .filter(message => message.chat_id === chat.id)
          .sort((a, b) => {
            const left = a.created_at ? new Date(a.created_at).getTime() : 0;
            const right = b.created_at ? new Date(b.created_at).getTime() : 0;
            return right - left;
          })[0]
        : undefined;

      return {
        event,
        chat,
        latestMessage,
      };
    });
  }, [eventChatByEventId, joinedEvents, messages]);

  const loadLiveData = async (silent = false) => {
    if (!currentUserId) {
      setEvents([]);
      setParticipants([]);
      setChats([]);
      setMessages([]);
      return;
    }

    try {
      if (!silent) {
        setIsLoading(true);
      }

      const [nextParticipants, nextEvents, nextChats, nextMessages] = await Promise.all([
        getEventParticipants(),
        getEvents(),
        getChats(),
        getMessages(),
      ]);

      setParticipants(nextParticipants);
      setEvents(nextEvents);
      setChats(nextChats);
      setMessages(nextMessages);
      setErrorMessage('');
    } catch {
      setErrorMessage('Unable to sync messages right now.');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      if (!isMounted) {
        return;
      }
      await loadLiveData(false);
    };

    void initialLoad();

    const interval = window.setInterval(() => {
      void loadLiveData(true);
    }, LIVE_POLL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!joinedEvents.length) {
      setSelectedEventId(null);
      return;
    }

    if (preferredEventId && joinedEvents.some(event => event.id === preferredEventId)) {
      setSelectedEventId(preferredEventId);
      onPreferredEventHandled?.();
      return;
    }

    if (!selectedEventId || !joinedEvents.some(event => event.id === selectedEventId)) {
      setSelectedEventId(joinedEvents[0].id);
    }
  }, [joinedEvents, onPreferredEventHandled, preferredEventId, selectedEventId]);

  const formatAgo = (value?: string) => {
    if (!value) {
      return 'now';
    }

    const parsed = new Date(value).getTime();
    if (!Number.isFinite(parsed)) {
      return 'now';
    }

    const diffMinutes = Math.max(1, Math.floor((Date.now() - parsed) / 60000));
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const formatClock = (value?: string) => {
    if (!value) {
      return 'Now';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Now';
    }

    return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const ensureChatForEvent = async (eventId: string) => {
    const existing = eventChatByEventId.get(eventId);
    if (existing) {
      return existing;
    }

    const inFlight = creatingChatByEvent.current.get(eventId);
    if (inFlight) {
      return inFlight;
    }

    const nextPromise = createChat({ event_id: eventId });
    creatingChatByEvent.current.set(eventId, nextPromise);

    try {
      const created = await nextPromise;
      setChats(prev => {
        if (prev.some(chat => chat.id === created.id)) {
          return prev;
        }

        return [...prev, created];
      });
      return created;
    } finally {
      creatingChatByEvent.current.delete(eventId);
    }
  };

  const handleSend = async () => {
    const nextContent = messageDraft.trim();
    if (!selectedEventId || !currentUserId || !nextContent || isSending) {
      return;
    }

    try {
      setIsSending(true);
      const chat = await ensureChatForEvent(selectedEventId);
      const created = await createMessage({
        chat_id: chat.id,
        sender_id: currentUserId,
        content: nextContent,
      });

      setMessages(prev => [...prev, created]);
      setMessageDraft('');
      setErrorMessage('');
    } catch {
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-full overflow-hidden text-ink-700"
    >
      <aside className="relative z-10 flex w-80 shrink-0 flex-col border-r border-surface-200 bg-surface-50">
        <div className="p-6">
          <h1 className="text-xl font-bold text-ink-800">Messages</h1>
          <p className="mt-1 text-xs text-ink-400">Joined event chats • Live sync every 4s</p>
          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 text-sm shadow-sm transition-all placeholder-ink-400 focus:ring-2 focus:ring-primary-200"
                placeholder="Search joined event chats..."
                disabled
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-6">
          <div>
            <h3 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-ink-400">Joined Events</h3>

            {eventRows.map(({ event, latestMessage }) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEventId(event.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                  event.id === selectedEventId ? 'border border-primary-100 bg-primary-50' : 'hover:bg-surface-100'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink-700">{event.title}</span>
                  <span className="block truncate text-[10px] text-ink-400">
                    {(latestMessage?.content || 'No messages yet').slice(0, 34)} • {formatAgo(latestMessage?.created_at || event.created_at)}
                  </span>
                </div>
              </button>
            ))}

            {!isLoading && eventRows.length === 0 && (
              <div className="rounded-xl border border-surface-200 bg-white p-3 text-xs text-ink-500">
                No joined event chats yet. Join an event on the map to start messaging.
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="relative z-0 flex flex-1 flex-col bg-white">
        <ConstellationBackground />

        <header className="z-10 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-100 text-[10px] font-bold text-ink-500">
              {selectedEvent ? 'EV' : '--'}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-800">{selectedEvent?.title || 'Select an event chat'}</h2>
              <p className="text-[11px] text-ink-400">
                {selectedEvent ? `Event id ${selectedEvent.id.slice(0, 8)} • Live updates` : 'Join an event from map to chat here'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-ink-400">
            <button className="transition-colors hover:text-primary-500"><Bell className="h-5 w-5" /></button>
            <button className="transition-colors hover:text-primary-500"><MoreVertical className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>
          )}

          {isLoading && (
            <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-sm text-ink-500">Loading joined chats...</div>
          )}

          <div className="flex items-center justify-center">
            <span className="bg-white px-4 text-[11px] uppercase tracking-widest text-ink-400">Today</span>
          </div>

          {activeMessages.map(message => {
            const isSelf = Boolean(currentUserId && message.sender_id === currentUserId);
            return (
              <div key={message.id}>
                <ChatMessage
                  name={isSelf ? 'You' : `User ${message.sender_id?.slice(0, 8) ?? 'guest'}`}
                  time={formatClock(message.created_at)}
                  content={message.content}
                  avatar={isSelf ? currentUserAvatar : `https://picsum.photos/seed/${encodeURIComponent(message.sender_id ?? message.id)}/100/100`}
                  isSelf={isSelf}
                />
              </div>
            );
          })}

          {!isLoading && selectedEvent && activeMessages.length === 0 && (
            <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-sm text-ink-500">
              No messages yet. Send the first one.
            </div>
          )}

          {!selectedEvent && !isLoading && (
            <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-sm text-ink-500">
              Select a joined event chat from the left panel.
            </div>
          )}
        </div>

        <footer className="border-t border-surface-100 bg-white p-6">
          <div className="mx-auto flex max-w-4xl items-end gap-4 rounded-2xl border border-surface-200 bg-surface-50 p-2">
            <button className="p-2 text-ink-400 transition-colors hover:text-primary-500"><Plus className="h-6 w-6" /></button>
            <textarea
              className="max-h-32 flex-1 resize-none border-none bg-transparent px-0 py-2 text-sm placeholder-ink-400 focus:ring-0"
              placeholder={selectedEvent ? 'Type a message...' : 'Join and select an event chat first...'}
              rows={1}
              value={messageDraft}
              onChange={e => setMessageDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              disabled={!selectedEvent || !currentUserId}
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-2 text-ink-400 transition-colors hover:text-primary-500"><Smile className="h-6 w-6" /></button>
              <button
                onClick={() => void handleSend()}
                disabled={!selectedEvent || !currentUserId || isSending || !messageDraft.trim()}
                className="rounded-xl bg-primary-500 p-2 text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
