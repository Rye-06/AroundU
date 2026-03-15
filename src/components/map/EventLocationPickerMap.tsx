import { useEffect, useRef } from 'react';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';

type LatLng = {
  latitude: number;
  longitude: number;
};

type EventLocationPickerMapProps = {
  selectedLocation: LatLng | null;
  onLocationSelect: (location: LatLng) => void;
  className?: string;
};

const CAMPUS_CENTER = { lat: 43.6629, lng: -79.3957 };

export default function EventLocationPickerMap({
  selectedLocation,
  onLocationSelect,
  className,
}: EventLocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, error } = useGoogleMapsLoader(apiKey);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new window.google.maps.Map(containerRef.current, {
      center: CAMPUS_CENTER,
      zoom: 15,
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
      ],
    });

    const listener = mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) {
        return;
      }

      onLocationSelect({
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      });
    });

    return () => {
      listener.remove();
    };
  }, [isLoaded, onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) {
      return;
    }

    const position = {
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
    };

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position,
        title: 'Meetup location',
      });
    } else {
      markerRef.current.setPosition(position);
    }

    mapRef.current.panTo(position);
  }, [selectedLocation]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapRef.current = null;
    };
  }, []);

  if (!apiKey) {
    return (
      <div className={className}>
        <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-surface-200 bg-surface-50 p-4 text-center">
          <p className="text-xs text-ink-500">Map unavailable. Add VITE_GOOGLE_MAPS_API_KEY to use map click selection.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-red-200 bg-white p-4 text-center">
          <p className="text-xs text-ink-500">Unable to load map for location selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-surface-200 bg-surface-100">
        {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200" />}
        <div ref={containerRef} className="h-full w-full" aria-label="Meetup location picker map" />
      </div>
    </div>
  );
}
