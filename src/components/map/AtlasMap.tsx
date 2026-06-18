import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Compass,
  Loader2,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { loadGoogleMaps } from "./loader";
import { listAllSites } from "@/lib/atlas.functions";
import { checkInAtSite, getMyState } from "@/lib/virsa.functions";
import { useAuth } from "@/hooks/use-auth";
import { trails } from "@/lib/trails-data";

type Site = Awaited<ReturnType<typeof listAllSites>>[number];

const INDIA_CENTER = { lat: 22.6, lng: 80.3 };
const INDIA_ZOOM = 5;

// Soft, editorial Google Maps style tuned to the parchment / dark theme tokens.
const MAP_STYLES_LIGHT: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f7eedb" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5b4633" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fbf2e3" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#a33e25" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#c4a47a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#efe0c4" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfd6cf" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#ecddc0" }] },
];

const MAP_STYLES_DARK: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#101522" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a7957d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b0f1a" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#da9e3f" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#2a2f3d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#161c2a" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1622" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#0f1422" }] },
];

const PIN_COLOR_BY_TRAIL: Record<string, string> = {
  "chettinad-spice-trail": "#c2410c",
  "brihadeeswarar-to-hampi": "#b45309",
  "bhuj-craft-villages": "#a16207",
  "kumaoni-festival-loop": "#7c2d12",
};

function pinSvg(color: string) {
  // Custom heritage-themed pin (rendered as SVG data URL).
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='34' height='44' viewBox='0 0 34 44'>
  <defs>
    <filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
      <feDropShadow dx='0' dy='2' stdDeviation='2' flood-color='#000' flood-opacity='0.35'/>
    </filter>
  </defs>
  <g filter='url(#s)'>
    <path d='M17 1c-7.7 0-14 6.1-14 13.7 0 9.7 11.5 22.3 13.2 24.1.4.4 1.1.4 1.5 0C19.5 37 31 24.4 31 14.7 31 7.1 24.7 1 17 1z' fill='${color}' stroke='#fff' stroke-width='1.5'/>
    <circle cx='17' cy='15' r='5.2' fill='#fff'/>
  </g>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const USER_PIN_SVG = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
  <circle cx='14' cy='14' r='13' fill='#ef4444' fill-opacity='0.18'/>
  <circle cx='14' cy='14' r='7' fill='#ef4444' stroke='#fff' stroke-width='2.5'/>
</svg>`;

type GeoConsent = "granted" | "denied" | "unset";

const CONSENT_KEY = "virsa-geo-consent";

function readConsent(): GeoConsent {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* ignore */
  }
  return "unset";
}

function writeConsent(value: GeoConsent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
}

export function AtlasMap() {
  const mapHostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Site | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [consent, setConsent] = useState<GeoConsent>(() => readConsent());
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { user } = useAuth();
  const fetchSites = useServerFn(listAllSites);
  const fetchState = useServerFn(getMyState);
  const checkIn = useServerFn(checkInAtSite);
  const qc = useQueryClient();

  const { data: sites = [] } = useQuery({
    queryKey: ["atlas-sites"],
    queryFn: () => fetchSites(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: state } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
    enabled: !!user,
  });

  const visitedIds = useMemo(
    () => new Set((state?.progress ?? []).map((p) => p.site_id)),
    [state]
  );

  const trailLookup = useMemo(() => {
    const m = new Map<string, { title: string; hero: string }>();
    for (const t of trails) m.set(t.slug, { title: t.title, hero: t.hero });
    return m;
  }, []);

  // --- Map bootstrap ---
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !mapHostRef.current) return;
        const isDark = !document.documentElement.classList.contains("light");
        const map = new g.maps.Map(mapHostRef.current, {
          center: INDIA_CENTER,
          zoom: INDIA_ZOOM,
          minZoom: 4,
          maxZoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          backgroundColor: isDark ? "#0b0f1a" : "#fbf2e3",
          styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
          restriction: {
            latLngBounds: { north: 38, south: 5, west: 65, east: 100 },
            strictBounds: false,
          },
        });
        mapRef.current = map;
        setReady(true);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Re-style when theme toggles ---
  useEffect(() => {
    if (!ready) return;
    const obs = new MutationObserver(() => {
      const isDark = !document.documentElement.classList.contains("light");
      mapRef.current?.setOptions({
        styles: isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
        backgroundColor: isDark ? "#0b0f1a" : "#fbf2e3",
      });
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ready]);

  // --- Render site markers ---
  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) return;
    const g = window.google;
    const map = mapRef.current;
    const existing = markersRef.current;
    const seen = new Set<string>();

    for (const site of sites) {
      seen.add(site.id);
      const color = PIN_COLOR_BY_TRAIL[site.trail_slug] ?? "#b45309";
      const visited = visitedIds.has(site.id);
      const icon: google.maps.Icon = {
        url: pinSvg(visited ? "#338d6b" : color),
        scaledSize: new g.maps.Size(34, 44),
        anchor: new g.maps.Point(17, 42),
      };
      const prev = existing.get(site.id);
      if (prev) {
        prev.setIcon(icon);
        continue;
      }
      const marker = new g.maps.Marker({
        position: { lat: site.lat, lng: site.lng },
        map,
        icon,
        title: site.name,
        optimized: true,
      });
      marker.addListener("click", () => {
        setSelected(site);
        map.panTo({ lat: site.lat, lng: site.lng });
      });
      existing.set(site.id, marker);
    }
    // Remove stale markers
    for (const [id, marker] of existing) {
      if (!seen.has(id)) {
        marker.setMap(null);
        existing.delete(id);
      }
    }
  }, [ready, sites, visitedIds]);

  // --- Geolocation watch ---
  useEffect(() => {
    if (consent !== "granted") return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        if (import.meta.env.DEV) console.warn("[atlas] geolocation error", err);
        if (err.code === err.PERMISSION_DENIED) {
          setConsent("denied");
          writeConsent("denied");
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    watchIdRef.current = id;
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    };
  }, [consent]);

  // --- Render user marker ---
  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) return;
    const g = window.google;
    if (!userPos) {
      userMarkerRef.current?.setMap(null);
      userMarkerRef.current = null;
      return;
    }
    const icon: google.maps.Icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(USER_PIN_SVG)}`,
      scaledSize: new g.maps.Size(28, 28),
      anchor: new g.maps.Point(14, 14),
    };
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition({ lat: userPos.lat, lng: userPos.lng });
      userMarkerRef.current.setIcon(icon);
    } else {
      userMarkerRef.current = new g.maps.Marker({
        position: { lat: userPos.lat, lng: userPos.lng },
        map: mapRef.current,
        icon,
        zIndex: 999,
        title: "You are here",
      });
    }
  }, [ready, userPos]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Your browser doesn't support location.");
      return;
    }
    setConsent("granted");
    writeConsent("granted");
  };

  const declineLocation = () => {
    setConsent("denied");
    writeConsent("denied");
  };

  const panToUser = () => {
    if (!userPos || !mapRef.current) return;
    mapRef.current.panTo({ lat: userPos.lat, lng: userPos.lng });
    mapRef.current.setZoom(Math.max(mapRef.current.getZoom() ?? 5, 12));
  };

  const mutation = useMutation({
    mutationFn: ({ site, lat, lng, force }: { site: Site; lat: number; lng: number; force?: boolean }) =>
      checkIn({ data: { siteId: site.id, lat, lng, force } }),
    onSuccess: (res, vars) => {
      setPendingId(null);
      if (!res.ok) {
        if (res.reason === "too_far") {
          toast.error(`You're ${res.distance_m}m away. Get within ${res.required_m}m to check in.`);
        } else if (res.reason === "already_checked_in") {
          toast.info("Already checked in here.");
        } else {
          toast.error("Check-in failed");
        }
        return;
      }
      qc.invalidateQueries({ queryKey: ["my-state"] });
      toast.success(`+${res.earned} Virsa Coins — ${vars.site.name}`);
      if (res.trail_complete) {
        toast.success("Trail complete! +100 bonus.", { duration: 5000 });
      }
    },
    onError: (e: Error) => {
      setPendingId(null);
      toast.error(e.message);
    },
  });

  const attemptCheckIn = (site: Site, force = false) => {
    if (!user) {
      toast.info("Sign in to check in and earn Virsa Coins.");
      return;
    }
    setPendingId(site.id);
    if (force) {
      mutation.mutate({ site, lat: site.lat, lng: site.lng, force: true });
      return;
    }
    if (userPos && userPos.accuracy < 200) {
      mutation.mutate({ site, lat: userPos.lat, lng: userPos.lng });
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported.");
      setPendingId(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => mutation.mutate({ site, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        toast.error(err.message || "Couldn't get your location");
        setPendingId(null);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  };

  const selectedTrail = selected ? trailLookup.get(selected.trail_slug) : null;
  const selectedVisited = selected ? visitedIds.has(selected.id) : false;
  const isPending = selected ? pendingId === selected.id : false;

  return (
    <div className="relative w-full">
      {/* Map host */}
      <div className="relative w-full overflow-hidden rounded-3xl ring-1 ring-[var(--glass-border)] bg-card shadow-[var(--shadow-soft)]">
        <div
          ref={mapHostRef}
          className="h-[68vh] min-h-[520px] w-full"
          aria-label="Heritage Atlas map of India"
          role="region"
        />

        {/* Loading veil */}
        {!ready && !loadError && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading the Atlas…</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {loadError && (
          <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm p-6 text-center">
            <div className="max-w-sm">
              <Compass className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-sm text-foreground/85">
                The live map couldn't load. Try refreshing, or switch to the Curated view.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{loadError}</p>
            </div>
          </div>
        )}

        {/* Geolocation consent card */}
        {ready && consent === "unset" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 right-4 bottom-4 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm rounded-2xl glass ring-1 ring-[var(--glass-border)] p-4"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Allow location?</p>
                <p className="mt-1 text-muted-foreground text-[13px]">
                  Show your position on the Atlas so you can check in at heritage sites.
                  We never store your coordinates.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={requestLocation}
                    className="btn-glossy rounded-full gradient-ember px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    Allow
                  </button>
                  <button
                    onClick={declineLocation}
                    className="rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/75 hover:bg-foreground/10"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pan-to-me button */}
        {ready && consent === "granted" && userPos && (
          <button
            onClick={panToUser}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full glass ring-1 ring-[var(--glass-border)] px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/5 transition"
            aria-label="Center on my location"
          >
            <Navigation className="h-3.5 w-3.5 text-red-500" />
            My location
          </button>
        )}

        {/* Enable location later (after decline) */}
        {ready && consent === "denied" && (
          <button
            onClick={requestLocation}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full glass ring-1 ring-[var(--glass-border)] px-3 py-1.5 text-xs text-foreground/75 hover:text-foreground transition"
          >
            <MapPin className="h-3.5 w-3.5" />
            Enable location
          </button>
        )}

        {/* Legend */}
        {ready && (
          <div className="pointer-events-none absolute left-4 top-4 hidden sm:flex flex-col gap-1.5 rounded-2xl glass ring-1 ring-[var(--glass-border)] px-3 py-2.5 text-[11px] text-foreground/85">
            <div className="font-medium uppercase tracking-[0.18em] text-muted-foreground">Trails</div>
            {Object.entries(PIN_COLOR_BY_TRAIL).map(([slug, color]) => (
              <div key={slug} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/40" style={{ background: color }} />
                <span>{trailLookup.get(slug)?.title ?? slug}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-jade ring-1 ring-white/40" />
              <span>Visited</span>
            </div>
          </div>
        )}
      </div>

      {/* Site detail dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-3xl bg-card ring-1 ring-[var(--glass-border)] shadow-[var(--shadow-soft)] overflow-hidden"
            >
              <div className="relative px-6 pt-6 pb-5">
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-foreground/5 hover:bg-foreground/10"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-[11px] uppercase tracking-[0.22em] text-primary inline-flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  {selectedTrail?.hero} {selectedTrail?.title ?? selected.trail_slug}
                </p>
                <h3 className="mt-2 font-display text-2xl">{selected.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {selected.place}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary ring-1 ring-primary/25 px-2.5 py-1">
                    <Coins className="h-3 w-3" /> {selected.coin_reward} coins
                  </span>
                  <span className="text-muted-foreground">Check-in radius {selected.radius_m} m</span>
                  {selectedVisited && (
                    <span className="rounded-full bg-jade/15 text-jade ring-1 ring-jade/30 px-2.5 py-1 font-medium">
                      ✓ Visited
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {!selectedVisited && (
                    <button
                      onClick={() => attemptCheckIn(selected)}
                      disabled={isPending || !user}
                      className="btn-glossy inline-flex items-center gap-2 rounded-full gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)] disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                      Check in here
                    </button>
                  )}
                  {!user && (
                    <Link
                      to="/auth"
                      search={{ mode: "signin" }}
                      className="rounded-full bg-foreground/5 px-4 py-2 text-sm hover:bg-foreground/10"
                    >
                      Sign in to earn coins
                    </Link>
                  )}
                  <Link
                    to="/trails/$slug"
                    params={{ slug: selected.trail_slug }}
                    className="rounded-full bg-foreground/5 px-4 py-2 text-sm hover:bg-foreground/10"
                  >
                    Open trail
                  </Link>
                  {import.meta.env.DEV && user && !selectedVisited && (
                    <button
                      onClick={() => attemptCheckIn(selected, true)}
                      disabled={isPending}
                      className="rounded-full bg-foreground/5 px-3 py-2 text-xs text-foreground/60 hover:text-foreground"
                      title="Dev only — bypass geolocation"
                    >
                      Demo
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
