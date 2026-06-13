export type TrailStop = {
  name: string;
  place: string;
  blurb: string;
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
  stops: TrailStop[];
};

export const trails: Trail[] = [
  {
    slug: "chettinad-spice-trail",
    title: "Chettinad Spice Trail",
    days: "5 days",
    region: "Tamil Nadu",
    kind: "Food",
    hero: "🌶️",
    bestSeason: "November – February",
    intro:
      "Chettinad's mansions were built by 19th-century merchants who traded with Burma, Java and Ceylon — and brought spices, lacquer and Athangudi tiles home. This trail follows the kitchens, markets and family kovils that still cook the way the Nattukottai Chettiars did a hundred years ago.",
    stops: [
      { name: "Karaikudi Old Town", place: "Karaikudi", blurb: "Walk the spice arcades of Muneeswaran Kovil Street where star anise, marathi mokku and kalpasi are still measured in tola." },
      { name: "Athangudi Tile Workshops", place: "Athangudi", blurb: "See cement tiles hand-poured on glass plates — the same patterns laid into every Chettinad mansion floor." },
      { name: "Kanadukathan Mansions", place: "Kanadukathan", blurb: "Stay overnight in a restored Chettiar palace with Burmese teak pillars and Belgian mirrors." },
      { name: "Chettinad Cooking Class", place: "Kanadukathan", blurb: "Learn the Kuzhi paniyaram, Kara kuzhambu and pepper chicken from a Chettiar grandmother." },
      { name: "Pillaiyarpatti Temple", place: "Pillaiyarpatti", blurb: "A rock-cut Ganesha cave shrine dated to the 4th century — the Chettiars' kuladeivam." },
      { name: "Devakottai Antique Markets", place: "Devakottai", blurb: "Bronze urulis, brass meen kuzhambu pots and old colonial enamelware from estate sales." },
      { name: "Sunday Sandhai (Weekly Market)", place: "Karaikudi", blurb: "A full sensory mela of dried fish, hand-pounded masalas, palm jaggery and country chickens." },
      { name: "Kothamangalam Saree Weavers", place: "Kothamangalam", blurb: "Kandanghi cotton saris in checked maroon and mustard — the everyday drape of Chettinad women." },
      { name: "Aayiram Jannal Mansion", place: "Kothamangalam", blurb: "The 'thousand-window' mansion — one of the largest surviving Nagarathar homes." },
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
    intro:
      "Two empires, two capitals, one trail. From the Chola colossus at Thanjavur (1010 CE) through the Hoysala jewel-box shrines of Belur and Halebidu, ending in the boulder-strewn ruins of Vijayanagara — the largest medieval city the world had ever seen.",
    stops: [
      { name: "Brihadeeswarar Temple", place: "Thanjavur, TN", blurb: "Rajaraja Chola's 216-foot vimana built from a single 80-tonne granite cap." },
      { name: "Airavatesvara Temple", place: "Darasuram, TN", blurb: "A miniature masterpiece — singing steps and chariot-wheel mandapas." },
      { name: "Gangaikonda Cholapuram", place: "Jayankondam, TN", blurb: "Rajendra Chola's victory temple commemorating his march to the Ganga." },
      { name: "Chennakeshava Temple", place: "Belur, KA", blurb: "Hoysala soapstone carving so fine you can pass a thread through the bracelets." },
      { name: "Hoysaleswara Temple", place: "Halebidu, KA", blurb: "Twin shrines on a star-plinth, every surface a frieze of elephants, gods and dancers." },
      { name: "Chitradurga Fort", place: "Chitradurga, KA", blurb: "Seven concentric walls climbing a granite massif — the Madakari Nayakas' last stand." },
      { name: "Virupaksha Temple", place: "Hampi, KA", blurb: "The only Vijayanagara temple still in active worship, 7th century onward." },
      { name: "Vittala Temple", place: "Hampi, KA", blurb: "Stone chariot and musical pillars — the high noon of Vijayanagara art." },
      { name: "Royal Enclosure", place: "Hampi, KA", blurb: "Mahanavami platform, queens' bath, lotus mahal and the elephant stables." },
      { name: "Anegundi Village", place: "Anegundi, KA", blurb: "Older than Hampi itself — the mythic Kishkindha of the Ramayana." },
      { name: "Hemakuta Hill at Sunset", place: "Hampi, KA", blurb: "Pre-Vijayanagara shrines on the hill where Shiva is said to have married Pampa." },
      { name: "Coracle Ride on Tungabhadra", place: "Hampi, KA", blurb: "Round bamboo boats below the Vittala bridge ruins — exactly as in 1565." },
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
    intro:
      "The Kachchh desert holds India's densest craft ecosystem — sixteen distinct embroideries, two pottery traditions, Ajrakh block-printing, Rogan painting and Rabari leather-work, all within a 100-km radius of Bhuj. This trail visits the artisan villages keeping each craft alive.",
    stops: [
      { name: "Bhujodi Weavers", place: "Bhujodi", blurb: "Vankar community weaving wool shawls and stoles on pit-looms for 500 years." },
      { name: "Ajrakhpur Block-Print", place: "Ajrakhpur", blurb: "16 stages of natural-dye resist printing using madder, indigo and iron-mud." },
      { name: "Nirona Rogan Painting", place: "Nirona", blurb: "The last eight-family tradition of castor-oil paint trailed from a stylus onto cloth." },
      { name: "Khavda Pottery", place: "Khavda", blurb: "Wheel-thrown terracotta painted with hare-tail brushes in earth pigments." },
      { name: "Hodka Banni Villages", place: "Hodka", blurb: "Mud-and-mirror bhungas of the Mutwa and Halepotra communities." },
      { name: "Dhamadka Ajrakh Originals", place: "Dhamadka", blurb: "The ancestral village before the 2001 quake — still home to Khatri printers." },
      { name: "Sumrasar Suf Embroidery", place: "Sumrasar Sheikh", blurb: "Kala Raksha trust workshops in Suf, Khaarek and Rabari stitches." },
      { name: "White Rann at Full Moon", place: "Dhordo", blurb: "The salt desert under moonlight — the spiritual heart of the trail." },
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
    intro:
      "The Kumaon hills run on a parallel calendar of local melas, jagars and ritual dances dedicated to Golu Devta, Nanda Devi and the gods of the high pastures. This loop catches the autumn festival cycle from Almora to the Pindari glacier base.",
    stops: [
      { name: "Nanda Devi Mela", place: "Almora", blurb: "300-year-old fair around the Nanda Devi temple every September." },
      { name: "Golu Devta Temple, Chitai", place: "Chitai", blurb: "Thousands of brass bells tied by devotees seeking justice from the Kumaoni god." },
      { name: "Jageshwar Dham", place: "Jageshwar", blurb: "124 stone temples in a deodar grove, 7th–14th century." },
      { name: "Patal Bhuvaneshwar Caves", place: "Gangolihat", blurb: "Limestone cave shrine where the four Yugas are said to be carved in stone." },
      { name: "Munsiyari Tribal Heritage Museum", place: "Munsiyari", blurb: "Bhotiya wool, ringals (bamboo), and the trade-route artefacts of the Johar valley." },
      { name: "Khaliya Top Bugyal", place: "Munsiyari", blurb: "High-altitude meadow with views of the Panchachuli peaks." },
      { name: "Pindari Glacier Base", place: "Kati", blurb: "Trek-in viewpoint of the south face of Nanda Devi." },
      { name: "Bageshwar Uttarayani Mela", place: "Bageshwar", blurb: "Kumaoni music, jagar singing and the Saraj-Gomati confluence dip." },
      { name: "Pithoragarh Folk Workshop", place: "Pithoragarh", blurb: "Learn Chholiya sword-dance and Kumaoni Ramleela basics from a local troupe." },
      { name: "Kasar Devi Ridge", place: "Kasar Devi", blurb: "The Cranks' Ridge — temple, Van Allen belt anomaly, sunset over the Himalayas." },
    ],
  },
];

export function getTrail(slug: string): Trail | undefined {
  return trails.find((t) => t.slug === slug);
}
