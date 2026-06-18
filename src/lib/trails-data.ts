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
    coverImage: "/__l5e/assets-v1/113052d1-6474-4c6a-a941-ea31ceed6073/trail-chettinad.png",
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
      { name: "Kanadukathan Mansions", place: "Kanadukathan", blurb: "Stay overnight in a restored Chettiar palace with Burmese teak pillars and Belgian mirrors.", imageUrl: img("photo-1602216056096-3b40cc0c9944"), secret: { kind: "Forgotten fact", text: "Most mansions face east — the doorway sized so the morning sun touches the family altar exactly at the equinox." } },
      { name: "Chettinad Cooking Class", place: "Kanadukathan", blurb: "Learn the Kuzhi paniyaram, Kara kuzhambu and pepper chicken from a Chettiar grandmother.", imageUrl: img("photo-1604908176997-125f25cc6f3d") },
      { name: "Pillaiyarpatti Temple", place: "Pillaiyarpatti", blurb: "A rock-cut Ganesha cave shrine dated to the 4th century — the Chettiars' kuladeivam.", imageUrl: img("photo-1561361513-2d000a50f0dc") },
      { name: "Devakottai Antique Markets", place: "Devakottai", blurb: "Bronze urulis, brass meen kuzhambu pots and old colonial enamelware from estate sales.", imageUrl: img("photo-1528698827591-e19ccd7bc23d") },
      { name: "Sunday Sandhai (Weekly Market)", place: "Karaikudi", blurb: "A full sensory mela of dried fish, hand-pounded masalas, palm jaggery and country chickens.", imageUrl: img("photo-1488459716781-31db52582fe9") },
      { name: "Kothamangalam Saree Weavers", place: "Kothamangalam", blurb: "Kandanghi cotton saris in checked maroon and mustard — the everyday drape of Chettinad women.", imageUrl: img("photo-1610030469983-98e550d6193c") },
      { name: "Aayiram Jannal Mansion", place: "Kothamangalam", blurb: "The 'thousand-window' mansion — one of the largest surviving Nagarathar homes.", imageUrl: img("photo-1567157577867-05ccb1388e66"), secret: { kind: "Local legend", text: "The household priest once counted 1,072 windows before giving up — locals just say 'aayiram', a thousand." } },
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
    coverImage: "/__l5e/assets-v1/8e8d6f49-aa23-453b-bc4b-9faadf0bd1db/trail-brihadeeswarar.png",
    accentFrom: "#b45309",
    accentTo: "#451a03",
    intro:
      "Two empires, two capitals, one trail. From the Chola colossus at Thanjavur (1010 CE) through the Hoysala jewel-box shrines of Belur and Halebidu, ending in the boulder-strewn ruins of Vijayanagara — the largest medieval city the world had ever seen.",
    stops: [
      { name: "Brihadeeswarar Temple", place: "Thanjavur, TN", blurb: "Rajaraja Chola's 216-foot vimana built from a single 80-tonne granite cap.", imageUrl: img("photo-1582510003544-4d00b7f74220"), story: "Completed in 1010 CE, Brihadeeswarar's vimana rises taller than any temple tower built in India before it. The capstone alone weighs 80 tonnes — engineers still argue over the inclined ramp the Cholas must have used to raise it.", secret: { kind: "Did you know?", text: "The temple's shadow famously never falls on the ground at noon — an illusion created by the vimana's precise inward taper." } },
      { name: "Airavatesvara Temple", place: "Darasuram, TN", blurb: "A miniature masterpiece — singing steps and chariot-wheel mandapas.", imageUrl: img("photo-1605649487212-47bdab064df7") },
      { name: "Gangaikonda Cholapuram", place: "Jayankondam, TN", blurb: "Rajendra Chola's victory temple commemorating his march to the Ganga.", imageUrl: img("photo-1623059508779-2542c6e83753") },
      { name: "Chennakeshava Temple", place: "Belur, KA", blurb: "Hoysala soapstone carving so fine you can pass a thread through the bracelets.", imageUrl: img("photo-1517457373958-b7bdd4587205"), secret: { kind: "Forgotten fact", text: "Hoysala sculptors signed their work — over 40 artist names are still legible on the Belur friezes." } },
      { name: "Hoysaleswara Temple", place: "Halebidu, KA", blurb: "Twin shrines on a star-plinth, every surface a frieze of elephants, gods and dancers.", imageUrl: img("photo-1473625247510-8ceb1760943f") },
      { name: "Chitradurga Fort", place: "Chitradurga, KA", blurb: "Seven concentric walls climbing a granite massif — the Madakari Nayakas' last stand.", imageUrl: img("photo-1558431382-27e303142255") },
      { name: "Virupaksha Temple", place: "Hampi, KA", blurb: "The only Vijayanagara temple still in active worship, 7th century onward.", imageUrl: img("photo-1626621341517-bbf3d9990a23") },
      { name: "Vittala Temple", place: "Hampi, KA", blurb: "Stone chariot and musical pillars — the high noon of Vijayanagara art.", imageUrl: img("photo-1580674684081-7617fbf3d745"), secret: { kind: "Local legend", text: "Tap the right pillar in the Ranga Mandapa and it rings a perfect Sa; the British supposedly cut one open to check whether it was hollow." } },
      { name: "Royal Enclosure", place: "Hampi, KA", blurb: "Mahanavami platform, queens' bath, lotus mahal and the elephant stables.", imageUrl: img("photo-1517816743773-6e0fd518b4a6") },
      { name: "Anegundi Village", place: "Anegundi, KA", blurb: "Older than Hampi itself — the mythic Kishkindha of the Ramayana.", imageUrl: img("photo-1542367592-8849eb950fd8") },
      { name: "Hemakuta Hill at Sunset", place: "Hampi, KA", blurb: "Pre-Vijayanagara shrines on the hill where Shiva is said to have married Pampa.", imageUrl: img("photo-1477586957327-847a0f3f4fe3") },
      { name: "Coracle Ride on Tungabhadra", place: "Hampi, KA", blurb: "Round bamboo boats below the Vittala bridge ruins — exactly as in 1565.", imageUrl: img("photo-1469474968028-56623f02e42e") },
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
    coverImage: "/__l5e/assets-v1/cdaad5db-4b06-4838-963c-0bd955266160/trail-bhuj.png",
    accentFrom: "#a16207",
    accentTo: "#422006",
    intro:
      "The Kachchh desert holds India's densest craft ecosystem — sixteen distinct embroideries, two pottery traditions, Ajrakh block-printing, Rogan painting and Rabari leather-work, all within a 100-km radius of Bhuj. This trail visits the artisan villages keeping each craft alive.",
    stops: [
      { name: "Bhujodi Weavers", place: "Bhujodi", blurb: "Vankar community weaving wool shawls and stoles on pit-looms for 500 years.", imageUrl: img("photo-1532375810709-75b1da00537c"), story: "Bhujodi's Vankar weavers still set up their pit-looms below floor level so the warp threads stay tensioned by the weaver's own legs — a method unchanged since at least the 16th century." },
      { name: "Ajrakhpur Block-Print", place: "Ajrakhpur", blurb: "16 stages of natural-dye resist printing using madder, indigo and iron-mud.", imageUrl: img("photo-1517400508447-f8dd518b86db"), secret: { kind: "Did you know?", text: "A single Ajrakh cloth can pass through the dye-bath sixteen times, taking ten days to finish." } },
      { name: "Nirona Rogan Painting", place: "Nirona", blurb: "The last eight-family tradition of castor-oil paint trailed from a stylus onto cloth.", imageUrl: img("photo-1564507592333-c60657eea523") },
      { name: "Khavda Pottery", place: "Khavda", blurb: "Wheel-thrown terracotta painted with hare-tail brushes in earth pigments.", imageUrl: img("photo-1505881502353-a1986add3762") },
      { name: "Hodka Banni Villages", place: "Hodka", blurb: "Mud-and-mirror bhungas of the Mutwa and Halepotra communities.", imageUrl: img("photo-1587135941948-670b381f08ce") },
      { name: "Dhamadka Ajrakh Originals", place: "Dhamadka", blurb: "The ancestral village before the 2001 quake — still home to Khatri printers.", imageUrl: img("photo-1524613032530-449a5d94c285") },
      { name: "Sumrasar Suf Embroidery", place: "Sumrasar Sheikh", blurb: "Kala Raksha trust workshops in Suf, Khaarek and Rabari stitches.", imageUrl: img("photo-1514222134-b57cbb8ce073") },
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
    coverImage: "/__l5e/assets-v1/99df1815-60eb-4f43-adf4-46ba121a79c8/trail-kumaoni.png",
    accentFrom: "#7c2d12",
    accentTo: "#1c1917",
    intro:
      "The Kumaon hills run on a parallel calendar of local melas, jagars and ritual dances dedicated to Golu Devta, Nanda Devi and the gods of the high pastures. This loop catches the autumn festival cycle from Almora to the Pindari glacier base.",
    stops: [
      { name: "Nanda Devi Mela", place: "Almora", blurb: "300-year-old fair around the Nanda Devi temple every September.", imageUrl: img("photo-1548013146-72479768bada") },
      { name: "Golu Devta Temple, Chitai", place: "Chitai", blurb: "Thousands of brass bells tied by devotees seeking justice from the Kumaoni god.", imageUrl: img("photo-1518002171953-a080ee817e1f"), secret: { kind: "Did you know?", text: "Petitioners traditionally write their case on stamp paper and pin it to the temple wall — Golu Devta is the 'god of justice'." } },
      { name: "Jageshwar Dham", place: "Jageshwar", blurb: "124 stone temples in a deodar grove, 7th–14th century.", imageUrl: img("photo-1477959858617-67f85cf4f1df") },
      { name: "Patal Bhuvaneshwar Caves", place: "Gangolihat", blurb: "Limestone cave shrine where the four Yugas are said to be carved in stone.", imageUrl: img("photo-1477587458883-47145ed94245") },
      { name: "Munsiyari Tribal Heritage Museum", place: "Munsiyari", blurb: "Bhotiya wool, ringals (bamboo), and the trade-route artefacts of the Johar valley.", imageUrl: img("photo-1623059508779-2542c6e83753") },
      { name: "Khaliya Top Bugyal", place: "Munsiyari", blurb: "High-altitude meadow with views of the Panchachuli peaks.", imageUrl: img("photo-1464822759023-fed622ff2c3b") },
      { name: "Pindari Glacier Base", place: "Kati", blurb: "Trek-in viewpoint of the south face of Nanda Devi.", imageUrl: img("photo-1473625247510-8ceb1760943f") },
      { name: "Bageshwar Uttarayani Mela", place: "Bageshwar", blurb: "Kumaoni music, jagar singing and the Saraj-Gomati confluence dip.", imageUrl: img("photo-1626621341517-bbf3d9990a23") },
      { name: "Pithoragarh Folk Workshop", place: "Pithoragarh", blurb: "Learn Chholiya sword-dance and Kumaoni Ramleela basics from a local troupe.", imageUrl: img("photo-1561361513-2d000a50f0dc") },
      { name: "Kasar Devi Ridge", place: "Kasar Devi", blurb: "The Cranks' Ridge — temple, Van Allen belt anomaly, sunset over the Himalayas.", imageUrl: img("photo-1477586957327-847a0f3f4fe3"), secret: { kind: "Forgotten fact", text: "NASA has flagged Kasar Devi as one of three places on Earth where the Van Allen radiation belt dips closest to the surface." } },
    ],
  },
  {
    slug: "living-roots-cloud-kingdoms",
    title: "The Living Roots & Cloud Kingdoms Trail",
    days: "12 days",
    region: "Northeast India",
    kind: "Ecology & Indigenous Wisdom",
    hero: "🌿",
    bestSeason: "October – April",
    hook: "Where roots are bridges and forests are temples.",
    distance: "~1,400 km circuit",
    difficulty: "Challenging",
    coverImage: "/__l5e/assets-v1/b5e899d2-3fc8-4970-b179-9ea4d390b7a0/trail-living-roots.jpg",
    accentFrom: "#166534",
    accentTo: "#052e16",
    intro:
      "Travel through mist-covered hills, sacred groves, and ancient communities where nature and culture exist as one. Discover stories carried by roots, rivers, music, and memory.",
    stops: [
      { name: "Double-Decker Living Root Bridge", place: "Nongriat, Meghalaya", blurb: "A two-tier bridge grown over 150 years from the aerial roots of the rubber fig.", story: "The Khasi War-Jaintia clans don't build bridges — they grow them. Hollowed-out areca trunks guide the aerial roots of Ficus elastica across rivers; each bridge takes two human generations to mature and can carry 50 villagers at once.", secret: { kind: "Did you know?", text: "The double-decker bridge at Nongriat was begun by a single family and is still 'tended' by their descendants today." } },
      { name: "Mawphlang Sacred Grove", place: "Mawphlang, Meghalaya", blurb: "Law Kyntang — a forest where Khasi law forbids the removal of so much as a fallen leaf.", story: "For 800 years the Lyngdoh clan has protected this grove for the deity Labasa. Even British colonial roads bent around it." },
      { name: "Nongriat Village", place: "Nongriat, Meghalaya", blurb: "Three thousand steps below the rim of the East Khasi plateau — community life and oral traditions of the Khasi War.", secret: { kind: "Local legend", text: "Elders sing rain into existence here — phawars composed for thunder, mist and the swelling Umshiang river." } },
      { name: "Majuli Island", place: "Majuli, Assam", blurb: "The world's largest river island and the cradle of Assam's Vaishnavite Satras.", story: "Sankardev founded Majuli's first satra in the 16th century. Today 22 monasteries still teach Bhaona drama, mask-making and Borgeet devotional song." },
      { name: "Kamakhya Temple", place: "Guwahati, Assam", blurb: "The most powerful of the 51 Shakti Peethas — a goddess shrine without an idol.", secret: { kind: "Forgotten fact", text: "During Ambubachi Mela the Brahmaputra runs red — a natural mineral bloom Tantric pilgrims read as the goddess's menstruation." } },
      { name: "Ziro Valley", place: "Ziro, Arunachal Pradesh", blurb: "Apatani wet-rice + fish farming, terraced for 600 years without chemical input.", story: "The Apatani grow rice and fish in the same flooded paddy — a closed-loop system the UN has studied as a model of sustainable agriculture." },
      { name: "Tawang Monastery", place: "Tawang, Arunachal Pradesh", blurb: "India's largest gompa — 400 years of Gelugpa Buddhism at 10,000 ft.", secret: { kind: "Did you know?", text: "The 6th Dalai Lama Tsangyang Gyatso, the only poet-Dalai-Lama, was born in a Monpa village a day's walk from Tawang." } },
      { name: "Dzukou Valley", place: "Nagaland–Manipur border", blurb: "A high alpine bowl that blooms with the endemic Dzukou lily every July.", story: "Shared by the Angami and Mao Naga, the valley is a rare 'no-village' landscape — sacred to both peoples and farmed by neither." },
      { name: "Kisama Heritage Village", place: "Kisama, Nagaland", blurb: "Authentic morungs of all 17 Naga tribes — host site of the Hornbill Festival.", imageUrl: undefined },
      { name: "Loktak Lake", place: "Moirang, Manipur", blurb: "Floating phumdis the size of cricket fields — home of the endangered Sangai deer.", secret: { kind: "Local legend", text: "Fishermen build huts on the phumdis and move house every monsoon as the islands drift." } },
      { name: "Unakoti", place: "Unakoti, Tripura", blurb: "'One less than a crore' — colossal rock-cut Shiva faces hidden in the jungle.", story: "Legend says Shiva and a crore of gods rested here on the way to Kashi; when only Shiva woke at dawn, he cursed the rest to remain as stone." },
      { name: "Reiek Village", place: "Reiek, Mizoram", blurb: "A Mizo cultural village on a 5,000-ft ridge with Khuangchawi dance and bamboo crafts.", imageUrl: undefined },
    ],
  },
  {
    slug: "five-rivers-heritage",
    title: "The Five Rivers Heritage Trail",
    days: "9 days",
    region: "Punjab",
    kind: "Faith & Resilience",
    hero: "🕌",
    bestSeason: "October – March",
    hook: "Follow the rivers that shaped Punjab's soul.",
    distance: "~520 km loop",
    difficulty: "Easy",
    coverImage: "/__l5e/assets-v1/ae0e408f-e377-4667-970b-06b316b2c753/trail-five-rivers.jpg",
    accentFrom: "#b45309",
    accentTo: "#451a03",
    intro:
      "Follow the rivers that shaped Punjab's identity through sacred shrines, historic cities, artistic traditions, and stories of courage.",
    stops: [
      { name: "Golden Temple", place: "Amritsar", blurb: "Harmandir Sahib — seva, equality and the largest free kitchen on earth.", story: "Guru Arjan laid the foundation in 1581; the temple's four doors face all directions to declare that the divine is open to every caste, creed and gender. The langar feeds 100,000 people a day, every day.", secret: { kind: "Did you know?", text: "The 750 kg of gold leaf on the upper storeys was added by Maharaja Ranjit Singh in 1830 — the marble below is from the same Rajasthan quarry as the Taj Mahal." } },
      { name: "Jallianwala Bagh", place: "Amritsar", blurb: "The walled garden where, on Baisakhi 1919, General Dyer's troops opened fire on an unarmed crowd.", story: "The bullet marks are still in the wall. The narrow lane Dyer blocked is still the only way out." },
      { name: "Partition Museum", place: "Amritsar Town Hall", blurb: "The world's first museum dedicated to the 1947 Partition — oral histories of the largest migration in human history.", secret: { kind: "Forgotten fact", text: "Curators have logged over 5,000 personal testimonies — most are from survivors now in their 90s, racing the clock." } },
      { name: "Gobindgarh Fort", place: "Amritsar", blurb: "Ranjit Singh's brick-and-laterite citadel — once held the Kohinoor diamond.", imageUrl: undefined },
      { name: "Ram Tirath Temple", place: "near Amritsar", blurb: "The ashram where Sita is said to have given birth to Lav and Kush.", story: "Valmiki is said to have composed parts of the Ramayana on this very tank's edge; the annual Ram Tirath mela still draws lakhs." },
      { name: "Pul Kanjari", place: "near Wagah", blurb: "A bathing complex Maharaja Ranjit Singh built for a Kashmiri dancer he loved.", secret: { kind: "Local legend", text: "The Maharaja is said to have ordered an entire bridge rebuilt when she dropped an anklet crossing it." } },
      { name: "Virasat-e-Khalsa", place: "Anandpur Sahib", blurb: "Moshe Safdie's stainless-steel petals housing 500 years of Sikh history.", story: "Opened in 2011 on the 300th anniversary of the Khalsa, the museum's roof is shaped like five hands clasped in ardas." },
      { name: "Ropar Wetlands", place: "Ropar", blurb: "A Ramsar site on the Sutlej — wintering ground for bar-headed geese flying over the Himalayas.", imageUrl: undefined },
      { name: "Qila Mubarak", place: "Patiala", blurb: "The Phulkian dynasty's frescoed palace-fort with the world's largest collection of medieval armour.", secret: { kind: "Did you know?", text: "The fort's Sheesh Mahal mirror-work used Belgian glass shipped overland through Persia in the 1840s." } },
      { name: "Phulkari Craft Cluster", place: "Patiala / Nabha", blurb: "Darshan dwar and bagh embroidery — silk floss on khaddar, every stitch a flower.", story: "A bride's phulkari is begun the day she is born; the most intricate baghs take seven years to complete." },
      { name: "Rural Haveli Stay", place: "Hoshiarpur countryside", blurb: "Wake to sarson fields, churn lassi at dawn, eat makki di roti off a brass thali.", imageUrl: undefined },
      { name: "Wagah Border Ceremony", place: "Attari–Wagah", blurb: "The daily Beating Retreat — a half-rehearsed ballet of patriotism shared with Pakistan.", secret: { kind: "Forgotten fact", text: "BSF and Pakistan Rangers coordinate the kicks and salutes by phone every morning before sunset's show." } },
    ],
  },
  {
    slug: "heart-of-india-civilisations",
    title: "The Heart of India Civilisations Trail",
    days: "10 days",
    region: "Central India",
    kind: "Civilisations & Tribal Memory",
    hero: "🗿",
    bestSeason: "October – March",
    hook: "From prehistoric paint to Bundela palaces.",
    distance: "~1,100 km",
    difficulty: "Moderate",
    coverImage: "/__l5e/assets-v1/c9d325ef-fd79-4815-8394-14a51e5129e8/trail-heart-india.jpg",
    accentFrom: "#a16207",
    accentTo: "#1c1917",
    intro:
      "Journey through the heart of India where prehistoric artists, temple builders, warriors, and storytellers shaped enduring civilizations.",
    stops: [
      { name: "Bhimbetka Rock Shelters", place: "Raisen, Madhya Pradesh", blurb: "750 painted rock shelters — the earliest known human art on the subcontinent.", story: "The oldest pigments at Bhimbetka are 30,000 years old. Some shelters were inhabited continuously from the Acheulean stone tools of the Lower Paleolithic into the medieval era — an unbroken 100,000-year human story.", secret: { kind: "Did you know?", text: "One panel shows a man riding a horse with a stirrup — older than any other depiction of a stirrup anywhere in the world." } },
      { name: "Sanchi Stupa", place: "Raisen, Madhya Pradesh", blurb: "Ashoka's 3rd-century-BCE hemisphere — Buddhist art's first masterpiece.", story: "Sanchi has no Buddha image — only symbols (the wheel, footprint, empty throne). The figural Buddha hadn't been invented yet." },
      { name: "Udayagiri Caves", place: "Vidisha, Madhya Pradesh", blurb: "Gupta-era rock-cut Vishnu Varaha lifting the earth out of the cosmic ocean.", secret: { kind: "Forgotten fact", text: "Cave 5 contains the earliest dated Hindu sculpture in India — Chandragupta II's reign, c. 401 CE." } },
      { name: "Bhojpur Temple", place: "Bhojpur, MP", blurb: "Raja Bhoja's 11th-century Shiva — an unfinished colossus with a 7.5 m linga.", story: "The construction earthen ramp is still in place beside the temple — the only such ramp surviving from medieval India." },
      { name: "Gwalior Fort", place: "Gwalior, MP", blurb: "'The pearl among Indian fortresses' — Tomar palaces and a 6th-century zero inscription.", secret: { kind: "Did you know?", text: "The Chaturbhuj temple inside the fort has the world's second-oldest written zero, dated 876 CE." } },
      { name: "Orchha", place: "Orchha, MP", blurb: "Bundela chhatris on the Betwa — the only temple in India where Rama is worshipped as a king.", story: "The Ram Raja temple was meant to be a palace; the idol Madhukar Shah carried from Ayodhya refused to be moved again, so the palace became the shrine." },
      { name: "Khajuraho Group", place: "Khajuraho, MP", blurb: "Chandela 10th–11th-century temples — sacred art, symbolism and yes, the famous mithunas.", secret: { kind: "Local legend", text: "Only about 10% of Khajuraho's carvings are erotic — the rest are Tantric philosophy, daily life and divine genealogies, but the 10% gets all the postcards." } },
      { name: "Bhedaghat Marble Rocks", place: "Jabalpur, MP", blurb: "100-ft white marble cliffs the Narmada slices through — best seen by moonlight.", imageUrl: undefined },
      { name: "Pachmarhi", place: "Pachmarhi, MP", blurb: "Satpura's only hill station — Gond rock paintings, colonial bungalows and Pandava caves.", story: "Captain James Forsyth 'discovered' Pachmarhi in 1857; the Gond and Korku had known its caves for 10,000 years." },
      { name: "Bastar Tribal Experience", place: "Jagdalpur, Chhattisgarh", blurb: "Dhokra lost-wax bronze, bell-metal anklets and the week-long Bastar Dussehra.", secret: { kind: "Forgotten fact", text: "Bastar Dussehra has nothing to do with Rama — it's a 75-day festival for the local goddess Danteshwari." } },
      { name: "Sirpur Archaeological Site", place: "Mahasamund, Chhattisgarh", blurb: "Lakshmana brick temple — Sirpur was a 7th-century Buddhist–Hindu–Jain trading capital visited by Xuanzang.", imageUrl: undefined },
      { name: "Ramgarh Hill & Sita Bengra", place: "Surguja, Chhattisgarh", blurb: "The world's oldest known theatre — a 3rd-century-BCE cave with an inscribed love poem.", story: "The Sita Bengra cave's inscription, in early Brahmi, includes a Sanskrit love verse — the oldest surviving Indian play-text." },
    ],
  },
];

export function getTrail(slug: string): Trail | undefined {
  return trails.find((t) => t.slug === slug);
}
