import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';

const CAMPUS_CENTER = { lat: 43.6629, lng: -79.3957 };
const DEFAULT_ZOOM = 15;
const MARKER_STATE_IDLE = 'idle';
const MARKER_STATE_HOVER = 'hover';
const MARKER_STATE_ACTIVE = 'active';
const USER_MARKER_IDLE_Z = 4600;
const USER_MARKER_ACTIVE_Z = 6000;
const DEFAULT_USER_PHOTO = 'https://picsum.photos/seed/aroundu-user/160/160';

const ACTIVITY_TOKEN = {
  quiet: { core: 16, glow: 0.44, ring: 0.32 },
  moderate: { core: 21, glow: 0.58, ring: 0.44 },
  high: { core: 24, glow: 0.72, ring: 0.5 },
};

const CATEGORY_STYLE = {
  study: { fill: '#2563eb', glow: '#93c5fd' },
  social: { fill: '#ea580c', glow: '#fdba74' },
  sports: { fill: '#15803d', glow: '#86efac' },
  food: { fill: '#e11d48', glow: '#f9a8d4' },
  music: { fill: '#7c3aed', glow: '#c4b5fd' },
  other: { fill: '#d97706', glow: '#fcd34d' },
  icebreaker: { fill: '#0f766e', glow: '#5eead4' },
};

const FALLBACK_OFFSETS = [
  { lat: 0.0014, lng: -0.0012 },
  { lat: -0.001, lng: 0.0015 },
  { lat: 0.0009, lng: 0.001 },
  { lat: -0.0016, lng: -0.0006 },
  { lat: 0.0018, lng: 0.0002 },
  { lat: -0.0005, lng: -0.0018 },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toCoordinate(event, index) {
  if (typeof event?.lat === 'number' && typeof event?.lng === 'number') {
    return { lat: event.lat, lng: event.lng };
  }

  const offset = FALLBACK_OFFSETS[index % FALLBACK_OFFSETS.length];
  const ringStep = Math.floor(index / FALLBACK_OFFSETS.length) * 0.00035;

  return {
    lat: CAMPUS_CENTER.lat + offset.lat + ringStep,
    lng: CAMPUS_CENTER.lng + offset.lng - ringStep,
  };
}

function setMarkerActiveState(markerEntries, activeId) {
  markerEntries.forEach((entry) => {
    const nextState = entry.id === activeId ? MARKER_STATE_ACTIVE : MARKER_STATE_IDLE;
    applyMarkerVisual(entry, { state: nextState });
  });
}

function getCategoryType(category = '') {
  const normalized = String(category).toLowerCase();
  if (normalized.includes('music')) return 'music';
  if (normalized.includes('study')) return 'study';
  if (normalized.includes('social')) return 'social';
  if (normalized.includes('sport')) return 'sports';
  if (normalized.includes('food')) return 'food';
  if (normalized.includes('other') || normalized.includes('club')) return 'other';
  return 'other';
}

function getIndicatorPath(categoryType, strokeWidth) {
  if (categoryType === 'study') {
    return `<path d="M33.5 45h15v12.5h-15z" fill="none" stroke="#fefcf3" stroke-width="${strokeWidth}" stroke-linejoin="round"/>\n<path d="M41 45v12.5" stroke="#fefcf3" stroke-width="${Math.max(1.5, strokeWidth - 0.2)}"/>`;
  }

  if (categoryType === 'social') {
    return `<circle cx="37.5" cy="48" r="3.1" fill="#fefcf3"/>\n<circle cx="44.8" cy="48" r="3.1" fill="#fefcf3"/>\n<path d="M33.3 55c1.7-3.3 4.9-4.9 8-4.9s6.3 1.6 8 4.9" fill="none" stroke="#fefcf3" stroke-width="${strokeWidth}" stroke-linecap="round"/>`;
  }

  if (categoryType === 'sports') {
    return `<circle cx="41" cy="50" r="6.2" fill="none" stroke="#fefcf3" stroke-width="${strokeWidth}"/>\n<path d="M35.4 47.5h11.2M35.4 52.5h11.2" stroke="#fefcf3" stroke-width="${Math.max(1.3, strokeWidth - 0.2)}" stroke-linecap="round"/>`;
  }

  if (categoryType === 'food') {
    return `<path d="M35.8 45v10.3M38.6 45v10.3M41.4 45v10.3" stroke="#fefcf3" stroke-width="${Math.max(1.3, strokeWidth - 0.2)}" stroke-linecap="round"/>\n<path d="M45.6 45v5.2h3.2v5.1" fill="none" stroke="#fefcf3" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  if (categoryType === 'music') {
    return `<path d="M37 45.5v8.3a2.8 2.8 0 1 0 1.6 2.5V49l8-1.9v4.8a2.8 2.8 0 1 0 1.6 2.5V43z" fill="#fefcf3"/>`;
  }

  if (categoryType === 'other') {
    return `<path d="M42.5 44l-5.8 7h4.1l-2 7 6.2-8h-4.1z" fill="#fefcf3"/>`;
  }

  return `<circle cx="41" cy="50" r="6" fill="none" stroke="#fefcf3" stroke-width="${strokeWidth}"/>`;
}

function getMarkerKind(event) {
  if (event.markerType === 'icebreaker' || event.kind === 'icebreaker' || event.isIcebreaker) {
    return 'icebreaker';
  }

  return 'event';
}

function buildIcebreakerMarkerSvg({ state }) {
  const interactionScale = state === MARKER_STATE_ACTIVE ? 1.08 : state === MARKER_STATE_HOVER ? 1.06 : 1;
  const bubbleScale = interactionScale;
  const bubbleColor = CATEGORY_STYLE.icebreaker.fill;
  const glowColor = CATEGORY_STYLE.icebreaker.glow;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.42" />
          <stop offset="100%" stop-color="${glowColor}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="41" cy="41" r="24" fill="url(#g)" />
      <g transform="translate(41 41) scale(${bubbleScale}) translate(-41 -41)">
        <path d="M23 30c0-6.6 5.4-12 12-12h12c6.6 0 12 5.4 12 12v14c0 6.6-5.4 12-12 12H37l-8.7 8.4a1 1 0 0 1-1.7-.7V56.6C24.4 54.7 23 51.7 23 49V30z" fill="${bubbleColor}" stroke="rgba(252,249,242,0.94)" stroke-width="2"/>
        <circle cx="35" cy="39" r="2.2" fill="#fefcf3"/>
        <circle cx="41" cy="39" r="2.2" fill="#fefcf3"/>
        <circle cx="47" cy="39" r="2.2" fill="#fefcf3"/>
      </g>
    </svg>
  `;
}

function buildEventMarkerSvg({ activityLevel, category, state, pulsePhase }) {
  const token = ACTIVITY_TOKEN[activityLevel] ?? ACTIVITY_TOKEN.moderate;
  const categoryType = getCategoryType(category);
  const color = CATEGORY_STYLE[categoryType] ?? CATEGORY_STYLE.other;

  const interactionScale = state === MARKER_STATE_ACTIVE ? 1.08 : state === MARKER_STATE_HOVER ? 1.06 : 1;
  const coreDiameter = Math.min(token.core, 24) * interactionScale;
  const coreRadius = coreDiameter * 0.82;
  const glowRadius = coreRadius * 2.2;
  const ringRadius = coreRadius * 1.36 + (activityLevel === 'high' && pulsePhase ? 0.9 : 0);

  const glowOpacityBase = state === MARKER_STATE_ACTIVE ? token.glow + 0.2 : state === MARKER_STATE_HOVER ? token.glow + 0.12 : token.glow;
  const glowOpacity = activityLevel === 'high' && pulsePhase ? Math.min(0.94, glowOpacityBase + 0.09) : glowOpacityBase;
  const ringOpacity = state === MARKER_STATE_ACTIVE ? token.ring + 0.2 : state === MARKER_STATE_HOVER ? token.ring + 0.1 : token.ring;
  const strokeWidth = Math.max(1.4, coreRadius / 7.2);

  const indicator = getIndicatorPath(categoryType, strokeWidth);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 82">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color.glow}" stop-opacity="${Math.min(1, glowOpacity)}" />
          <stop offset="100%" stop-color="${color.glow}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="41" cy="41" r="${glowRadius.toFixed(2)}" fill="url(#g)"/>
      <circle cx="41" cy="41" r="${ringRadius.toFixed(2)}" fill="none" stroke="${color.glow}" stroke-opacity="${Math.min(0.82, ringOpacity)}" stroke-width="1.7"/>
      <circle cx="41" cy="41" r="${(ringRadius + 2.1).toFixed(2)}" fill="none" stroke="rgba(252,249,242,${Math.min(0.55, ringOpacity * 0.75)})" stroke-width="1.1"/>

      <circle cx="41" cy="41" r="${coreRadius.toFixed(2)}" fill="${color.fill}" stroke="rgba(252,249,242,0.95)" stroke-width="2"/>
      <g>
        ${indicator}
      </g>
    </svg>
  `;
}

function createMarkerIcon(entry) {
  const token = ACTIVITY_TOKEN[entry.activityLevel] ?? ACTIVITY_TOKEN.moderate;
  const interactionScale = entry.state === MARKER_STATE_ACTIVE ? 1.08 : entry.state === MARKER_STATE_HOVER ? 1.06 : 1;
  const totalSize = entry.kind === 'icebreaker'
    ? 62
    : Math.min(70, Math.max(44, Math.min(token.core, 24) * interactionScale * 2.9));

  const svg = entry.kind === 'icebreaker'
    ? buildIcebreakerMarkerSvg({ state: entry.state })
    : buildEventMarkerSvg({
      activityLevel: entry.activityLevel,
      category: entry.category,
      state: entry.state,
      pulsePhase: entry.pulsePhase,
    });

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(totalSize, totalSize),
    anchor: new window.google.maps.Point(totalSize / 2, totalSize / 2),
  };
}

function applyMarkerVisual(entry, patch = {}) {
  if (!entry.marker || typeof entry.marker.setIcon !== 'function') {
    return;
  }

  if (typeof patch.state !== 'undefined') {
    entry.state = patch.state;
  }

  if (typeof patch.pulsePhase !== 'undefined') {
    entry.pulsePhase = patch.pulsePhase;
  }

  entry.marker.setIcon(createMarkerIcon(entry));
  entry.marker.setZIndex(entry.state === MARKER_STATE_ACTIVE ? 3000 : entry.state === MARKER_STATE_HOVER ? 2000 : 1000);
}

function getActivityLevel(value) {
  if (value === 'high') return 'high';
  if (value === 'quiet') return 'quiet';
  return 'moderate';
}

function isHighActivity(activityLevel) {
  return activityLevel === 'high';
}

function clearPulseIntervals(pulseIntervalsRef) {
  pulseIntervalsRef.current.forEach((intervalId) => window.clearInterval(intervalId));
  pulseIntervalsRef.current = [];
}

function buildInfoCardHtml(event) {
  const title = escapeHtml(event.title || 'Campus event');
  const category = escapeHtml(event.category || 'Community');
  const preview = escapeHtml(event.preview || event.description || 'Tap to view this event in AroundU.');

  return `
    <div style="min-width:220px;max-width:240px;padding:6px 4px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="display:inline-block;padding:3px 8px;border-radius:999px;background:#f3eee3;color:#647e68;font-size:11px;font-weight:600;">${category}</span>
      </div>
      <h3 style="margin:0;font-size:14px;line-height:1.3;color:#1a1e1e;font-weight:700;">${title}</h3>
      <p style="margin:6px 0 0;color:#525c5c;font-size:12px;line-height:1.45;">${preview}</p>
    </div>
  `;
}

function buildUserInfoCardHtml({ name, mood, photoUrl }) {
  const safeName = escapeHtml(name || 'You');
  const safeMood = escapeHtml(mood || 'not set');
  const safePhoto = escapeAttr(photoUrl || DEFAULT_USER_PHOTO);

  return `
    <div style="min-width:210px;max-width:235px;padding:6px 4px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${safePhoto}" alt="${safeName}" style="width:44px;height:44px;border-radius:999px;object-fit:cover;border:2px solid #fefcf3;box-shadow:0 6px 14px rgba(80,92,76,0.18);" referrerpolicy="no-referrer" />
        <div>
          <p style="margin:0;font-size:14px;line-height:1.2;color:#1a1e1e;font-weight:700;">${safeName}</p>
          <p style="margin:2px 0 0;font-size:11px;color:#647e68;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">You</p>
          <p style="margin:4px 0 0;font-size:12px;color:#525c5c;">Mood: ${safeMood}</p>
        </div>
      </div>
    </div>
  `;
}

function buildUserMarkerSvg({ photoUrl, pulsePhase, isActive }) {
  const glowOpacity = isActive ? 0.6 : pulsePhase ? 0.5 : 0.42;
  const outerRadius = isActive ? 33 : pulsePhase ? 31.5 : 30;
  const ringStroke = isActive ? 4.2 : 3.7;
  const innerRingStroke = isActive ? 2.6 : 2.2;
  const safePhotoUrl = escapeAttr(photoUrl || DEFAULT_USER_PHOTO);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <radialGradient id="userAura" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stop-color="#b7d5c0" stop-opacity="${glowOpacity}" />
          <stop offset="100%" stop-color="#b7d5c0" stop-opacity="0" />
        </radialGradient>
        <clipPath id="userClip">
          <circle cx="48" cy="48" r="18.5" />
        </clipPath>
      </defs>

      <circle cx="48" cy="48" r="${outerRadius}" fill="url(#userAura)" />
      <circle cx="48" cy="48" r="25.5" fill="none" stroke="#7b9780" stroke-opacity="0.48" stroke-width="${ringStroke}" />
      <circle cx="48" cy="48" r="22.6" fill="none" stroke="#fefcf3" stroke-opacity="0.95" stroke-width="${innerRingStroke}" />

      <circle cx="48" cy="48" r="19.2" fill="#f3eee3" />
      <image href="${safePhotoUrl}" x="29.5" y="29.5" width="37" height="37" clip-path="url(#userClip)" preserveAspectRatio="xMidYMid slice" />
      <circle cx="48" cy="48" r="19.2" fill="none" stroke="rgba(26,30,30,0.08)" stroke-width="0.9" />
    </svg>
  `;
}

function createUserMarkerIcon({ photoUrl, pulsePhase, isActive }) {
  const size = isActive ? 86 : pulsePhase ? 84 : 82;
  const svg = buildUserMarkerSvg({ photoUrl, pulsePhase, isActive });

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size / 2),
  };
}

export default function CampusMap({
  events = [],
  userProfile,
  userPhotoUrl,
  userPosition,
  focusEventId = null,
  onFocusHandled,
  className,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markerEntriesRef = useRef([]);
  const listenerEntriesRef = useRef([]);
  const mapClickListenerRef = useRef(null);
  const pulseIntervalsRef = useRef([]);
  const userMarkerRef = useRef(null);
  const userMarkerListenersRef = useRef([]);
  const userPulseIntervalRef = useRef(null);
  const userMarkerStateRef = useRef({ active: false, pulsePhase: false });
  const [isMapReady, setIsMapReady] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, error } = useGoogleMapsLoader(apiKey);

  const markerEvents = useMemo(() => {
    return events.map((event, index) => ({
      ...event,
      position: toCoordinate(event, index),
      preview: event.preview || event.description?.slice(0, 96),
    }));
  }, [events]);

  const resolvedUserPosition = useMemo(() => {
    if (typeof userPosition?.lat === 'number' && typeof userPosition?.lng === 'number') {
      return userPosition;
    }

    return {
      lat: CAMPUS_CENTER.lat + 0.0002,
      lng: CAMPUS_CENTER.lng - 0.0003,
    };
  }, [userPosition]);

  const userDisplayName = userProfile?.name || 'You';
  const userMood = userProfile?.user_profile?.mood || 'focused';
  const resolvedUserPhoto = userPhotoUrl || DEFAULT_USER_PHOTO;

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      mapTypeId: 'roadmap',
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      minZoom: 13,
      maxZoom: 19,
      gestureHandling: 'greedy',
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    infoWindowRef.current = new window.google.maps.InfoWindow({
      disableAutoPan: false,
      maxWidth: 260,
      pixelOffset: new window.google.maps.Size(0, -14),
    });

    setIsMapReady(true);
  }, [isLoaded]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !infoWindowRef.current) {
      return;
    }

    listenerEntriesRef.current.forEach((listener) => listener.remove());
    listenerEntriesRef.current = [];
    clearPulseIntervals(pulseIntervalsRef);

    markerEntriesRef.current.forEach(({ marker }) => {
      if (marker && typeof marker.setMap === 'function') {
        marker.setMap(null);
      } else if (marker) {
        marker.map = null;
      }
    });
    markerEntriesRef.current = [];

    if (mapClickListenerRef.current) {
      mapClickListenerRef.current.remove();
      mapClickListenerRef.current = null;
    }

    const markerLookup = new Map();

    markerEvents.forEach((event) => {
      const activityLevel = getActivityLevel(event.activityLevel);
      const marker = new window.google.maps.Marker({
        position: event.position,
        title: event.title,
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#1f2937',
          fillOpacity: 0.001,
          strokeWeight: 0,
          scale: 1,
        },
      });

      const markerEntry = {
        id: event.id,
        marker,
        openInfo: () => undefined,
        position: event.position,
        category: event.category,
        kind: getMarkerKind(event),
        activityLevel,
        state: MARKER_STATE_IDLE,
        pulsePhase: false,
      };

      applyMarkerVisual(markerEntry, { state: MARKER_STATE_IDLE });

      const openInfo = () => {
        setMarkerActiveState(markerEntriesRef.current, event.id);
        infoWindowRef.current.setContent(buildInfoCardHtml(event));
        infoWindowRef.current.open({
          map: mapRef.current,
          anchor: marker,
        });
      };

      markerEntry.openInfo = openInfo;

      const markerHoverInListener = marker.addListener('mouseover', () => {
        if (markerEntry.state !== MARKER_STATE_ACTIVE) {
          applyMarkerVisual(markerEntry, { state: MARKER_STATE_HOVER });
        }
      });

      const markerHoverOutListener = marker.addListener('mouseout', () => {
        if (markerEntry.state !== MARKER_STATE_ACTIVE) {
          applyMarkerVisual(markerEntry, { state: MARKER_STATE_IDLE });
        }
      });

      const markerListener = marker.addListener('click', openInfo);
      listenerEntriesRef.current.push(markerListener);
      listenerEntriesRef.current.push(markerHoverInListener);
      listenerEntriesRef.current.push(markerHoverOutListener);
      markerEntriesRef.current.push(markerEntry);
      markerLookup.set(event.id, { marker, openInfo, position: event.position });

      if (isHighActivity(activityLevel)) {
        const intervalId = window.setInterval(() => {
          if (markerEntry.state === MARKER_STATE_ACTIVE) {
            return;
          }
          applyMarkerVisual(markerEntry, { pulsePhase: !markerEntry.pulsePhase });
        }, 1800);

        pulseIntervalsRef.current.push(intervalId);
      }
    });

    mapClickListenerRef.current = mapRef.current.addListener('click', () => {
      infoWindowRef.current.close();
      setMarkerActiveState(markerEntriesRef.current, null);
    });

    if (focusEventId && markerLookup.has(focusEventId)) {
      const focused = markerLookup.get(focusEventId);
      focused.openInfo();
      mapRef.current.panTo(focused.position);
      onFocusHandled?.();
    }

    return () => {
      listenerEntriesRef.current.forEach((listener) => listener.remove());
      listenerEntriesRef.current = [];
      clearPulseIntervals(pulseIntervalsRef);

      if (mapClickListenerRef.current) {
        mapClickListenerRef.current.remove();
        mapClickListenerRef.current = null;
      }

      markerEntriesRef.current.forEach(({ marker }) => {
        if (marker && typeof marker.setMap === 'function') {
          marker.setMap(null);
        } else if (marker) {
          marker.map = null;
        }
      });
      markerEntriesRef.current = [];

      userMarkerListenersRef.current.forEach((listener) => listener.remove());
      userMarkerListenersRef.current = [];
      if (userPulseIntervalRef.current) {
        window.clearInterval(userPulseIntervalRef.current);
        userPulseIntervalRef.current = null;
      }
      if (userMarkerRef.current) {
        if (typeof userMarkerRef.current.setMap === 'function') {
          userMarkerRef.current.setMap(null);
        } else {
          userMarkerRef.current.map = null;
        }
        userMarkerRef.current = null;
      }
    };
  }, [isMapReady, markerEvents, focusEventId, onFocusHandled]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !infoWindowRef.current) {
      return;
    }

    const applyUserVisual = () => {
      if (!userMarkerRef.current) {
        return;
      }

      userMarkerRef.current.setIcon(
        createUserMarkerIcon({
          photoUrl: resolvedUserPhoto,
          pulsePhase: userMarkerStateRef.current.pulsePhase,
          isActive: userMarkerStateRef.current.active,
        }),
      );
      userMarkerRef.current.setZIndex(userMarkerStateRef.current.active ? USER_MARKER_ACTIVE_Z : USER_MARKER_IDLE_Z);
    };

    if (!userMarkerRef.current) {
      userMarkerRef.current = new window.google.maps.Marker({
        position: resolvedUserPosition,
        title: 'You are here',
        map: mapRef.current,
        clickable: true,
      });

      applyUserVisual();

      const openUserInfo = () => {
        userMarkerStateRef.current.active = true;
        applyUserVisual();

        infoWindowRef.current.setContent(
          buildUserInfoCardHtml({
            name: userDisplayName,
            mood: userMood,
            photoUrl: resolvedUserPhoto,
          }),
        );

        infoWindowRef.current.open({
          map: mapRef.current,
          anchor: userMarkerRef.current,
        });

        setMarkerActiveState(markerEntriesRef.current, null);
      };

      const markerClickListener = userMarkerRef.current.addListener('click', openUserInfo);
      const markerHoverInListener = userMarkerRef.current.addListener('mouseover', () => {
        userMarkerStateRef.current.active = true;
        applyUserVisual();
      });
      const markerHoverOutListener = userMarkerRef.current.addListener('mouseout', () => {
        userMarkerStateRef.current.active = false;
        applyUserVisual();
      });

      userMarkerListenersRef.current.push(markerClickListener, markerHoverInListener, markerHoverOutListener);
    }

    userMarkerRef.current.setPosition(resolvedUserPosition);
    applyUserVisual();

    if (userPulseIntervalRef.current) {
      window.clearInterval(userPulseIntervalRef.current);
      userPulseIntervalRef.current = null;
    }

    userPulseIntervalRef.current = window.setInterval(() => {
      userMarkerStateRef.current.pulsePhase = !userMarkerStateRef.current.pulsePhase;
      if (!userMarkerStateRef.current.active) {
        applyUserVisual();
      }
    }, 2200);

    const closeListener = infoWindowRef.current.addListener('closeclick', () => {
      userMarkerStateRef.current.active = false;
      applyUserVisual();
    });

    const mapClickResetListener = mapRef.current.addListener('click', () => {
      userMarkerStateRef.current.active = false;
      applyUserVisual();
    });

    return () => {
      closeListener.remove();
      mapClickResetListener.remove();
      if (userPulseIntervalRef.current) {
        window.clearInterval(userPulseIntervalRef.current);
        userPulseIntervalRef.current = null;
      }
    };
  }, [isMapReady, resolvedUserPosition, resolvedUserPhoto, userDisplayName, userMood]);

  if (!apiKey) {
    return (
      <div className={`h-full min-h-[460px] w-full rounded-[2rem] border border-surface-200 bg-surface-50/90 ${className || ''}`}>
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="max-w-md rounded-3xl border border-surface-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-semibold text-ink-800">Google Maps key missing</p>
            <p className="mt-2 text-xs text-ink-500">
              Add VITE_GOOGLE_MAPS_API_KEY to your environment file, restart the dev server, and reload this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-full min-h-[460px] w-full rounded-[2rem] border border-surface-200 bg-surface-50/90 ${className || ''}`}>
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div className="max-w-md rounded-3xl border border-red-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-semibold text-ink-800">Unable to load Google Maps</p>
            <p className="mt-2 text-xs text-ink-500">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[460px] w-full overflow-hidden rounded-[2rem] border border-surface-200 shadow-[0_12px_38px_rgba(80,92,76,0.14)] ${className || ''}`}>
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200" />
      )}
      <div ref={mapContainerRef} className="h-full w-full" aria-label="Campus map" />
    </div>
  );
}
