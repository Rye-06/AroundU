import { useEffect, useState } from 'react';

const SCRIPT_ID = 'aroundu-google-maps-script';
let googleMapsLoadPromise = null;

function buildScriptUrl(apiKey) {
  const params = new URLSearchParams({
    key: apiKey,
    v: 'weekly',
    libraries: 'marker',
  });

  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}

export function loadGoogleMapsApi(apiKey) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only be loaded in a browser environment.'));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!apiKey) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY.'));
  }

  if (googleMapsLoadPromise) {
    return googleMapsLoadPromise;
  }

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps), { once: true });
      existingScript.addEventListener('error', () => {
        googleMapsLoadPromise = null;
        reject(new Error('Failed to load Google Maps script.'));
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = buildScriptUrl(apiKey);
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      googleMapsLoadPromise = null;
      reject(new Error('Google Maps was loaded but API is unavailable.'));
    };

    script.onerror = () => {
      googleMapsLoadPromise = null;
      reject(new Error('Failed to load Google Maps script.'));
    };

    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

export function useGoogleMapsLoader(apiKey) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    loadGoogleMapsApi(apiKey)
      .then(() => {
        if (!mounted) return;
        setIsLoaded(true);
      })
      .catch((loaderError) => {
        if (!mounted) return;
        setError(loaderError instanceof Error ? loaderError : new Error('Failed to load Google Maps.'));
      });

    return () => {
      mounted = false;
    };
  }, [apiKey]);

  return { isLoaded, error };
}
