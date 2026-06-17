export type HeritageCategory =
  | "Archaeology"
  | "Nature"
  | "Architecture"
  | "Art & Crafts"
  | "Living Heritage";

export type QuickFact = { label: string; value: string };

export type HeritageSite = {
  id: string;
  name: string;
  category: HeritageCategory;
  lat: number;
  lon: number;
  region: string;
  shortDescription: string;
  fullDescription: string[]; // paragraphs
  quickFacts: QuickFact[];
  imageUrl: string;
};

// Curated seed list — accurate coordinates, factual capsule descriptions.
export const heritageSites: HeritageSite[] = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    category: "Architecture",
    lat: 27.1751,
    lon: 78.0421,
    region: "Agra, Uttar Pradesh",
    shortDescription:
      "The 17th-century white marble mausoleum built by Shah Jahan for Mumtaz Mahal.",
    fullDescription: [
      "Commissioned in 1632 by the Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal sits on the south bank of the Yamuna in Agra. Two decades of work by some 20,000 artisans produced a perfectly symmetrical complex of mausoleum, mosque, jawab and charbagh garden, faced entirely in translucent Makrana marble.",
      "Inlay work known as parchin kari studs the surfaces with jasper, jade, carnelian and lapis lazuli, often in floral arabesques inherited from Persian and Central Asian ateliers. Calligraphic bands of Quranic verse, designed by Amanat Khan, frame the great iwans and grow subtly larger up the walls so the script reads true from the ground.",
      "Inscribed as a UNESCO World Heritage Site in 1983, the Taj is widely considered the apex of Indo-Islamic architecture and remains India's most recognised monument.",
    ],
    quickFacts: [
      { label: "Built", value: "1632–1653" },
      { label: "Commissioned by", value: "Shah Jahan" },
      { label: "UNESCO status", value: "World Heritage Site (1983)" },
      { label: "Best time to visit", value: "October to March, at sunrise" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hampi",
    name: "Hampi",
    category: "Archaeology",
    lat: 15.335,
    lon: 76.46,
    region: "Vijayanagara, Karnataka",
    shortDescription:
      "Boulder-strewn ruins of Vijayanagara, once one of the richest cities in the world.",
    fullDescription: [
      "Spread across a 36-square-kilometre landscape of granite outcrops along the Tungabhadra, Hampi is the surviving footprint of Vijayanagara — capital of the eponymous empire that ruled much of southern India between the 14th and 16th centuries. At its peak under Krishnadevaraya it rivalled contemporary Beijing in size and wealth.",
      "More than 1,600 surviving monuments include the Virupaksha Temple (still in active worship), the musical stone pillars of the Vittala complex, the iconic stone chariot, royal enclosures, elephant stables and aqueducts. Bazaars once stretched for kilometres outside the temples, trading horses from Arabia and diamonds from Golconda.",
      "The city was sacked in 1565 after the Battle of Talikota and never reoccupied, leaving an unusually intact medieval South Indian urban landscape that UNESCO inscribed in 1986.",
    ],
    quickFacts: [
      { label: "Flourished", value: "14th–16th century" },
      { label: "Empire", value: "Vijayanagara" },
      { label: "UNESCO status", value: "World Heritage Site (1986)" },
      { label: "Best time to visit", value: "November to February" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1600100397285-1d265ea5076d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "kaziranga",
    name: "Kaziranga National Park",
    category: "Nature",
    lat: 26.577,
    lon: 93.171,
    region: "Golaghat & Nagaon, Assam",
    shortDescription:
      "Brahmaputra floodplain that shelters two-thirds of the world's one-horned rhinos.",
    fullDescription: [
      "Stretching along the southern bank of the Brahmaputra, Kaziranga is a mosaic of tall elephant grass, marshlands and dense tropical forest formed by the river's annual floods. The 1,090-square-kilometre park was given protected status in 1905 after Mary Curzon's failed search for a single rhino convinced the viceroy to act.",
      "It now holds the largest population of the greater one-horned rhinoceros on Earth, alongside one of the densest tiger populations in India, wild water buffalo, swamp deer and Eastern swamp francolins. Migratory pelicans and bar-headed geese arrive each winter.",
      "Inscribed as a UNESCO World Heritage Site in 1985, Kaziranga is managed through an unusual flood-led ecology: each monsoon drowns most of the park, refreshing the grasslands but forcing animals onto raised highlands across the highway.",
    ],
    quickFacts: [
      { label: "Established", value: "1905 (Reserved Forest)" },
      { label: "Famous for", value: "One-horned rhinoceros" },
      { label: "UNESCO status", value: "World Heritage Site (1985)" },
      { label: "Best time to visit", value: "November to April" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "khajuraho",
    name: "Khajuraho Group of Temples",
    category: "Art & Crafts",
    lat: 24.8318,
    lon: 79.9199,
    region: "Chhatarpur, Madhya Pradesh",
    shortDescription:
      "Chandela-era sandstone temples celebrated for their dense, virtuosic sculpture.",
    fullDescription: [
      "Built between 950 and 1050 CE by the Chandela dynasty, the Khajuraho temples once numbered 85; about 25 survive today, scattered across Western, Eastern and Southern groups. They were carved from local sandstone in the Nagara style, set on high jagati platforms and crowned with soaring shikharas that mimic the peaks of Mount Meru.",
      "Their exteriors are sheathed in bands of sculpture — gods and goddesses, courtly women (surasundaris), processions, and the celebrated mithuna couples that have made the site internationally famous. The artistry extends to the smallest details: musicians tuning instruments, dancers caught mid-step, animals at play.",
      "Abandoned after the 13th century, the temples were swallowed by jungle until T.S. Burt of the British East India Company stumbled on them in 1838. UNESCO inscribed the group in 1986.",
    ],
    quickFacts: [
      { label: "Built", value: "950–1050 CE" },
      { label: "Dynasty", value: "Chandela" },
      { label: "UNESCO status", value: "World Heritage Site (1986)" },
      { label: "Best time to visit", value: "October to March" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1609947017136-d5b7f1f4d391?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "jaisalmer-fort",
    name: "Jaisalmer Fort",
    category: "Living Heritage",
    lat: 26.9124,
    lon: 70.9128,
    region: "Jaisalmer, Rajasthan",
    shortDescription:
      "A 12th-century golden-sandstone fort in the Thar desert still inhabited by thousands.",
    fullDescription: [
      "Founded in 1156 by the Bhati Rajput ruler Rao Jaisal on Trikuta Hill, Jaisalmer Fort rises out of the Thar desert in golden Jurassic sandstone that turns honey-coloured at dusk — the source of its nickname, Sonar Quila. Its 99 bastions and triple ring of walls once guarded a key staging post on the trans-Saharan caravan routes between India and Central Asia.",
      "Unlike most Indian forts, Jaisalmer is a living fortress: roughly a quarter of the city's population still resides inside, sharing its alleys with Jain temples, havelis, sweet shops and stepped wells. Carved jharokhas and jaalis filter the desert light and air through facades that have stood for nearly a millennium.",
      "Inscribed by UNESCO in 2013 as part of the Hill Forts of Rajasthan, it is also one of the world's most fragile heritage sites — modern plumbing, monsoon seepage and the sheer weight of habitation continually threaten its medieval drainage system.",
    ],
    quickFacts: [
      { label: "Founded", value: "1156 CE" },
      { label: "Founder", value: "Rao Jaisal Bhati" },
      { label: "UNESCO status", value: "Hill Forts of Rajasthan (2013)" },
      { label: "Best time to visit", value: "November to February" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    category: "Nature",
    lat: 21.95,
    lon: 88.9,
    region: "South 24 Parganas, West Bengal",
    shortDescription:
      "The world's largest contiguous mangrove forest and the realm of the swimming tiger.",
    fullDescription: [
      "Where the Ganges, Brahmaputra and Meghna empty into the Bay of Bengal, their silt has woven the Sundarbans — a 10,000-square-kilometre labyrinth of tidal creeks, mudflats and dense mangrove islands shared between India and Bangladesh. The name comes from the sundari tree (Heritiera fomes), whose pneumatophores spike out of the brackish water at low tide.",
      "The Indian portion is protected as a Tiger Reserve, Biosphere Reserve and National Park; it shelters one of the few populations of Bengal tigers that habitually swim between islands and hunt in salt water. Estuarine crocodiles, Gangetic dolphins, fishing cats and the rare Olive Ridley turtle share its waters.",
      "Inscribed by UNESCO in 1987, the Sundarbans are also one of the world's most climate-vulnerable landscapes — rising seas and intensifying cyclones erode islands faster than the silt can rebuild them.",
    ],
    quickFacts: [
      { label: "Area (India)", value: "~4,260 km² of mangrove" },
      { label: "Famous for", value: "Royal Bengal tigers" },
      { label: "UNESCO status", value: "World Heritage Site (1987)" },
      { label: "Best time to visit", value: "September to March" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "ajanta-ellora",
    name: "Ajanta & Ellora Caves",
    category: "Archaeology",
    lat: 20.5519,
    lon: 75.7033,
    region: "Aurangabad, Maharashtra",
    shortDescription:
      "Two neighbouring rock-cut cave complexes spanning a thousand years of Indian religious art.",
    fullDescription: [
      "Cut into a horseshoe basalt cliff above the Waghora river, the 30 caves of Ajanta were excavated in two waves between the 2nd century BCE and the 5th century CE as Buddhist viharas (monasteries) and chaityas (prayer halls). Their walls hold the finest surviving cycle of ancient Indian painting — bodhisattvas, jataka tales and courtly scenes rendered in mineral pigment on lime plaster.",
      "Sixty kilometres away, the 34 caves of Ellora were carved between the 6th and 10th centuries and uniquely bring together Buddhist, Hindu and Jain shrines along a single basalt escarpment. The Kailasa Temple (Cave 16), sculpted top-down out of a single rock by Rashtrakuta artisans, is the largest monolithic excavation on Earth.",
      "Ajanta was 'lost' until 1819, when a British hunting party led by John Smith chased a tiger into the gorge. Both sites were among India's first UNESCO inscriptions, in 1983.",
    ],
    quickFacts: [
      { label: "Ajanta carved", value: "2nd c. BCE – 5th c. CE" },
      { label: "Ellora carved", value: "6th – 10th c. CE" },
      { label: "UNESCO status", value: "World Heritage Sites (1983)" },
      { label: "Best time to visit", value: "November to March" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=1600&q=80",
  },
];

export const heritageCategories: HeritageCategory[] = [
  "Archaeology",
  "Nature",
  "Architecture",
  "Art & Crafts",
  "Living Heritage",
];

// Color/icon coding per category.
export const categoryStyles: Record<
  HeritageCategory,
  { dot: string; chip: string; ring: string; label: string }
> = {
  Archaeology: {
    dot: "bg-amber-600",
    chip: "border-amber-600/40 text-amber-700 dark:text-amber-300",
    ring: "ring-amber-500/60",
    label: "text-amber-700 dark:text-amber-300",
  },
  Nature: {
    dot: "bg-emerald-600",
    chip: "border-emerald-600/40 text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-500/60",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  Architecture: {
    dot: "bg-rose-600",
    chip: "border-rose-600/40 text-rose-700 dark:text-rose-300",
    ring: "ring-rose-500/60",
    label: "text-rose-700 dark:text-rose-300",
  },
  "Art & Crafts": {
    dot: "bg-fuchsia-600",
    chip: "border-fuchsia-600/40 text-fuchsia-700 dark:text-fuchsia-300",
    ring: "ring-fuchsia-500/60",
    label: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  "Living Heritage": {
    dot: "bg-teal-600",
    chip: "border-teal-600/40 text-teal-700 dark:text-teal-300",
    ring: "ring-teal-500/60",
    label: "text-teal-700 dark:text-teal-300",
  },
};

// Bounds of the map image we render the pins over (matches map-2026 asset).
export const ATLAS_BOUNDS = {
  lonMin: 67,
  lonMax: 98,
  latMin: 6,
  latMax: 37,
};
export const ATLAS_ASPECT = 0.839; // width / height
