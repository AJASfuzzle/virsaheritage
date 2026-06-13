import { AnimatePresence, motion } from "framer-motion";
import { Clock, History, MapPin, Search, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import map1800 from "@/assets/map-1800-v8.png.asset.json";
import map1900 from "@/assets/map-1900-v7.png.asset.json";
import map1947 from "@/assets/map-1947-v7.png.asset.json";
import map1984 from "@/assets/map-1984-v7.png.asset.json";
import map2026 from "@/assets/map-2026-v7.png.asset.json";

type Pin = {
  id: string;
  lat: number;
  lon: number;
  region: string;
  craft: string;
  note: string;
};

type Bounds = { lonMin: number; lonMax: number; latMin: number; latMax: number };

type Era = {
  year: number;
  tag: string;
  title: string;
  body: string;
  mapUrl: string;
  aspect: number; // width / height of the cropped map image
  bounds: Bounds; // geographic bounds that align with the image edges
  pins: Pin[];
};

// Bounds were calibrated so the cropped image's aspect ratio matches
// (lonMax-lonMin)/(latMax-latMin). Centered on the country in each era.
const eras: Era[] = [
  {
    year: 1800,
    tag: "Age of Kingdoms",
    title: "A subcontinent of sovereigns",
    body: "Sikh misls, Maratha confederacies, Rajput houses and southern princely states each guard their own court arts, looms and kilns.",
    mapUrl: map1800.url,
    aspect: 0.812,
    // A.K. Johnston 1799–1806 map — image extends from ~3°N (south of Ceylon) to ~37°N
    bounds: { lonMin: 67, lonMax: 95, latMin: 3, latMax: 37 },
    pins: [
      { id: "1800-kashmir", lat: 34.1, lon: 74.8, region: "Kashmir", craft: "Pashmina & Kani shawls", note: "Changthangi wool hand-woven on twill-tapestry looms for Mughal and Persian courts." },
      { id: "1800-punjab", lat: 31.6, lon: 74.9, region: "Punjab (Sikh Misls)", craft: "Phulkari embroidery", note: "Flower-work shawls stitched by women for weddings and harvest." },
      { id: "1800-rajputana", lat: 26.9, lon: 75.8, region: "Rajputana", craft: "Bandhani tie-dye", note: "Tiny knotted dots forming odhnis worn across desert courts." },
      { id: "1800-awadh", lat: 26.8, lon: 80.9, region: "Awadh (Lucknow)", craft: "Chikankari", note: "White-on-white shadow embroidery refined under Nawabi ateliers." },
      { id: "1800-bengal", lat: 23.8, lon: 90.4, region: "Bengal", craft: "Jamdani muslin", note: "Air-light Dhaka muslin patterned on the loom itself." },
      { id: "1800-sindhia", lat: 26.2, lon: 78.2, region: "Sindhia / Maratha Gwalior", craft: "Chanderi weaving", note: "Sheer cotton-silk saris patronised by Maratha queens." },
      { id: "1800-cp", lat: 21.1, lon: 79.1, region: "Central Provinces", craft: "Gond painting", note: "Forest-spirit murals dotted in natural pigment by Gond clans." },
      { id: "1800-nizam", lat: 17.4, lon: 78.5, region: "Nizam Dominions", craft: "Bidriware", note: "Blackened zinc-copper alloy inlaid with silver thread." },
      { id: "1800-mysore", lat: 12.3, lon: 76.7, region: "Mysore", craft: "Mysore silk & sandalwood", note: "Court looms of Wodeyar Mysore wove gold-bordered silks." },
      { id: "1800-travancore", lat: 8.5, lon: 76.9, region: "Travancore", craft: "Aranmula Kannadi", note: "Hand-polished metal mirrors cast by a single family lineage." },
    ],
  },
  {
    year: 1900,
    tag: "British Raj",
    title: "Crown rule over a patchwork of courts",
    body: "British presidencies stretch from Punjab to Madras while princely states keep their darbars alive. Railways carry crafts to world fairs.",
    mapUrl: map1900.url,
    aspect: 1.117,
    // 1900 reference map (Persia → Siam, calibrated against Delhi/Calcutta/Bombay)
    bounds: { lonMin: 57, lonMax: 104, latMin: 2, latMax: 44 },
    pins: [
      { id: "1900-punjab", lat: 31.6, lon: 74.9, region: "Punjab Province", craft: "Phulkari & Pashmina trade", note: "Amritsar becomes a hub for Kashmiri shawls bound for Europe." },
      { id: "1900-up", lat: 26.8, lon: 80.9, region: "United Provinces (Oudh)", craft: "Chikankari & Banarasi silk", note: "Lucknow shadow-work and Varanasi brocades dominate festive wardrobes." },
      { id: "1900-rajputana", lat: 26.9, lon: 75.8, region: "Rajputana Agency", craft: "Blue pottery of Jaipur", note: "Quartz-based cobalt ceramics revived under Sawai Ram Singh II." },
      { id: "1900-bengal", lat: 22.6, lon: 88.4, region: "Bengal Presidency", craft: "Kantha embroidery", note: "Layered old saris stitched with running thread into quilts and stories." },
      { id: "1900-assam", lat: 26.1, lon: 91.7, region: "Assam", craft: "Muga silk", note: "Golden-yellow silk reared only along the Brahmaputra." },
      { id: "1900-bombay", lat: 19.1, lon: 72.9, region: "Bombay Presidency", craft: "Paithani sari & Warli art", note: "Yeola looms weave peacock pallus; Adivasi villages paint ritual murals." },
      { id: "1900-hyderabad", lat: 17.4, lon: 78.5, region: "Hyderabad State", craft: "Bidriware", note: "Silver-inlaid hookahs and pandans crafted by Bidar artisans." },
      { id: "1900-mysore", lat: 12.3, lon: 76.7, region: "Mysore State", craft: "Mysore silk", note: "Wodeyars set up state silk farms; the zari-bordered sari becomes iconic." },
      { id: "1900-madras", lat: 13.1, lon: 80.3, region: "Madras Presidency", craft: "Tanjore painting", note: "Gold-leaf devotional panels patronised by the Maratha Bhonsles of Thanjavur." },
      { id: "1900-goa", lat: 15.5, lon: 73.8, region: "Portuguese Goa", craft: "Azulejo tiles & Kunbi weave", note: "Indo-Portuguese tilework on church facades and old Goan homes." },
    ],
  },
  {
    year: 1947,
    tag: "Independence",
    title: "A new union of states",
    body: "Princely states accede, lines are redrawn, refugees carry recipes and looms across new borders. Crafts become quiet markers of identity.",
    mapUrl: map1947.url,
    aspect: 0.798,
    // 1947 India reference (calibrated against Delhi/Calcutta/Andaman)
    bounds: { lonMin: 67, lonMax: 95, latMin: 4, latMax: 39 },
    pins: [
      { id: "1947-punjab", lat: 30.7, lon: 76.8, region: "East Punjab", craft: "Phulkari", note: "Bagh shawls carried by Partition refugees from Lyallpur into Patiala and Delhi." },
      { id: "1947-up", lat: 26.8, lon: 80.9, region: "United Provinces", craft: "Chikankari & Banarasi brocade", note: "Lucknow and Varanasi remain the workshops of the Indo-Gangetic plain." },
      { id: "1947-rajasthan", lat: 26.9, lon: 75.8, region: "Rajasthan", craft: "Blue pottery & Bandhani", note: "Jaipur, Jodhpur and Sanganer keep their court crafts." },
      { id: "1947-mb", lat: 22.7, lon: 75.9, region: "Madhya Bharat", craft: "Chanderi & Maheshwari", note: "Holkar-patronised Maheshwari saris re-enter national wardrobes." },
      { id: "1947-bihar", lat: 25.6, lon: 85.1, region: "Bihar", craft: "Madhubani painting", note: "Courtyard murals first 'discovered' by the wider world after the 1934 quake." },
      { id: "1947-wb", lat: 22.6, lon: 88.4, region: "West Bengal", craft: "Kantha & Baluchari", note: "Refugee women from East Bengal carry the kantha stitch into Bengal's cities." },
      { id: "1947-assam", lat: 26.1, lon: 91.7, region: "Assam", craft: "Muga & Eri silk", note: "Sualkuchi villages weave golden Muga for the post-independence elite." },
      { id: "1947-orissa", lat: 20.3, lon: 85.8, region: "Orissa", craft: "Pattachitra & Sambalpuri ikat", note: "Palm-leaf scrolls of Jagannath stories and tie-dyed ikat saris." },
      { id: "1947-bombay", lat: 19.1, lon: 72.9, region: "Bombay State", craft: "Warli & Paithani", note: "Tribal Warli art and Yeola's peacock saris share one administrative roof." },
      { id: "1947-hyderabad", lat: 17.4, lon: 78.5, region: "Hyderabad State", craft: "Bidriware & Pochampally ikat", note: "Nizam-era ateliers persist even as the state merges into the Union." },
      { id: "1947-mysore", lat: 12.3, lon: 76.7, region: "Mysore State", craft: "Mysore silk & Channapatna toys", note: "Lacquered wooden toys ride the new Indian Railways to children nationwide." },
      { id: "1947-madras", lat: 13.1, lon: 80.3, region: "Madras State", craft: "Kanchipuram silk", note: "Temple-town looms weave triple-ply zari saris for the republic's weddings." },
      { id: "1947-tc", lat: 9.9, lon: 76.3, region: "Travancore–Cochin", craft: "Kasavu & Aranmula mirror", note: "Off-white cotton with gold border becomes Kerala's signature drape." },
    ],
  },
  {
    year: 1984,
    tag: "Reorganised India",
    title: "Linguistic states, living looms",
    body: "After the States Reorganisation Act and the formation of the North-East, India is a federation of language-defined states.",
    mapUrl: map1984.url,
    aspect: 1.113,
    bounds: { lonMin: 60, lonMax: 99, latMin: 4, latMax: 39 },
    pins: [
      { id: "1984-jk", lat: 34.1, lon: 74.8, region: "Jammu & Kashmir", craft: "Pashmina & Sozni", note: "Srinagar's Kanihama weavers continue Mughal-era jamawars." },
      { id: "1984-hp", lat: 31.1, lon: 77.2, region: "Himachal Pradesh", craft: "Kullu & Kinnauri shawls", note: "Geometric border shawls woven across the upper Beas valley." },
      { id: "1984-punjab", lat: 30.9, lon: 75.4, region: "Punjab", craft: "Phulkari", note: "GI-protected floral embroidery from Patiala and Bathinda." },
      { id: "1984-haryana", lat: 29.0, lon: 76.5, region: "Haryana", craft: "Surajkund pottery & durries", note: "The famed Surajkund crafts mela begins (1987)." },
      { id: "1984-rajasthan", lat: 26.9, lon: 74.0, region: "Rajasthan", craft: "Blue pottery & miniature painting", note: "Jaipur and Kishangarh schools sustain Mughal-Rajput miniature." },
      { id: "1984-up", lat: 26.8, lon: 80.9, region: "Uttar Pradesh", craft: "Chikankari & Banarasi silk", note: "Lucknow and Varanasi continue as the bridal trousseau's heart." },
      { id: "1984-bihar", lat: 25.6, lon: 85.1, region: "Bihar", craft: "Madhubani / Mithila painting", note: "Now exported worldwide on paper, silk and sarees." },
      { id: "1984-wb", lat: 22.9, lon: 87.9, region: "West Bengal", craft: "Kantha & Baluchari", note: "Bishnupur's mythic-scene silk saris and rural kantha quilts." },
      { id: "1984-sikkim", lat: 27.5, lon: 88.5, region: "Sikkim", craft: "Thangka & Lepcha weaving", note: "Buddhist scroll painting and bamboo-loom textiles." },
      { id: "1984-assam", lat: 26.2, lon: 92.9, region: "Assam", craft: "Muga silk", note: "Only state to produce golden Muga; weavers' cooperatives expand." },
      { id: "1984-naga", lat: 25.7, lon: 94.1, region: "Nagaland", craft: "Naga shawls", note: "Tribe-specific patterns — Ao, Angami, Sumi — woven on loin looms." },
      { id: "1984-manipur", lat: 24.7, lon: 93.9, region: "Manipur", craft: "Moirang Phee & Phanek", note: "Temple-motif borders woven in Imphal's home looms." },
      { id: "1984-mp", lat: 23.3, lon: 78.0, region: "Madhya Pradesh", craft: "Chanderi & Maheshwari", note: "Rehwa Society revives Maheshwari weaving on the Narmada." },
      { id: "1984-gujarat", lat: 22.5, lon: 71.2, region: "Gujarat", craft: "Patola silk & Bandhani", note: "Patan's double-ikat Patola — months on a single sari." },
      { id: "1984-orissa", lat: 20.3, lon: 85.0, region: "Orissa", craft: "Pattachitra & Sambalpuri ikat", note: "Bandha tie-dye weaving from Bargarh; Raghurajpur painters." },
      { id: "1984-mh", lat: 19.5, lon: 75.7, region: "Maharashtra", craft: "Paithani & Warli", note: "Warli enters Bombay's design schools and gallery circuits." },
      { id: "1984-ap", lat: 16.5, lon: 80.0, region: "Andhra Pradesh", craft: "Kalamkari & Bidriware", note: "Sri Kalahasti pen-painted cottons telling Puranic stories." },
      { id: "1984-goa", lat: 15.5, lon: 73.9, region: "Goa (UT)", craft: "Azulejo tiles", note: "Indo-Portuguese tile art revived for Goan villas and churches." },
      { id: "1984-ktk", lat: 14.5, lon: 76.0, region: "Karnataka", craft: "Mysore silk & Channapatna toys", note: "Lacquer-turned wooden toys become the state's children's icon." },
      { id: "1984-tn", lat: 11.1, lon: 78.7, region: "Tamil Nadu", craft: "Kanchipuram silk & Tanjore painting", note: "Temple silks and gold-foil devotional panels." },
      { id: "1984-kerala", lat: 10.5, lon: 76.3, region: "Kerala", craft: "Kasavu & Aranmula Kannadi", note: "Onam wardrobes drape the gold-bordered Kasavu mundu." },
    ],
  },
  {
    year: 2026,
    tag: "Living Atlas",
    title: "Twenty-eight states, a thousand crafts",
    body: "GI tags, e-commerce and KAAL itself help artisans reach the world. Memory becomes a map you can search.",
    mapUrl: map2026.url,
    aspect: 0.839,
    bounds: { lonMin: 67, lonMax: 98, latMin: 6, latMax: 37 },
    pins: [
      { id: "2026-ladakh", lat: 34.2, lon: 77.6, region: "Ladakh (UT)", craft: "Thangka & Pashmina", note: "Changpa nomads herd the goats whose wool becomes the world's finest shawl." },
      { id: "2026-jk", lat: 34.1, lon: 74.8, region: "Jammu & Kashmir (UT)", craft: "Pashmina, Sozni, Papier-mâché", note: "Srinagar's craft economy among the densest in the world." },
      { id: "2026-hp", lat: 31.6, lon: 77.2, region: "Himachal Pradesh", craft: "Kullu & Kinnauri shawls", note: "GI-tagged geometric-bordered wool shawls." },
      { id: "2026-punjab", lat: 30.9, lon: 75.4, region: "Punjab", craft: "Phulkari", note: "Co-operatives in Patiala and Sangrur lead a global revival." },
      { id: "2026-uk", lat: 30.1, lon: 79.0, region: "Uttarakhand", craft: "Aipan art", note: "Red-and-white ritual floor paintings of the Kumaon hills." },
      { id: "2026-haryana", lat: 29.1, lon: 76.5, region: "Haryana", craft: "Surajkund pottery & durries", note: "Surajkund Mela hosts artisans from every state each February." },
      { id: "2026-delhi", lat: 28.6, lon: 77.2, region: "Delhi (UT)", craft: "Zardozi & Meenakari", note: "Old Delhi's karkhanas embroider couture for global runways." },
      { id: "2026-rajasthan", lat: 26.9, lon: 73.5, region: "Rajasthan", craft: "Blue pottery, Bandhani, Miniatures", note: "Jaipur Literature, Jodhpur RIFF and craft melas anchor the calendar." },
      { id: "2026-up", lat: 26.8, lon: 80.9, region: "Uttar Pradesh", craft: "Chikankari & Banarasi silk", note: "Lucknow and Varanasi remain India's largest craft economies." },
      { id: "2026-bihar", lat: 25.6, lon: 85.1, region: "Bihar", craft: "Madhubani painting", note: "Now seen on railway stations, sneakers and fashion runways." },
      { id: "2026-jharkhand", lat: 23.4, lon: 85.3, region: "Jharkhand", craft: "Sohrai & Khovar painting", note: "Harvest and wedding murals by Santhal and Kurmi women of Hazaribagh." },
      { id: "2026-wb", lat: 22.9, lon: 87.9, region: "West Bengal", craft: "Kantha, Baluchari & Dokra", note: "Birbhum and Bishnupur run designer-craft collaborations." },
      { id: "2026-sikkim", lat: 27.5, lon: 88.5, region: "Sikkim", craft: "Thangka & Lepcha weaving", note: "Monastery-trained painters and bamboo-loom textiles." },
      { id: "2026-arunachal", lat: 27.6, lon: 93.6, region: "Arunachal Pradesh", craft: "Apatani & Monpa weaves", note: "Wool shawls and bamboo hats from the eastern Himalayan tribes." },
      { id: "2026-assam", lat: 26.2, lon: 92.9, region: "Assam", craft: "Muga silk & bamboo", note: "Sualkuchi's golden Muga remains exclusive to the Brahmaputra valley." },
      { id: "2026-meghalaya", lat: 25.5, lon: 91.4, region: "Meghalaya", craft: "Khasi-Jaintia bamboo & cane", note: "Living-root bridges and woven homeware of the Khasi hills." },
      { id: "2026-nagaland", lat: 25.7, lon: 94.4, region: "Nagaland", craft: "Naga shawls & wood carving", note: "Hornbill Festival showcases tribe-specific weaves every December." },
      { id: "2026-manipur", lat: 24.7, lon: 93.9, region: "Manipur", craft: "Moirang Phee & Longpi pottery", note: "Temple-motif weaves and black-stone pottery." },
      { id: "2026-mizoram", lat: 23.4, lon: 92.9, region: "Mizoram", craft: "Puanchei textile", note: "Bridal shawls woven in red, white and black on loin looms." },
      { id: "2026-tripura", lat: 23.7, lon: 91.6, region: "Tripura", craft: "Risa & bamboo craft", note: "Tribal Risa wrap, woven by Tripuri and Reang women." },
      { id: "2026-mp", lat: 23.3, lon: 78.0, region: "Madhya Pradesh", craft: "Chanderi, Maheshwari & Gond art", note: "Gond painters from Jangarh Singh Shyam's lineage exhibit worldwide." },
      { id: "2026-chhattisgarh", lat: 21.3, lon: 81.6, region: "Chhattisgarh", craft: "Dhokra metal casting", note: "4,000-year-old lost-wax bronze tradition of the Bastar adivasis." },
      { id: "2026-gujarat", lat: 22.5, lon: 71.2, region: "Gujarat", craft: "Patola, Bandhani & Rogan art", note: "Nirona village's last Rogan painters keep an 8-family tradition alive." },
      { id: "2026-odisha", lat: 20.3, lon: 85.0, region: "Odisha", craft: "Pattachitra & Sambalpuri ikat", note: "Raghurajpur heritage village trains a new generation of painters." },
      { id: "2026-mh", lat: 19.5, lon: 75.7, region: "Maharashtra", craft: "Paithani & Warli", note: "Warli enters museum collections from Mumbai to MoMA." },
      { id: "2026-telangana", lat: 17.4, lon: 78.5, region: "Telangana", craft: "Pochampally Ikat & Bidriware", note: "India's first GI-tagged handloom; double-ikat silk-cotton." },
      { id: "2026-ap", lat: 15.9, lon: 80.0, region: "Andhra Pradesh", craft: "Kalamkari", note: "Sri Kalahasti's pen-drawn, vegetable-dyed cottons go global." },
      { id: "2026-goa", lat: 15.5, lon: 73.9, region: "Goa", craft: "Azulejo tiles & coconut craft", note: "Indo-Portuguese tilework revived by contemporary Goan studios." },
      { id: "2026-karnataka", lat: 14.5, lon: 76.0, region: "Karnataka", craft: "Mysore silk & Channapatna toys", note: "GI-tagged lacquerware now sold from Tokyo to Toronto." },
      { id: "2026-tn", lat: 11.1, lon: 78.7, region: "Tamil Nadu", craft: "Kanchipuram silk & Thanjavur paintings", note: "Temple-town crafts thrive on weddings and online couture." },
      { id: "2026-kerala", lat: 10.0, lon: 76.5, region: "Kerala", craft: "Kasavu & Aranmula Kannadi", note: "One of only nine GI-tagged metal crafts in India." },
    ],
  },
];

// Convert geographic lat/lon to percentage position inside the cropped map image.
function pinXY(pin: Pin, b: Bounds) {
  const x = ((pin.lon - b.lonMin) / (b.lonMax - b.lonMin)) * 100;
  const y = ((b.latMax - pin.lat) / (b.latMax - b.latMin)) * 100;
  return { x, y };
}

const HISTORY_KEY = "kaal:explored:v2";

function useExplored() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  const persist = (next: string[]) => {
    setIds(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  };
  const add = (id: string) => persist([id, ...ids.filter((x) => x !== id)].slice(0, 12));
  const clear = () => persist([]);
  return { ids, add, clear };
}

export function IndiaMap() {
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [active, setActive] = useState<Pin | null>(null);
  const [query, setQuery] = useState("");
  const { ids: explored, add, clear } = useExplored();

  const era = eras.find((e) => e.year === activeYear)!;

  const filtered = useMemo(() => {
    if (!query) return era.pins;
    const q = query.toLowerCase();
    return era.pins.filter((p) => `${p.region} ${p.craft} ${p.note}`.toLowerCase().includes(q));
  }, [era, query]);

  const recentlyExplored = explored
    .map((id) => {
      for (const e of eras) {
        const p = e.pins.find((x) => x.id === id);
        if (p) return { ...p, year: e.year };
      }
      return null;
    })
    .filter((p): p is Pin & { year: number } => Boolean(p));

  const open = (p: Pin) => {
    setActive(p);
    add(p.id);
  };

  // Silhouette PNGs are already pre-filled with a single saffron tone, so
  // no CSS colour treatment is needed.



  return (
    <section id="explore" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Atlas</p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-4xl sm:text-5xl">
              A living map of <span className="italic text-gradient-ember">a thousand Indias</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Step through the eras. Every glowing pin holds a kingdom, a state
              and the craft it gave the world.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {eras.map((e) => (
              <button
                key={e.year}
                onClick={() => setActiveYear(e.year)}
                className={`btn-glossy whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition ${
                  activeYear === e.year
                    ? "gradient-ember text-primary-foreground shadow-[0_8px_22px_-10px_oklch(0.74_0.13_75/0.8)]"
                    : "glass text-foreground/80 hover:text-foreground"
                }`}
              >
                {e.year}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <div className="font-display text-2xl text-foreground">{era.title}</div>
          <div className="text-xs uppercase tracking-[0.22em] text-primary/80">{era.tag}</div>
          <p className="basis-full text-sm text-muted-foreground max-w-3xl">{era.body}</p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] glass grain shadow-[var(--shadow-soft)]">
          <div className="relative h-[62vh] min-h-[520px] w-full">
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_30%,oklch(0.74_0.13_75/0.18),transparent_60%),radial-gradient(ellipse_at_70%_80%,oklch(0.20_0.06_270/0.25),transparent_60%)]" />

            {/* Map + pin stage: a wrapper whose aspect ratio matches the
                cropped image. The image fills it, and pins are positioned
                in the same coordinate space, so they land on the right
                geography regardless of viewport size. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={era.year}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 m-auto flex items-center justify-center"
              >
                <div
                  className="relative h-[94%]"
                  style={{ aspectRatio: era.aspect }}
                >
                  <img
                    src={era.mapUrl}
                    alt={`Map of India in ${era.year}`}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_40px_oklch(0.20_0.06_270/0.45)]"
                  />

                  {/* Pins are positioned inside the same box as the image,
                      using lat/lon → % conversion. */}
                  {filtered.map((p, i) => {
                    const { x, y } = pinXY(p, era.bounds);
                    if (x < 0 || x > 100 || y < 0 || y > 100) return null;
                    const visited = explored.includes(p.id);
                    return (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + i * 0.02, type: "spring", stiffness: 180, damping: 14 }}
                        onClick={() => open(p)}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        aria-label={`Explore ${p.region}`}
                      >
                        <span className={`absolute -inset-3 rounded-full blur-md animate-pulse-pin ${visited ? "bg-jade/40" : "bg-primary/30"}`} />
                        <span className={`relative block h-3 w-3 rounded-full ring-2 ring-background shadow-[0_0_18px_oklch(0.74_0.13_75/0.9)] ${visited ? "bg-jade" : "bg-primary"}`} />
                        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] opacity-0 transition group-hover:opacity-100">
                          {p.region}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute left-1/2 top-6 w-[min(90%,460px)] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full glass px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${era.year} — region, craft, tradition…`}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  {era.year}
                </span>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 rounded-full glass px-3 py-2 text-xs text-foreground/70">
              {filtered.length} of {era.pins.length} regions
            </div>
          </div>
        </div>

        {/* Era slider */}
        <div className="mt-6 rounded-2xl glass p-4">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[7px] h-px bg-foreground/15" />
            <div className="flex items-center justify-between relative">
              {eras.map((e) => (
                <button
                  key={e.year}
                  onClick={() => setActiveYear(e.year)}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full transition-all ${
                      activeYear === e.year
                        ? "bg-primary ring-4 ring-primary/25 scale-125"
                        : "bg-foreground/30 group-hover:bg-foreground/60"
                    }`}
                  />
                  <span className={`font-display text-xs transition ${activeYear === e.year ? "text-foreground" : "text-foreground/50"}`}>
                    {e.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Explored */}
        {recentlyExplored.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 rounded-3xl glass p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <History className="h-3.5 w-3.5 text-primary" /> Recently Explored
              </div>
              <button
                onClick={clear}
                className="btn-glossy inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" /> Clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentlyExplored.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveYear(p.year); open(p); }}
                  className="btn-glossy inline-flex items-center gap-2 rounded-full bg-background/40 px-3 py-1.5 text-xs ring-1 ring-white/5 hover:bg-background/60"
                >
                  <MapPin className="h-3 w-3 text-jade" />
                  <span className="text-foreground/85">{p.region}</span>
                  <span className="text-muted-foreground">· {p.year}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Rich pop-up */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass grain p-7 shadow-[var(--shadow-soft)]"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="btn-glossy absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-background/50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-xs uppercase tracking-[0.28em] text-primary/90">Local Craft</div>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl text-balance">{active.craft}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {active.region}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {era.year} · {era.tag}</span>
              </div>

              <p className="mt-5 text-foreground/85 leading-relaxed text-pretty">{active.note}</p>

              <div className="mt-6 rounded-2xl bg-background/40 p-4 ring-1 ring-white/5">
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" /> Era context
                </div>
                <p className="mt-2 text-sm text-foreground/85">{era.title} — {era.body}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-muted-foreground">
                <span>Saved to your <span className="text-foreground">Recently Explored</span> trail.</span>
                <a href="#shruti" onClick={() => setActive(null)} className="text-foreground hover:text-primary transition">
                  Hear voices from this region →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
