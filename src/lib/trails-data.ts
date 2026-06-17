export type TrailStop = {
  name: string;
  place: string;
  blurb: string;
  imageUrl?: string;
  // A short "story" paragraph — museum-quality storytelling for this stop.
  story?: string;
  // Optional hidden discovery surfaced as "Did you know?" / "Forgotten fact".
  secret?: { kind: "Did you know?" | "Forgotten fact" | "Local legend"; text: string };
};

export type Trail = {
  slug: string;
  title: string;
  days: string;
  region: string;
  kind: string;
  intro: string;
  bestSeason: string;
  hero: string; // emoji or short symbol
  // New cinematic fields (Trails 2.0).
  coverImage?: string;
  hook?: string; // one-line emotional hook
  distance?: string; // walking/driving distance
  difficulty?: "Easy" | "Moderate" | "Challenging";
  accentFrom?: string; // tailwind gradient anchor (oklch-friendly)
  accentTo?: string;
  stops: TrailStop[];
};

const img = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const trails: Trail[] = [
  {
    slug: "chettinad-spice-trail",
    title: "Chettinad Spice Trail",
    days: "5 days",
    region: "Tamil Nadu",
    kind: "Food",
    hero: "🌶️",
    bestSeason: "November – February",
    hook: "Follow the scent of cardamom through merchant palaces.",
    distance: "~120 km loop",
    difficulty: "Easy",
    coverImage: img("photo-1604908554007-3a5fd5f5b2dd"),
    accentFrom: "#c2410c",
    accentTo: "#7c2d12",
    intro:
      "Chettinad's mansions were built by 19th-century merchants who traded with Burma, Java and Ceylon — and brought spices, lacquer and Athangudi tiles home. This trail follows the kitchens, markets and family kovils that still cook the way the Nattukottai Chettiars did a hundred years ago.",
    stops: [
      {
        name: "Karaikudi Old Town",
        place: "Karaikudi",
        blurb: "Walk the spice arcades of Muneeswaran Kovil Street where star anise, marathi mokku and kalpasi are still measured in tola.",
        story: "At dawn, the wholesale spice gallis of Karaikudi already smell of warm asafoetida and pounded fennel. These were the streets the Nagarathar bankers walked to broker shipments bound for Rangoon and Penang.",
        imageUrl: img("photo-1596797038530-2c107229654b"),
        secret: { kind: "Did you know?", text: "Several Chettinad spice houses still record stock in palm-leaf ledgers alongside Excel." },
      },
      { name: "Athangudi Tile Workshops", place: "Athangudi", blurb: "See cement tiles hand-poured on glass plates — the same patterns laid into every Chettinad mansion floor.", imageUrl: img("photo-1582719478250-c89cae4dc85b"), story: "Every Athangudi tile begins as coloured cement slurry poured into a brass stencil resting on a glass plate. No two are identical — the glass leaves a glossy 'wet' shine that mass-produced tiles can never copy." },
      { name: "Kanadukathan Mansions", place: "Kanadukathan", blurb: "Stay overnight in a restored Chettiar palace with Burmese teak pillars and Belgian mirrors.", imageUrl: img("photo-1601200351562-12c4c1f6e95d"), secret: { kind: "Forgotten fact", text: "Most mansions face east — the doorway sized so the morning sun touches the family altar exactly at the equinox." } },
      { name: "Chettinad Cooking Class", place: "Kanadukathan", blurb: "Learn the Kuzhi paniyaram, Kara kuzhambu and pepper chicken from a Chettiar grandmother.", imageUrl: img("photo-1604908176997-125f25cc6f3d") },
      { name: "Pillaiyarpatti Temple", place: "Pillaiyarpatti", blurb: "A rock-cut Ganesha cave shrine dated to the 4th century — the Chettiars' kuladeivam.", imageUrl: img("photo-1561361513-2d000a50f0dc") },
      { name: "Devakottai Antique Markets", place: "Devakottai", blurb: "Bronze urulis, brass meen kuzhambu pots and old colonial enamelware from estate sales.", imageUrl: img("photo-1528698827591-e19ccd7bc23d") },
      { name: "Sunday Sandhai (Weekly Market)", place: "Karaikudi", blurb: "A full sensory mela of dried fish, hand-pounded masalas, palm jaggery and country chickens.", imageUrl: img("photo-1488459716781-31db52582fe9") },
      { name: "Kothamangalam Saree Weavers", place: "Kothamangalam", blurb: "Kandanghi cotton saris in checked maroon and mustard — the everyday drape of Chettinad women.", imageUrl: img("photo-1610030469983-98e550d6193c") },
      { name: "Aayiram Jannal Mansion", place: "Kothamangalam", blurb: "The 'thousand-window' mansion — one of the largest surviving Nagarathar homes.", imageUrl: img("photo-1599661046289-e31897846e41"), secret: { kind: "Local legend", text: "The household priest once counted 1,072 windows before giving up — locals just say 'aayiram', a thousand." } },
    ],
  },
  {
    slug: "brihadeeswarar-to-hampi",
    title: "Brihadeeswarar to Hampi",
    days: "7 days",
    region: "Tamil Nadu · Karnataka",
    kind: "Temples",
    hero: "🛕",
    bestSeason: "October – March",
    hook: "Two empires, one chariot ride through stone.",
    distance: "~640 km",
    difficulty: "Moderate",
    coverImage: img("photo-1599661046289-e31897846e41"),
    accentFrom: "#b45309",
    accentTo: "#451a03",
    intro:
      "Two empires, two capitals, one trail. From the Chola colossus at Thanjavur (1010 CE) through the Hoysala jewel-box shrines of Belur and Halebidu, ending in the boulder-strewn ruins of Vijayanagara — the largest medieval city the world had ever seen.",
    stops: [
      { name: "Brihadeeswarar Temple", place: "Thanjavur, TN", blurb: "Rajaraja Chola's 216-foot vimana built from a single 80-tonne granite cap.", imageUrl: img("photo-1582510003544-4d00b7f74220"), story: "Completed in 1010 CE, Brihadeeswarar's vimana rises taller than any temple tower built in India before it. The capstone alone weighs 80 tonnes — engineers still argue over the inclined ramp the Cholas must have used to raise it.", secret: { kind: "Did you know?", text: "The temple's shadow famously never falls on the ground at noon — an illusion created by the vimana's precise inward taper." } },
      { name: "Airavatesvara Temple", place: "Darasuram, TN", blurb: "A miniature masterpiece — singing steps and chariot-wheel mandapas.", imageUrl: img("photo-1605649487212-47bdab064df7") },
      { name: "Gangaikonda Cholapuram", place: "Jayankondam, TN", blurb: "Rajendra Chola's victory temple commemorating his march to the Ganga.", imageUrl: img("photo-1582719478250-c89cae4dc85b") },
      { name: "Chennakeshava Temple", place: "Belur, KA", blurb: "Hoysala soapstone carving so fine you can pass a thread through the bracelets.", imageUrl: img("photo-1609947017136-d5b7f1f4d391"), secret: { kind: "Forgotten fact", text: "Hoysala sculptors signed their work — over 40 artist names are still legible on the Belur friezes." } },
      { name: "Hoysaleswara Temple", place: "Halebidu, KA", blurb: "Twin shrines on a star-plinth, every surface a frieze of elephants, gods and dancers.", imageUrl: img("photo-1600100397285-1d265ea5076d") },
      { name: "Chitradurga Fort", place: "Chitradurga, KA", blurb: "Seven concentric walls climbing a granite massif — the Madakari Nayakas' last stand.", imageUrl: img("photo-1596703263926-eedb1ea2c0fb") },
      { name: "Virupaksha Temple", place: "Hampi, KA", blurb: "The only Vijayanagara temple still in active worship, 7th century onward.", imageUrl: img("photo-1600100397285-1d265ea5076d") },
      { name: "Vittala Temple", place: "Hampi, KA", blurb: "Stone chariot and musical pillars — the high noon of Vijayanagara art.", imageUrl: img("photo-1582719478250-c89cae4dc85b"), secret: { kind: "Local legend", text: "Tap the right pillar in the Ranga Mandapa and it rings a perfect Sa; the British supposedly cut one open to check whether it was hollow." } },
      { name: "Royal Enclosure", place: "Hampi, KA", blurb: "Mahanavami platform, queens' bath, lotus mahal and the elephant stables.", imageUrl: img("photo-1605649487212-47bdab064df7") },
      { name: "Anegundi Village", place: "Anegundi, KA", blurb: "Older than Hampi itself — the mythic Kishkindha of the Ramayana.", imageUrl: img("photo-1596703263926-eedb1ea2c0fb") },
      { name: "Hemakuta Hill at Sunset", place: "Hampi, KA", blurb: "Pre-Vijayanagara shrines on the hill where Shiva is said to have married Pampa.", imageUrl: img("photo-1605649487212-47bdab064df7") },
      { name: "Coracle Ride on Tungabhadra", place: "Hampi, KA", blurb: "Round bamboo boats below the Vittala bridge ruins — exactly as in 1565.", imageUrl: img("photo-1600100397285-1d265ea5076d") },
    ],
  },
  {
    slug: "bhuj-craft-villages",
    title: "Bhuj Craft Villages",
    days: "4 days",
    region: "Kachchh, Gujarat",
    kind: "Crafts",
    hero: "🪡",
    bestSeason: "December – February (Rann Utsav)",
    hook: "Sixteen embroideries, one desert horizon.",
    distance: "~180 km loop",
    difficulty: "Easy",
    coverImage: img("photo-1605649487212-47bdab064df7"),
    accentFrom: "#a16207",
    accentTo: "#422006",
    intro:
      "The Kachchh desert holds India's densest craft ecosystem — sixteen distinct embroideries, two pottery traditions, Ajrakh block-printing, Rogan painting and Rabari leather-work, all within a 100-km radius of Bhuj. This trail visits the artisan villages keeping each craft alive.",
    stops: [
      { name: "Bhujodi Weavers", place: "Bhujodi", blurb: "Vankar community weaving wool shawls and stoles on pit-looms for 500 years.", imageUrl: img("photo-1610030469983-98e550d6193c"), story: "Bhujodi's Vankar weavers still set up their pit-looms below floor level so the warp threads stay tensioned by the weaver's own legs — a method unchanged since at least the 16th century." },
      { name: "Ajrakhpur Block-Print", place: "Ajrakhpur", blurb: "16 stages of natural-dye resist printing using madder, indigo and iron-mud.", imageUrl: img("photo-1604908554007-3a5fd5f5b2dd"), secret: { kind: "Did you know?", text: "A single Ajrakh cloth can pass through the dye-bath sixteen times, taking ten days to finish." } },
      { name: "Nirona Rogan Painting", place: "Nirona", blurb: "The last eight-family tradition of castor-oil paint trailed from a stylus onto cloth.", imageUrl: img("photo-1582719478250-c89cae4dc85b") },
      { name: "Khavda Pottery", place: "Khavda", blurb: "Wheel-thrown terracotta painted with hare-tail brushes in earth pigments.", imageUrl: img("photo-1528698827591-e19ccd7bc23d") },
      { name: "Hodka Banni Villages", place: "Hodka", blurb: "Mud-and-mirror bhungas of the Mutwa and Halepotra communities.", imageUrl: img("photo-1604908554007-3a5fd5f5b2dd") },
      { name: "Dhamadka Ajrakh Originals", place: "Dhamadka", blurb: "The ancestral village before the 2001 quake — still home to Khatri printers.", imageUrl: img("photo-1604908176997-125f25cc6f3d") },
      { name: "Sumrasar Suf Embroidery", place: "Sumrasar Sheikh", blurb: "Kala Raksha trust workshops in Suf, Khaarek and Rabari stitches.", imageUrl: img("photo-1610030469983-98e550d6193c") },
      { name: "White Rann at Full Moon", place: "Dhordo", blurb: "The salt desert under moonlight — the spiritual heart of the trail.", imageUrl: img("photo-1469474968028-56623f02e42e"), secret: { kind: "Local legend", text: "Locals say the Rann sings on full-moon nights — a faint hum from the salt crust contracting in the cool air." } },
    ],
  },
  {
    slug: "kumaoni-festival-loop",
    title: "Kumaoni Festival Loop",
    days: "6 days",
    region: "Uttarakhand",
    kind: "Festivals",
    hero: "🪔",
    bestSeason: "September – November",
    hook: "Climb into a parallel calendar of mountain gods.",
    distance: "~340 km",
    difficulty: "Challenging",
    coverImage: img("photo-1626621341517-bbf3d9990a23"),
    accentFrom: "#7c2d12",
    accentTo: "#1c1917",
    intro:
      "The Kumaon hills run on a parallel calendar of local melas, jagars and ritual dances dedicated to Golu Devta, Nanda Devi and the gods of the high pastures. This loop catches the autumn festival cycle from Almora to the Pindari glacier base.",
    stops: [
      { name: "Nanda Devi Mela", place: "Almora", blurb: "300-year-old fair around the Nanda Devi temple every September.", imageUrl: img("photo-1626621341517-bbf3d9990a23") },
      { name: "Golu Devta Temple, Chitai", place: "Chitai", blurb: "Thousands of brass bells tied by devotees seeking justice from the Kumaoni god.", imageUrl: img("photo-1561361513-2d000a50f0dc"), secret: { kind: "Did you know?", text: "Petitioners traditionally write their case on stamp paper and pin it to the temple wall — Golu Devta is the 'god of justice'." } },
      { name: "Jageshwar Dham", place: "Jageshwar", blurb: "124 stone temples in a deodar grove, 7th–14th century.", imageUrl: img("photo-1605649487212-47bdab064df7") },
      { name: "Patal Bhuvaneshwar Caves", place: "Gangolihat", blurb: "Limestone cave shrine where the four Yugas are said to be carved in stone.", imageUrl: img("photo-1596703263926-eedb1ea2c0fb") },
      { name: "Munsiyari Tribal Heritage Museum", place: "Munsiyari", blurb: "Bhotiya wool, ringals (bamboo), and the trade-route artefacts of the Johar valley.", imageUrl: img("photo-1610030469983-98e550d6193c") },
      { name: "Khaliya Top Bugyal", place: "Munsiyari", blurb: "High-altitude meadow with views of the Panchachuli peaks.", imageUrl: img("photo-1464822759023-fed622ff2c3b") },
      { name: "Pindari Glacier Base", place: "Kati", blurb: "Trek-in viewpoint of the south face of Nanda Devi.", imageUrl: img("photo-1464822759023-fed622ff2c3b") },
      { name: "Bageshwar Uttarayani Mela", place: "Bageshwar", blurb: "Kumaoni music, jagar singing and the Saraj-Gomati confluence dip.", imageUrl: img("photo-1626621341517-bbf3d9990a23") },
      { name: "Pithoragarh Folk Workshop", place: "Pithoragarh", blurb: "Learn Chholiya sword-dance and Kumaoni Ramleela basics from a local troupe.", imageUrl: img("photo-1561361513-2d000a50f0dc") },
      { name: "Kasar Devi Ridge", place: "Kasar Devi", blurb: "The Cranks' Ridge — temple, Van Allen belt anomaly, sunset over the Himalayas.", imageUrl: img("photo-1464822759023-fed622ff2c3b"), secret: { kind: "Forgotten fact", text: "NASA has flagged Kasar Devi as one of three places on Earth where the Van Allen radiation belt dips closest to the surface." } },
    ],
  },
];

export function getTrail(slug: string): Trail | undefined {
  return trails.find((t) => t.slug === slug);
}
