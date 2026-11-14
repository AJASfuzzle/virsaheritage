import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";

type Craft = { region: string; craft: string; note: string };
type Era = {
  year: number;
  tag: string;
  title: string;
  body: string;
  mapLabel: string;
  crafts: Craft[];
};

const eras: Era[] = [
  {
    year: 1800,
    tag: "Age of Kingdoms",
    title: "A subcontinent of sovereigns",
    body: "The East India Company is still one power among many. Sikh misls, Maratha confederacies, Rajput houses and southern princely states each guard their own court arts, looms and kilns.",
    mapLabel: "Kingdoms & princely states of 1800",
    crafts: [
      { region: "Punjab (Sikh Misls)", craft: "Phulkari embroidery", note: "Flower-work shawls stitched by women for weddings and harvest." },
      { region: "Kashmir", craft: "Pashmina & Kani shawls", note: "Changthangi wool hand-woven on twill-tapestry looms for Mughal and Persian courts." },
      { region: "Rajputana", craft: "Bandhani tie-dye", note: "Tiny knotted dots forming odhnis worn across desert courts." },
      { region: "Sindhia / Maratha Gwalior", craft: "Chanderi weaving", note: "Sheer cotton-silk saris patronised by Maratha queens." },
      { region: "Awadh (Lucknow)", craft: "Chikankari", note: "White-on-white shadow embroidery refined under Nawabi ateliers." },
      { region: "Bengal", craft: "Jamdani muslin", note: "Air-light Dhaka muslin patterned on the loom itself." },
      { region: "Central Provinces", craft: "Gond painting", note: "Forest-spirit murals dotted in natural pigment by Gond clans." },
      { region: "Nizam Dominions", craft: "Bidriware", note: "Blackened zinc-copper alloy inlaid with silver thread." },
      { region: "Mysore", craft: "Mysore silk & sandalwood", note: "Court looms of Wodeyar Mysore wove gold-bordered silks." },
      { region: "Travancore", craft: "Aranmula Kannadi", note: "Hand-polished metal mirrors cast by a single family lineage." },
    ],
  },
  {
    year: 1900,
    tag: "British Raj",
    title: "Crown rule over a patchwork of courts",
    body: "British presidencies stretch from Punjab to Madras while princely states keep their darbars alive. Railways carry crafts to world fairs; village ateliers feed colonial demand without losing their idiom.",
    mapLabel: "Presidencies & princely states of 1900",
    crafts: [
      { region: "Punjab Province", craft: "Phulkari & Pashmina", note: "Amritsar becomes a trading hub for Kashmiri shawls bound for Europe." },
      { region: "Bengal Presidency", craft: "Kantha embroidery", note: "Layered old saris stitched with running thread into quilts and stories." },
      { region: "Bombay Presidency", craft: "Paithani sari & Warli art", note: "Yeola looms weave peacock pallus; Adivasi villages paint ritual murals." },
      { region: "Madras Presidency", craft: "Tanjore painting", note: "Gold-leaf devotional panels patronised by the Maratha Bhonsles of Thanjavur." },
      { region: "Hyderabad State", craft: "Bidriware", note: "Silver-inlaid hookahs and pandans crafted by Bidar artisans." },
      { region: "Mysore State", craft: "Mysore silk", note: "Wodeyars set up state silk farms; the zari-bordered sari becomes iconic." },
      { region: "Rajputana Agency", craft: "Blue pottery of Jaipur", note: "Quartz-based cobalt ceramics revived under Sawai Ram Singh II." },
      { region: "United Provinces (Oudh)", craft: "Chikankari & Banarasi silk", note: "Lucknow shadow-work and Varanasi brocades dominate festive wardrobes." },
      { region: "Assam", craft: "Muga silk", note: "Golden-yellow silk reared only along the Brahmaputra." },
      { region: "Portuguese Goa", craft: "Azulejo tiles & Kunbi weave", note: "Indo-Portuguese tilework on church facades and old Goan homes." },
    ],
  },
  {
    year: 1947,
    tag: "Independence",
    title: "A new union of states",
    body: "Midnight, 15 August. Princely states accede, lines are redrawn, refugees carry recipes and looms across new borders. Crafts become quiet markers of identity for a country learning to call itself one.",
    mapLabel: "States & provinces of independent India, 1947",
    crafts: [
      { region: "East Punjab", craft: "Phulkari", note: "Bagh shawls carried by Partition refugees from Lyallpur into Patiala and Delhi." },
      { region: "Bombay State", craft: "Warli & Paithani", note: "Tribal Warli art and Yeola's peacock saris share one administrative roof." },
      { region: "Madras State", craft: "Kanchipuram silk", note: "Temple-town looms weave triple-ply zari saris for the new republic's weddings." },
      { region: "West Bengal", craft: "Kantha & Baluchari", note: "Refugee women from East Bengal carry the kantha stitch into Bengal's cities." },
      { region: "United Provinces", craft: "Chikankari & Banarasi brocade", note: "Lucknow and Varanasi remain the workshops of the Indo-Gangetic plain." },
      { region: "Hyderabad State", craft: "Bidriware & Pochampally ikat", note: "Nizam-era ateliers persist even as the state merges into the Union." },
      { region: "Mysore State", craft: "Mysore silk & Channapatna toys", note: "Lacquered wooden toys ride the new Indian Railways to children nationwide." },
      { region: "Rajasthan", craft: "Blue pottery & Bandhani", note: "Jaipur, Jodhpur and Sanganer keep their court crafts as a tourist economy seeds." },
      { region: "Madhya Bharat", craft: "Chanderi & Maheshwari", note: "Holkar-patronised Maheshwari saris re-enter national wardrobes." },
      { region: "Bihar", craft: "Madhubani painting", note: "Courtyard murals first 'discovered' by the wider world after the 1934 quake." },
      { region: "Orissa", craft: "Pattachitra & Sambalpuri ikat", note: "Palm-leaf scrolls of Jagannath stories and tie-dyed ikat saris." },
      { region: "Travancore–Cochin", craft: "Kasavu & Aranmula mirror", note: "Off-white cotton with gold border becomes Kerala's signature drape." },
      { region: "Assam", craft: "Muga & Eri silk", note: "Sualkuchi villages weave golden Muga for the post-independence elite." },
    ],
  },
  {
    year: 2026,
    tag: "Living Atlas",
    title: "Twenty-eight states, a thousand crafts",
    body: "GI tags, e-commerce and VIRSA itself now help artisans reach the world. New states - Telangana, Uttarakhand, Jharkhand, Chhattisgarh - formalise crafts that had always been there. Memory becomes a map you can search.",
    mapLabel: "Present-day states & union territories, 2026",
    crafts: [
      { region: "Telangana", craft: "Pochampally Ikat & Bidriware", note: "India's first GI-tagged handloom; double-ikat silk-cotton from Bhoodan Pochampally." },
      { region: "Chhattisgarh", craft: "Dhokra metal casting", note: "4,000-year-old lost-wax bronze tradition of the Bastar adivasis." },
      { region: "Jharkhand", craft: "Sohrai & Khovar painting", note: "Harvest and wedding murals by Santhal and Kurmi women of Hazaribagh." },
      { region: "Uttarakhand", craft: "Aipan art", note: "Red-and-white ritual floor paintings of the Kumaon hills." },
      { region: "Ladakh (UT)", craft: "Thangka & Pashmina", note: "Changpa nomads herd the goats whose wool becomes the world's finest shawl." },
      { region: "Andhra Pradesh", craft: "Kalamkari", note: "Sri Kalahasti's pen-drawn, vegetable-dyed cottons go global." },
      { region: "Karnataka", craft: "Mysore silk & Channapatna toys", note: "GI-tagged lacquerware now sold from Tokyo to Toronto." },
      { region: "Kerala", craft: "Kasavu & Aranmula Kannadi", note: "The metal mirror - one of only nine GI-tagged metal crafts." },
      { region: "Tamil Nadu", craft: "Kanchipuram silk & Thanjavur paintings", note: "Temple-town crafts thrive on weddings and online couture." },
      { region: "Odisha", craft: "Pattachitra & Sambalpuri ikat", note: "Raghurajpur heritage village trains a new generation of painters." },
      { region: "West Bengal", craft: "Kantha, Baluchari & Dokra", note: "Birbhum and Bishnupur run designer-craft collaborations." },
      { region: "Bihar", craft: "Madhubani painting", note: "Now seen on railway stations, sneakers and fashion runways." },
      { region: "Uttar Pradesh", craft: "Chikankari & Banarasi silk", note: "Lucknow and Varanasi remain India's largest craft economies." },
      { region: "Madhya Pradesh", craft: "Chanderi, Maheshwari & Gond art", note: "Gond painters like Jangarh Singh Shyam's lineage exhibit worldwide." },
      { region: "Maharashtra", craft: "Paithani & Warli", note: "Warli enters museum collections from Mumbai to MoMA." },
      { region: "Gujarat", craft: "Patola, Bandhani & Rogan art", note: "Nirona village's last Rogan painters keep an 8-family tradition alive." },
      { region: "Rajasthan", craft: "Blue pottery, Bandhani, Miniature painting", note: "Jaipur literature, Jodhpur RIFF and craft melas anchor the calendar." },
      { region: "Punjab", craft: "Phulkari", note: "Co-operatives in Patiala and Sangrur lead a global revival." },
      { region: "Haryana", craft: "Surajkund pottery & durries", note: "Surajkund Mela hosts artisans from every state each February." },
      { region: "Assam", craft: "Muga silk & Bamboo craft", note: "Sualkuchi's golden Muga remains exclusive to the Brahmaputra valley." },
      { region: "Meghalaya", craft: "Khasi-Jaintia bamboo & cane", note: "Living-root bridges and woven bamboo homeware of the Khasi hills." },
      { region: "Nagaland", craft: "Naga shawls & wood carving", note: "Hornbill Festival showcases tribe-specific weaves every December." },
      { region: "Manipur", craft: "Moirang Phee, Phanek & pottery", note: "Longpi black-stone pottery and temple-motif weaves." },
      { region: "Mizoram", craft: "Puanchei textile", note: "Bridal shawls woven in red, white and black on loin looms." },
      { region: "Tripura", craft: "Risa & bamboo craft", note: "Tribal Risa wrap, woven by Tripuri and Reang women." },
      { region: "Arunachal Pradesh", craft: "Apatani & Monpa weaves", note: "Wool shawls and bamboo hats from the eastern Himalayan tribes." },
      { region: "Sikkim", craft: "Thangka & Lepcha weaving", note: "Monastery-trained painters and bamboo-loom textiles." },
      { region: "Himachal Pradesh", craft: "Kullu & Kinnauri shawls", note: "Geometric-bordered wool shawls; GI-tagged Kullu weaves." },
      { region: "Jammu & Kashmir (UT)", craft: "Pashmina, Sozni, Papier-mâché", note: "Srinagar's craft economy among the densest in the world." },
      { region: "Goa", craft: "Azulejo tiles & coconut craft", note: "Indo-Portuguese tilework revived by contemporary Goan studios." },
      { region: "Delhi (UT)", craft: "Zardozi & Meenakari", note: "Old Delhi's karkhanas embroider couture for global runways." },
    ],
  },
];

export function Timeline() {
  const [active, setActive] = useState<number>(1947);
  const era = eras.find((e) => e.year === active)!;
  const years = eras.map((e) => e.year);

  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Timeline Explorer</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl text-balance">
            Walk through <span className="italic text-gradient-ember">two centuries of culture</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            From the courts of 1800 to the digital atlas of today - see how the
            kingdoms, presidencies and states of India each carried a craft of
            their own.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl glass p-8 grain">
            <div className="text-xs uppercase tracking-[0.28em] text-primary/90">{era.tag}</div>
            <motion.h3
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-3xl sm:text-4xl text-balance"
            >
              {era.title}
            </motion.h3>
            <motion.p
              key={`${active}-body`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-foreground/75 leading-relaxed text-pretty"
            >
              {era.body}
            </motion.p>
            <div className="mt-6 font-display text-6xl sm:text-7xl text-gradient-ember">{active}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">{era.mapLabel}</div>
          </div>

          <div className="rounded-3xl glass p-8">
            <div className="text-sm text-muted-foreground mb-6">Drag through the eras</div>
            <div className="relative">
              <div className="absolute left-0 right-0 top-[7px] h-px bg-foreground/15" />
              <div className="flex items-center justify-between relative">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActive(y)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <span
                      className={`block h-3.5 w-3.5 rounded-full transition-all ${
                        active === y
                          ? "bg-primary ring-4 ring-primary/25 scale-125"
                          : "bg-foreground/30 group-hover:bg-foreground/60"
                      }`}
                    />
                    <span
                      className={`font-display text-sm transition ${
                        active === y ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {y}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={years.length - 1}
              value={years.indexOf(active)}
              onChange={(e) => setActive(years[Number(e.target.value)])}
              className="mt-10 w-full accent-primary"
              aria-label="Timeline slider"
            />

            <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {era.crafts.length} regions · {era.crafts.length} living crafts
            </div>
          </div>
        </div>

        {/* Region → Craft grid */}
        <motion.div
          key={`grid-${active}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {era.crafts.map((c, i) => (
            <motion.div
              key={`${active}-${c.region}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03, duration: 0.4 }}
              className="group rounded-2xl glass p-5 ring-1 ring-white/5 transition hover:ring-primary/30"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {c.region}
              </div>
              <div className="mt-2 font-display text-lg text-foreground text-balance">
                {c.craft}
              </div>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed text-pretty">
                {c.note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
