import goldenTempleImg from "@/assets/golden-temple.png.asset.json";
import greatHimalayanImg from "@/assets/great-himalayan.png.asset.json";
import nandaDeviImg from "@/assets/nanda-devi.png.asset.json";
import rakhigarhiImg from "@/assets/rakhigarhi.png.asset.json";
import redFortImg from "@/assets/red-fort.png.asset.json";
import tajMahalImg from "@/assets/taj-mahal.png.asset.json";
import keoladeoImg from "@/assets/keoladeo.png.asset.json";
import pushkarImg from "@/assets/pushkar.png.asset.json";
import jaisalmerImg from "@/assets/jaisalmer.png.asset.json";
import kumbhImg from "@/assets/kumbh.png.asset.json";
import varanasiImg from "@/assets/varanasi.png.asset.json";
import madhubaniImg from "@/assets/madhubani.png.asset.json";
import manasImg from "@/assets/manas.png.asset.json";
import kazirangaImg from "@/assets/kaziranga.png.asset.json";
import majuliImg from "@/assets/majuli.png.asset.json";
import khajurahoImg from "@/assets/khajuraho.png.asset.json";
import sanchiImg from "@/assets/sanchi.png.asset.json";
import lothalImg from "@/assets/lothal.png.asset.json";
import dholaviraImg from "@/assets/dholavira.png.asset.json";
import ajantaElloraImg from "@/assets/ajanta-ellora.png.asset.json";
import victoriaMemorialImg from "@/assets/victoria-memorial.png.asset.json";
import sundarbansImg from "@/assets/sundarbans.png.asset.json";
import raghurajpurImg from "@/assets/raghurajpur.png.asset.json";
import konarkImg from "@/assets/konark.png.asset.json";
import charminarImg from "@/assets/charminar.png.asset.json";
import hampiImg from "@/assets/hampi.png.asset.json";
import pattadakalImg from "@/assets/pattadakal.png.asset.json";
import theyyamImg from "@/assets/theyyam.png.asset.json";
import westernGhatsImg from "@/assets/western-ghats.png.asset.json";
import channapatnaImg from "@/assets/channapatna.png.asset.json";

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
  /** Approximate founding / origin year. Negative = BCE. Used for the timeline scrubber. */
  year: number;
  shortDescription: string;
  fullDescription: string[];
  quickFacts: QuickFact[];
  imageUrl: string;
};

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heritageSites: HeritageSite[] = [
  // ────────── ARCHAEOLOGY ──────────
  {
    id: "hampi", name: "Hampi", category: "Archaeology",
    lat: 15.335, lon: 76.460, region: "Vijayanagara, Karnataka", year: 1336,
    shortDescription: "Boulder-strewn ruins of Vijayanagara, once one of the richest cities in the world.",
    fullDescription: [
      "Spread across a 36-square-kilometre landscape of granite outcrops along the Tungabhadra, Hampi is the surviving footprint of Vijayanagara — capital of the eponymous empire that ruled much of southern India between the 14th and 16th centuries.",
      "More than 1,600 surviving monuments include the Virupaksha Temple, the musical pillars of Vittala, the iconic stone chariot, royal enclosures and aqueducts.",
      "The city was sacked in 1565 after the Battle of Talikota and never reoccupied — UNESCO inscribed it in 1986.",
    ],
    quickFacts: [
      { label: "Flourished", value: "14th–16th century" },
      { label: "Empire", value: "Vijayanagara" },
      { label: "UNESCO", value: "World Heritage Site (1986)" },
    ],
    imageUrl: hampiImg.url,
  },
  {
    id: "ajanta-ellora", name: "Ajanta & Ellora Caves", category: "Archaeology",
    lat: 20.5519, lon: 75.7033, region: "Aurangabad, Maharashtra", year: -200,
    shortDescription: "Rock-cut cave complexes spanning a thousand years of Indian religious art.",
    fullDescription: [
      "The 30 caves of Ajanta were excavated between the 2nd century BCE and the 5th century CE as Buddhist viharas and chaityas. Their walls hold the finest surviving cycle of ancient Indian painting.",
      "Ellora's 34 caves, carved between the 6th and 10th centuries, bring together Buddhist, Hindu and Jain shrines along a single basalt escarpment. The Kailasa Temple is the largest monolithic excavation on Earth.",
    ],
    quickFacts: [
      { label: "Ajanta carved", value: "2nd c. BCE – 5th c. CE" },
      { label: "Ellora carved", value: "6th – 10th c. CE" },
      { label: "UNESCO", value: "World Heritage Sites (1983)" },
    ],
    imageUrl: ajantaElloraImg.url,
  },
  {
    id: "lothal", name: "Lothal", category: "Archaeology",
    lat: 22.5217, lon: 72.2495, region: "Saragwala, Gujarat", year: -2400,
    shortDescription: "One of the southernmost cities of the Indus Valley Civilisation — and the world's earliest known dockyard.",
    fullDescription: [
      "Lothal flourished between 2400 and 1900 BCE as a Harappan trading port on the Gulf of Khambhat. Its baked-brick basin, fed by a channel from the Sabarmati, is widely accepted as the earliest engineered dockyard yet found.",
      "Excavations uncovered standardised weights, Persian Gulf seals, bead-making workshops and a planned grid of streets and drains — evidence of a sophisticated mercantile society three millennia before the Mughals.",
    ],
    quickFacts: [
      { label: "Period", value: "c. 2400–1900 BCE" },
      { label: "Civilisation", value: "Indus Valley (Harappan)" },
      { label: "Famous for", value: "World's earliest known dockyard" },
    ],
    imageUrl: lothalImg.url,
  },
  {
    id: "dholavira", name: "Dholavira", category: "Archaeology",
    lat: 23.8916, lon: 70.2090, region: "Kachchh, Gujarat", year: -2600,
    shortDescription: "A Harappan city of reservoirs, gates and a still-undeciphered ten-character signboard.",
    fullDescription: [
      "Built on an island in the Great Rann of Kachchh, Dholavira is one of the five largest Harappan sites. Its three-tier city plan — castle, middle and lower town — was supplied by 16 carefully engineered stone reservoirs that captured monsoon runoff in a near-rainless landscape.",
      "Above its northern gateway archaeologists found ten Harappan glyphs cut into gypsum — the so-called 'Dholavira Signboard', still undeciphered. UNESCO inscribed the city in 2021.",
    ],
    quickFacts: [
      { label: "Occupied", value: "c. 2650–1450 BCE" },
      { label: "Civilisation", value: "Indus Valley (Harappan)" },
      { label: "UNESCO", value: "World Heritage Site (2021)" },
    ],
    imageUrl: dholaviraImg.url,
  },
  {
    id: "konark", name: "Konark Sun Temple", category: "Archaeology",
    lat: 19.8876, lon: 86.0945, region: "Konark, Odisha", year: 1250,
    shortDescription: "A 13th-century chariot of the Sun God hewn from sandstone — wheels, horses and all.",
    fullDescription: [
      "Built around 1250 by King Narasimhadeva I of the Eastern Ganga dynasty, the Konark Sun Temple is conceived as a colossal stone chariot of Surya — 24 carved wheels, seven straining horses and a now-collapsed sanctum that once held the deity.",
      "The walls carry one of the densest programmes of sculpture in India: musicians, dancers, deities and erotic mithuna couples. UNESCO inscribed the temple in 1984.",
    ],
    quickFacts: [
      { label: "Built", value: "c. 1250 CE" },
      { label: "Dynasty", value: "Eastern Ganga" },
      { label: "UNESCO", value: "World Heritage Site (1984)" },
    ],
    imageUrl: konarkImg.url,
  },
  {
    id: "mahabalipuram", name: "Mahabalipuram", category: "Archaeology",
    lat: 12.6269, lon: 80.1927, region: "Mamallapuram, Tamil Nadu", year: 700,
    shortDescription: "Pallava-era shore temples and monolithic rathas carved into a granite ridge by the Bay of Bengal.",
    fullDescription: [
      "Under the Pallava king Narasimhavarman I and his successors, Mahabalipuram became a 7th–8th century laboratory for rock-cut architecture: monolithic chariots (the Pancha Rathas), cave temples and the great open-air bas relief of Arjuna's Penance, carved across two adjoining boulders.",
      "The granite Shore Temple, built around 700 CE, was one of the earliest free-standing stone temples of South India.",
    ],
    quickFacts: [
      { label: "Built", value: "7th–8th century CE" },
      { label: "Dynasty", value: "Pallava" },
      { label: "UNESCO", value: "World Heritage Site (1984)" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mamallapuram_view.jpg/1600px-Mamallapuram_view.jpg",
  },
  {
    id: "sanchi", name: "Sanchi Stupa", category: "Archaeology",
    lat: 23.4795, lon: 77.7396, region: "Raisen, Madhya Pradesh", year: -300,
    shortDescription: "The earliest surviving Buddhist monument in India — a hemispherical reliquary of brick and stone.",
    fullDescription: [
      "Commissioned by Emperor Ashoka in the 3rd century BCE on a hilltop in central India, the Great Stupa at Sanchi enshrines relics of the Buddha. Later Shunga and Satavahana patrons enlarged it and added the famous toranas — four carved gateways depicting the jataka tales.",
      "Sanchi marks the start of Indian architectural history. UNESCO inscribed the site in 1989.",
    ],
    quickFacts: [
      { label: "Built", value: "3rd c. BCE onwards" },
      { label: "Patron", value: "Emperor Ashoka" },
      { label: "UNESCO", value: "World Heritage Site (1989)" },
    ],
    imageUrl: sanchiImg.url,
  },
  {
    id: "pattadakal", name: "Pattadakal", category: "Archaeology",
    lat: 15.9486, lon: 75.8167, region: "Bagalkot, Karnataka", year: 740,
    shortDescription: "Chalukyan ceremonial city where North Indian and South Indian temple styles met and mingled.",
    fullDescription: [
      "Capital of the Badami Chalukyas in the 7th–8th centuries, Pattadakal was the coronation city of the dynasty. Its cluster of ten temples on the banks of the Malaprabha is the textbook site for the convergence of Nagara (north Indian) and Dravida (south Indian) architectural styles.",
      "The Virupaksha Temple, commissioned by Queen Lokamahadevi to mark her husband's victory over the Pallavas, became a model for the Kailasa monolith at Ellora a generation later.",
    ],
    quickFacts: [
      { label: "Built", value: "7th–8th century CE" },
      { label: "Dynasty", value: "Badami Chalukya" },
      { label: "UNESCO", value: "World Heritage Site (1987)" },
    ],
    imageUrl: pattadakalImg.url,
  },
  {
    id: "rakhigarhi", name: "Rakhigarhi", category: "Archaeology",
    lat: 29.2917, lon: 76.1135, region: "Hisar, Haryana", year: -2600,
    shortDescription: "The largest known Harappan city — bigger than Mohenjo-daro, still mostly buried under farmland.",
    fullDescription: [
      "Excavations since 1969 have revealed a planned Harappan city spread across at least seven mounds, with fired-brick streets, drains, granaries, jewellery workshops and a cemetery. DNA from a Rakhigarhi skeleton sequenced in 2019 carried no Steppe ancestry — a key data point in the long debate over Indo-Aryan migrations.",
    ],
    quickFacts: [
      { label: "Occupied", value: "c. 2600–1900 BCE" },
      { label: "Civilisation", value: "Indus Valley" },
      { label: "Famous for", value: "Largest Harappan city known" },
    ],
    imageUrl: rakhigarhiImg.url,
  },

  // ────────── NATURE ──────────
  {
    id: "kaziranga", name: "Kaziranga National Park", category: "Nature",
    lat: 26.577, lon: 93.171, region: "Golaghat & Nagaon, Assam", year: 1905,
    shortDescription: "Brahmaputra floodplain sheltering two-thirds of the world's one-horned rhinos.",
    fullDescription: [
      "A 1,090-square-kilometre mosaic of elephant grass, marshes and tropical forest formed by the Brahmaputra's annual floods. Given protected status in 1905 after Mary Curzon's failed search for a single rhino.",
      "Holds the largest population of the greater one-horned rhinoceros on Earth, alongside one of India's densest tiger populations.",
    ],
    quickFacts: [
      { label: "Established", value: "1905 (Reserved Forest)" },
      { label: "Famous for", value: "One-horned rhinoceros" },
      { label: "UNESCO", value: "World Heritage Site (1985)" },
    ],
    imageUrl: kazirangaImg.url,
  },
  {
    id: "sundarbans", name: "Sundarbans", category: "Nature",
    lat: 21.95, lon: 88.9, region: "South 24 Parganas, West Bengal", year: 1973,
    shortDescription: "The world's largest contiguous mangrove forest — and the realm of the swimming tiger.",
    fullDescription: [
      "Where the Ganges, Brahmaputra and Meghna empty into the Bay of Bengal, their silt has woven a 10,000-square-kilometre labyrinth of tidal creeks and mangrove islands.",
      "The Indian portion shelters one of the few Bengal tiger populations that habitually swim between islands and hunt in salt water. UNESCO inscribed it in 1987.",
    ],
    quickFacts: [
      { label: "Area (India)", value: "~4,260 km² of mangrove" },
      { label: "Famous for", value: "Royal Bengal tigers" },
      { label: "UNESCO", value: "World Heritage Site (1987)" },
    ],
    imageUrl: sundarbansImg.url,
  },
  {
    id: "nanda-devi", name: "Nanda Devi & Valley of Flowers", category: "Nature",
    lat: 30.378, lon: 79.970, region: "Chamoli, Uttarakhand", year: 1982,
    shortDescription: "A high-altitude sanctuary ringed by Himalayan peaks and carpeted with alpine bloom.",
    fullDescription: [
      "Centred on the 7,816-m Nanda Devi peak, this twin park system protects one of the most spectacular wilderness areas of the western Himalayas. The Valley of Flowers, rediscovered by mountaineer Frank Smythe in 1931, blooms each monsoon with more than 600 species of alpine flora.",
      "Together they shelter snow leopard, Himalayan musk deer, blue sheep and Asiatic black bear. UNESCO inscribed them in 1988 (extended 2005).",
    ],
    quickFacts: [
      { label: "Established", value: "1982 (NP)" },
      { label: "Highest point", value: "Nanda Devi — 7,816 m" },
      { label: "UNESCO", value: "World Heritage Site (1988)" },
    ],
    imageUrl: nandaDeviImg.url,
  },
  {
    id: "western-ghats", name: "Western Ghats", category: "Nature",
    lat: 12.5, lon: 75.5, region: "Six states along India's western seaboard", year: 1986,
    shortDescription: "An older-than-the-Himalayas mountain chain — one of eight 'hottest hotspots' of biodiversity on Earth.",
    fullDescription: [
      "Running 1,600 km from Gujarat to Kanyakumari, the Western Ghats predate the Himalayas. Their cloud forests, shola grasslands and laterite plateaux harbour more than 7,400 species of plants, 139 mammals, 508 birds and 179 amphibians — most found nowhere else.",
      "39 properties across the range were inscribed by UNESCO in 2012.",
    ],
    quickFacts: [
      { label: "Length", value: "~1,600 km" },
      { label: "Endemism", value: "325+ globally threatened species" },
      { label: "UNESCO", value: "World Heritage Site (2012)" },
    ],
    imageUrl: westernGhatsImg.url,
  },
  {
    id: "keoladeo", name: "Keoladeo (Bharatpur)", category: "Nature",
    lat: 27.1592, lon: 77.5222, region: "Bharatpur, Rajasthan", year: 1971,
    shortDescription: "Man-made wetland that becomes a Siberian-crane wintering ground each November.",
    fullDescription: [
      "Originally a duck-shooting reserve created by Maharaja Suraj Mal of Bharatpur in the 1850s, the 29-square-km mosaic of shallow lakes and acacia woodland was declared a national park in 1971.",
      "It hosts over 370 bird species — including the now critically endangered Siberian crane, which last bred here in the 1990s.",
    ],
    quickFacts: [
      { label: "Established", value: "1971 (NP)" },
      { label: "Bird species", value: "370+" },
      { label: "UNESCO", value: "World Heritage Site (1985)" },
    ],
    imageUrl: keoladeoImg.url,
  },
  {
    id: "great-himalayan", name: "Great Himalayan National Park", category: "Nature",
    lat: 31.745, lon: 77.519, region: "Kullu, Himachal Pradesh", year: 1984,
    shortDescription: "A glacier-fed wilderness sheltering snow leopards, Himalayan tahr and the western tragopan.",
    fullDescription: [
      "Established in 1984 in the upper Beas catchment, the park rises from 1,500 m to over 6,000 m and protects almost the entire altitudinal gradient of the western Himalayas. Its inaccessibility has kept poaching low and biodiversity intact.",
      "UNESCO inscribed the park in 2014.",
    ],
    quickFacts: [
      { label: "Established", value: "1984" },
      { label: "Altitude range", value: "1,500–6,110 m" },
      { label: "UNESCO", value: "World Heritage Site (2014)" },
    ],
    imageUrl: greatHimalayanImg.url,
  },
  {
    id: "andaman-reef", name: "Andaman & Nicobar Coral Reefs", category: "Nature",
    lat: 11.7401, lon: 92.6586, region: "Andaman & Nicobar Islands", year: 1956,
    shortDescription: "Some of India's healthiest coral reefs — and the last refuge of the Sentinelese.",
    fullDescription: [
      "Off the eastern flank of the Bay of Bengal, the Andaman & Nicobar archipelago harbours nearly 200 species of coral and over 1,200 species of reef fish across the Mahatma Gandhi Marine National Park and surrounding waters.",
      "The islands are also home to several indigenous peoples — including the Sentinelese, the last fully uncontacted population on Earth.",
    ],
    quickFacts: [
      { label: "Islands", value: "572 (37 inhabited)" },
      { label: "Marine NP", value: "Mahatma Gandhi (1983)" },
      { label: "Famous for", value: "Coral reefs & uncontacted peoples" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/The_Coral_Reef_at_the_Andaman_Islands.jpg/1600px-The_Coral_Reef_at_the_Andaman_Islands.jpg",
  },
  {
    id: "manas", name: "Manas National Park", category: "Nature",
    lat: 26.7167, lon: 91.0, region: "Baksa & Chirang, Assam", year: 1990,
    shortDescription: "Bhutan-border grasslands where pygmy hog, golden langur and Bengal tiger still cross paths.",
    fullDescription: [
      "Straddling the Bhutan border along the foothills of the eastern Himalayas, Manas was the first reserve under Project Tiger (1973), declared a National Park in 1990. It holds the world's only viable population of the pygmy hog and one of the last strongholds of the Bengal florican.",
      "UNESCO inscribed it in 1985.",
    ],
    quickFacts: [
      { label: "Established", value: "1990 (NP)" },
      { label: "Endemic to area", value: "Golden langur, pygmy hog" },
      { label: "UNESCO", value: "World Heritage Site (1985)" },
    ],
    imageUrl: manasImg.url,
  },

  // ────────── ARCHITECTURE ──────────
  {
    id: "taj-mahal", name: "Taj Mahal", category: "Architecture",
    lat: 27.1751, lon: 78.0421, region: "Agra, Uttar Pradesh", year: 1632,
    shortDescription: "The 17th-century white marble mausoleum built by Shah Jahan for Mumtaz Mahal.",
    fullDescription: [
      "Commissioned in 1632 by Shah Jahan in memory of his wife Mumtaz Mahal, the Taj sits on the south bank of the Yamuna. Two decades of work by some 20,000 artisans produced a perfectly symmetrical complex faced in translucent Makrana marble.",
      "Inlay work known as parchin kari studs the surfaces with jasper, jade, carnelian and lapis lazuli. UNESCO inscribed it in 1983.",
    ],
    quickFacts: [
      { label: "Built", value: "1632–1653" },
      { label: "Commissioned by", value: "Shah Jahan" },
      { label: "UNESCO", value: "World Heritage Site (1983)" },
    ],
    imageUrl: tajMahalImg.url,
  },
  {
    id: "qutub-minar", name: "Qutub Minar", category: "Architecture",
    lat: 28.5245, lon: 77.1855, region: "Delhi", year: 1192,
    shortDescription: "A 73-metre brick tower marking the first wave of Islamic architecture in India.",
    fullDescription: [
      "Begun in 1192 by Qutb-ud-din Aibak after the defeat of the last Hindu king of Delhi and completed by his successor Iltutmish, the Qutub Minar rises in five tapering storeys of red sandstone and marble, each band ringed by Quranic calligraphy.",
      "The surrounding complex includes the Iron Pillar of Delhi — a 1,600-year-old wrought-iron column that has barely rusted, a metallurgical mystery.",
    ],
    quickFacts: [
      { label: "Built", value: "1192–1220" },
      { label: "Height", value: "72.5 m" },
      { label: "UNESCO", value: "World Heritage Site (1993)" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/1600px-Qutb_Minar_2022.jpg",
  },
  {
    id: "red-fort", name: "Red Fort", category: "Architecture",
    lat: 28.6562, lon: 77.2410, region: "Old Delhi", year: 1648,
    shortDescription: "Shah Jahan's red sandstone citadel — political stage of Mughal Delhi and modern Republic Day.",
    fullDescription: [
      "Built between 1638 and 1648 when Shah Jahan moved his capital from Agra, the Lal Qila enclosed marble pavilions, a perfumed water channel (the Nahr-i-Bihisht), and the famed Peacock Throne.",
      "From its Lahori Gate every Independence Day since 1947 the Prime Minister of India addresses the nation. UNESCO inscribed it in 2007.",
    ],
    quickFacts: [
      { label: "Built", value: "1638–1648" },
      { label: "Patron", value: "Shah Jahan" },
      { label: "UNESCO", value: "World Heritage Site (2007)" },
    ],
    imageUrl: redFortImg.url,
  },
  {
    id: "meenakshi", name: "Meenakshi Temple", category: "Architecture",
    lat: 9.9195, lon: 78.1194, region: "Madurai, Tamil Nadu", year: 1623,
    shortDescription: "A 14-gopuram temple complex covered in 33,000 painted sculptures.",
    fullDescription: [
      "Dedicated to the fish-eyed goddess Meenakshi and her consort Sundareswarar, the present structure was rebuilt under the Nayaka kings in the 16th–17th centuries on a site of worship far older.",
      "Its 14 monumental gopurams, each between 45 and 50 m tall, are studded with over 33,000 brightly painted stucco figures. A festival temple in continuous daily worship for centuries.",
    ],
    quickFacts: [
      { label: "Rebuilt", value: "16th–17th c. CE" },
      { label: "Dynasty", value: "Madurai Nayakas" },
      { label: "Gopurams", value: "14" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/1600px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg",
  },
  {
    id: "golden-temple", name: "Harmandir Sahib (Golden Temple)", category: "Architecture",
    lat: 31.6200, lon: 74.8765, region: "Amritsar, Punjab", year: 1604,
    shortDescription: "The spiritual centre of Sikhism — a marble shrine on a pool of nectar.",
    fullDescription: [
      "Founded by the fourth Guru Ram Das around 1577, completed and consecrated under Guru Arjan in 1604, Harmandir Sahib enshrines the Guru Granth Sahib. The Mughal-era gilded copper cladding and Sikh frescoes of the upper levels were added under Maharaja Ranjit Singh in the early 19th century.",
      "Its langar feeds up to 100,000 people every day, free, regardless of caste or creed.",
    ],
    quickFacts: [
      { label: "Founded", value: "c. 1577 CE" },
      { label: "Tradition", value: "Sikhism" },
      { label: "Langar", value: "~100,000 meals/day" },
    ],
    imageUrl: goldenTempleImg.url,
  },
  {
    id: "mysore-palace", name: "Mysore Palace", category: "Architecture",
    lat: 12.3052, lon: 76.6552, region: "Mysuru, Karnataka", year: 1912,
    shortDescription: "Indo-Saracenic seat of the Wadiyars, lit by 97,000 bulbs on Dasara nights.",
    fullDescription: [
      "Designed by British architect Henry Irwin after the old wooden palace burned down in 1897, the present three-storey grey-granite palace was completed in 1912 for the Wadiyar dynasty.",
      "Its synthesis of Hindu, Mughal, Rajput and Gothic motifs is the high-water mark of Indo-Saracenic architecture. During Dasara, every cornice and arch is outlined in incandescent bulbs.",
    ],
    quickFacts: [
      { label: "Built", value: "1897–1912" },
      { label: "Dynasty", value: "Wadiyar" },
      { label: "Style", value: "Indo-Saracenic" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/1600px-Mysore_Palace_Morning.jpg",
  },
  {
    id: "victoria-memorial", name: "Victoria Memorial", category: "Architecture",
    lat: 22.5448, lon: 88.3426, region: "Kolkata, West Bengal", year: 1921,
    shortDescription: "An Edwardian marble pile commemorating Empress Victoria — now a museum of the Raj.",
    fullDescription: [
      "Conceived by Lord Curzon, designed by William Emerson and completed in 1921, the Victoria Memorial is built from the same Makrana marble as the Taj, on 64 acres of formal garden.",
      "Today it holds one of the largest collections of British-era oil paintings, manuscripts and arms in India.",
    ],
    quickFacts: [
      { label: "Built", value: "1906–1921" },
      { label: "Architect", value: "William Emerson" },
      { label: "Holdings", value: "28,000+ artefacts" },
    ],
    imageUrl: victoriaMemorialImg.url,
  },
  {
    id: "charminar", name: "Charminar", category: "Architecture",
    lat: 17.3616, lon: 78.4747, region: "Hyderabad, Telangana", year: 1591,
    shortDescription: "A four-minareted gateway raised in 1591 at the heart of newly founded Hyderabad.",
    fullDescription: [
      "Built in 1591 by Muhammad Quli Qutb Shah to mark the founding of Hyderabad — and by tradition, to commemorate the end of a plague — the Charminar rises 56 metres at the intersection of the four cardinal streets of the old city.",
      "Around it sprawls the Laad Bazaar, famed for lacquer bangles, perfumes and pearls.",
    ],
    quickFacts: [
      { label: "Built", value: "1591 CE" },
      { label: "Patron", value: "Muhammad Quli Qutb Shah" },
      { label: "Height", value: "56 m" },
    ],
    imageUrl: charminarImg.url,
  },

  // ────────── ART & CRAFTS ──────────
  {
    id: "khajuraho", name: "Khajuraho Group of Temples", category: "Art & Crafts",
    lat: 24.8318, lon: 79.9199, region: "Chhatarpur, Madhya Pradesh", year: 950,
    shortDescription: "Chandela-era sandstone temples celebrated for their dense, virtuosic sculpture.",
    fullDescription: [
      "Built between 950 and 1050 CE by the Chandela dynasty, the Khajuraho temples once numbered 85; about 25 survive. Their exteriors are sheathed in bands of sculpture — gods, courtly women, processions and the celebrated mithuna couples.",
      "Abandoned after the 13th century, they were swallowed by jungle until 1838. UNESCO inscribed the group in 1986.",
    ],
    quickFacts: [
      { label: "Built", value: "950–1050 CE" },
      { label: "Dynasty", value: "Chandela" },
      { label: "UNESCO", value: "World Heritage Site (1986)" },
    ],
    imageUrl: khajurahoImg.url,
  },
  {
    id: "madhubani", name: "Madhubani Painting Villages", category: "Art & Crafts",
    lat: 26.3552, lon: 86.0726, region: "Mithila, Bihar", year: 700,
    shortDescription: "A women's painting tradition of the Mithila region — ritual walls turned into a global art form.",
    fullDescription: [
      "Madhubani (or Mithila) painting was traditionally made by women on the freshly plastered walls of their homes for weddings and seasonal rituals. Five distinct styles — Bharni, Katchni, Tantric, Godna and Kohbar — use natural dyes and bamboo-stick brushes.",
      "The art moved to paper in the 1960s after a drought devastated farming income, becoming one of India's most recognisable folk traditions.",
    ],
    quickFacts: [
      { label: "Region", value: "Mithila, north Bihar" },
      { label: "Recognised by GI", value: "2007" },
      { label: "Famous styles", value: "Bharni, Katchni, Kohbar" },
    ],
    imageUrl: madhubaniImg.url,
  },
  {
    id: "raghurajpur", name: "Raghurajpur Pattachitra", category: "Art & Crafts",
    lat: 19.8975, lon: 85.7833, region: "Puri, Odisha", year: 1100,
    shortDescription: "A heritage village where every household paints scrolls of Jagannath in egg-tempera technique.",
    fullDescription: [
      "Tucked into a coconut grove near Puri, Raghurajpur was declared India's first heritage village in 2000. Every one of its ~120 houses produces Pattachitra — narrative cloth paintings of Jagannath, Krishna and Ramayana scenes — using pigments from conch, lamp black, hingula and shell lime.",
      "The village is also the birthplace of the Gotipua dance tradition, the precursor of Odissi.",
    ],
    quickFacts: [
      { label: "Status", value: "Heritage village (2000)" },
      { label: "Craft", value: "Pattachitra, Gotipua" },
      { label: "Pigments", value: "Natural minerals & shells" },
    ],
    imageUrl: raghurajpurImg.url,
  },
  {
    id: "channapatna", name: "Channapatna Toys", category: "Art & Crafts",
    lat: 12.6519, lon: 77.2114, region: "Channapatna, Karnataka", year: 1700,
    shortDescription: "A 200-year-old lac-and-lathe toy tradition that travelled from Persia via Tipu Sultan.",
    fullDescription: [
      "Local lore credits Tipu Sultan with inviting Persian craftsmen to Channapatna to teach the technique of lac-turnery in the late 18th century. Today some 6,000 artisans turn ivorywood and rubberwood on hand- and pedal-lathes, finishing pieces with vegetable-dye lac.",
      "Granted a Geographical Indication tag in 2005, the toys are non-toxic, infant-safe and have become India's signature craft toy.",
    ],
    quickFacts: [
      { label: "Tradition since", value: "Late 18th c. CE" },
      { label: "GI tag", value: "2005" },
      { label: "Wood used", value: "Wrightia tinctoria (aale mara)" },
    ],
    imageUrl: channapatnaImg.url,
  },
  {
    id: "tanjore-paintings", name: "Tanjore Paintings", category: "Art & Crafts",
    lat: 10.7867, lon: 79.1378, region: "Thanjavur, Tamil Nadu", year: 1600,
    shortDescription: "Glittering devotional panels — gold foil, gemstones and gesso, perfected under the Marathas.",
    fullDescription: [
      "Developed in Thanjavur under the patronage of the Maratha rulers in the 17th–18th centuries, Tanjore painting layers a wooden plank with chalk gesso, applies hammered 22-karat gold foil and inlays semi-precious stones to render images of Hindu deities — usually a serene, infant-faced Krishna or Balaji.",
    ],
    quickFacts: [
      { label: "Tradition since", value: "17th c. CE" },
      { label: "Patrons", value: "Maratha rulers of Thanjavur" },
      { label: "GI tag", value: "2007" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Thanjavur_art_from_south_India.jpg/1600px-Thanjavur_art_from_south_India.jpg",
  },
  {
    id: "kanchipuram-silk", name: "Kanchipuram Silk Weaving", category: "Art & Crafts",
    lat: 12.8342, lon: 79.7036, region: "Kanchipuram, Tamil Nadu", year: 400,
    shortDescription: "Heavy mulberry-silk saris woven with separately-attached zari borders — the temple sari of the south.",
    fullDescription: [
      "Believed to descend from the Chola-era weavers Markanda and Sage Markandeya, Kanchipuram saris are woven in three separate parts — body, border and pallu — and then interlocked with the rare korvai technique so the borders survive even if the body wears out.",
      "Three-ply pure mulberry silk and real gold-and-silver zari give a single sari its weight, drape and price.",
    ],
    quickFacts: [
      { label: "Tradition since", value: "~400 CE (legendary)" },
      { label: "GI tag", value: "2005" },
      { label: "Technique", value: "Korvai (interlocked borders)" },
    ],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Kanchipuram_silk_sareer.JPG/1600px-Kanchipuram_silk_sareer.JPG",
  },

  // ────────── LIVING HERITAGE ──────────
  {
    id: "jaisalmer-fort", name: "Jaisalmer Fort", category: "Living Heritage",
    lat: 26.9124, lon: 70.9128, region: "Jaisalmer, Rajasthan", year: 1156,
    shortDescription: "A 12th-century golden-sandstone fort in the Thar desert still inhabited by thousands.",
    fullDescription: [
      "Founded in 1156 by Rao Jaisal Bhati on Trikuta Hill, Jaisalmer Fort rises out of the Thar in honey-coloured Jurassic sandstone. Its 99 bastions and triple walls guarded a key staging post on caravan routes between India and Central Asia.",
      "Unlike most Indian forts, Jaisalmer is a living fortress — a quarter of the city's population still resides inside. UNESCO inscribed it in 2013.",
    ],
    quickFacts: [
      { label: "Founded", value: "1156 CE" },
      { label: "Founder", value: "Rao Jaisal Bhati" },
      { label: "UNESCO", value: "Hill Forts of Rajasthan (2013)" },
    ],
    imageUrl: jaisalmerImg.url,
  },
  {
    id: "varanasi", name: "Varanasi Ghats", category: "Living Heritage",
    lat: 25.3176, lon: 83.0064, region: "Varanasi, Uttar Pradesh", year: -1000,
    shortDescription: "Eighty-eight stone ghats stepping into the Ganga — perhaps the oldest continuously inhabited city on Earth.",
    fullDescription: [
      "Sacred to Hindus, Buddhists and Jains alike, Kashi has been a continuous centre of pilgrimage and learning for at least three millennia. Its 88 ghats — Dashashwamedh, Manikarnika, Assi and the rest — descend in cut sandstone steps to the Ganga.",
      "The Ganga Aarti each dusk, and the funeral pyres of Manikarnika that never go out, remain the visible heart of the city's living religion.",
    ],
    quickFacts: [
      { label: "Continuously inhabited", value: "since ~1000 BCE" },
      { label: "Ghats", value: "88" },
      { label: "River", value: "Ganga" },
    ],
    imageUrl: varanasiImg.url,
  },
  {
    id: "kumbh-prayagraj", name: "Kumbh Mela at Prayagraj", category: "Living Heritage",
    lat: 25.4304, lon: 81.8467, region: "Prayagraj, Uttar Pradesh", year: 600,
    shortDescription: "The largest peaceful gathering of humans on Earth — held at the Triveni Sangam every 12 years.",
    fullDescription: [
      "Documented since at least the 7th century by the Chinese pilgrim Xuanzang, the Kumbh Mela cycles between Prayagraj, Haridwar, Ujjain and Nashik. The 2025 Maha Kumbh at Prayagraj drew an estimated 600 million people over 45 days.",
      "UNESCO added the Kumbh Mela to its Intangible Cultural Heritage list in 2017.",
    ],
    quickFacts: [
      { label: "Documented since", value: "7th c. CE (Xuanzang)" },
      { label: "Cycle", value: "Every 12 years" },
      { label: "UNESCO", value: "Intangible Heritage (2017)" },
    ],
    imageUrl: kumbhImg.url,
  },
  {
    id: "theyyam", name: "Theyyam of North Malabar", category: "Living Heritage",
    lat: 11.87, lon: 75.37, region: "Kannur & Kasaragod, Kerala", year: 1500,
    shortDescription: "A ritual possession-dance in which the dancer becomes the deity for the duration of the performance.",
    fullDescription: [
      "Practised in over 400 shrines across North Malabar between October and May, Theyyam is one of South India's oldest surviving ritual art forms. The dancer dons towering headgear, full-body paint of natural pigments and a costume of fronds, then becomes the deity invoked — speaking with their voice and blessing devotees.",
      "More than 450 distinct Theyyams exist, each tied to a specific lineage shrine.",
    ],
    quickFacts: [
      { label: "Region", value: "North Malabar, Kerala" },
      { label: "Season", value: "October–May" },
      { label: "Distinct forms", value: "450+" },
    ],
    imageUrl: theyyamImg.url,
  },
  {
    id: "pushkar-fair", name: "Pushkar Camel Fair", category: "Living Heritage",
    lat: 26.4894, lon: 74.5511, region: "Pushkar, Rajasthan", year: 1100,
    shortDescription: "An eight-day livestock fair around a sacred Brahma-temple lake, drawing 200,000 people every Kartik.",
    fullDescription: [
      "Held in the Hindu month of Kartik (Oct–Nov) at a lake said to have formed when Brahma dropped a lotus, the Pushkar Mela combines pilgrimage with one of the largest camel and livestock fairs in the world.",
      "Camel trading, mustachioed-man contests, folk music and a final full-moon bath in the lake mark the closing days.",
    ],
    quickFacts: [
      { label: "Tradition since", value: "Documented from 12th c." },
      { label: "Held in", value: "Kartik (Oct–Nov)" },
      { label: "Footfall", value: "~200,000" },
    ],
    imageUrl: pushkarImg.url,
  },
  {
    id: "majuli", name: "Majuli Satras", category: "Living Heritage",
    lat: 27.0034, lon: 94.2196, region: "Majuli, Assam", year: 1500,
    shortDescription: "Vaishnavite monastic islands on the Brahmaputra — home of Sattriya, India's youngest classical dance.",
    fullDescription: [
      "Majuli is the world's largest river island and the cradle of the neo-Vaishnavite reform movement led by Srimanta Sankardev in the 15th–16th centuries. Of the 65 satras (monasteries) he founded, 22 still operate here, teaching mask-making, manuscript painting and the Sattriya dance form.",
      "Sattriya was recognised as a classical dance of India in 2000 — the youngest of the eight classical traditions.",
    ],
    quickFacts: [
      { label: "Monasteries (satras)", value: "22 active" },
      { label: "Tradition", value: "Neo-Vaishnavism (Sankardev)" },
      { label: "Famous for", value: "Sattriya dance" },
    ],
    imageUrl: majuliImg.url,
  },
];

export const heritageCategories: HeritageCategory[] = [
  "Archaeology",
  "Nature",
  "Architecture",
  "Art & Crafts",
  "Living Heritage",
];

// Pushpin colour per category — Talking Tours-style flat dots.
export const categoryStyles: Record<
  HeritageCategory,
  { color: string; label: string }
> = {
  Archaeology:      { color: "#c2410c", label: "Archaeology" },        // burnt orange
  Nature:           { color: "#15803d", label: "Nature" },             // forest green
  Architecture:     { color: "#be123c", label: "Architecture" },       // crimson
  "Art & Crafts":   { color: "#a21caf", label: "Art & Crafts" },       // fuchsia
  "Living Heritage":{ color: "#0e7490", label: "Living Heritage" },    // teal
};

// Timeline range covered by `year`.
export const TIMELINE_MIN = -2700;
export const TIMELINE_MAX = 2026;
