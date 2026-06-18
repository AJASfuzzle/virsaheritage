/**
 * Singleton loader for the Google Maps JavaScript API.
 * Loads the API with the Lovable-managed browser key and resolves once the
 * `google.maps` namespace is ready. Subsequent callers receive the same promise.
 */

declare global {
  interface Window {
    google?: typeof google;
    __virsaMapsCallback?: () => void;
  }
}

let loadPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps cannot load on the server."));
  }
  if (window.google?.maps) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as
    | string
    | undefined;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as
    | string
    | undefined;

  if (!key) {
    return Promise.reject(
      new Error(
        "Google Maps browser key is missing. The Google Maps Platform connector may be disconnected."
      )
    );
  }

  loadPromise = new Promise<typeof google>((resolve, reject) => {
    window.__virsaMapsCallback = () => {
      if (window.google?.maps) resolve(window.google);
      else reject(new Error("Google Maps failed to initialize."));
    };
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key,
      v: "weekly",
      libraries: "marker",
      loading: "async",
      callback: "__virsaMapsCallback",
    });
    if (channel) params.set("channel", channel);
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps script."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
