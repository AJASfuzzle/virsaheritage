import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, Sparkles, X, ArrowRight, BookOpen, Upload, Heart, Mic, FileText } from "lucide-react";


export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Library of VIRSA — A Curated Archive of Living History" },
      { name: "description", content: "Wander shelves of civilizations, languages, legends, architecture, art, and music. Every story opens another door through time." },
      { property: "og:title", content: "The Library of VIRSA" },
      { property: "og:description", content: "A curated archive where every shelf whispers another forgotten story." },
    ],
  }),
  component: LibraryPage,
});

/* ---------------- data ---------------- */

type Story = {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  tag: string;
  curator?: boolean;
  body?: string;
};

type Shelf = {
  id: string;
  name: string;
  whisper: string;
  stories: Story[];
};

const SHELVES: Shelf[] = [
  {
    id: "civilizations",
    name: "Civilizations",
    whisper: "Empires that drew the maps we still walk.",
    stories: [
      { id: "indus", title: "Indus Valley", blurb: "Cities of brick, water, and quiet symmetry.", minutes: 8, tag: "Civilization", curator: true,
        body: "Five thousand years ago, the people of the Indus laid streets at right angles, built granaries the size of city squares, and bathed in vast public pools fed by engineered drains. We still cannot read their script, yet their seals — a bull, a horned figure in meditation — speak across the silence." },
      { id: "mauryan", title: "Mauryan Empire", blurb: "Ashoka’s edicts carved on stone, taller than thrones.", minutes: 7, tag: "Civilization",
        body: "From Pataliputra, Chandragupta and his grandson Ashoka built a state that stretched from the Hindu Kush to the Bay of Bengal. After Kalinga, Ashoka traded conquest for dharma, and had his remorse inscribed on rocks and polished sandstone pillars across the subcontinent." },
      { id: "gupta", title: "Gupta Period", blurb: "A golden age of mathematics, metallurgy, and verse.", minutes: 6, tag: "Civilization", curator: true,
        body: "The zero, the decimal place, the iron pillar of Delhi that does not rust — and Kalidasa writing of clouds carrying lovers’ messages. The Gupta court turned curiosity into a quiet, unhurried civilization." },
      { id: "chola", title: "Chola Dynasty", blurb: "Bronzes that dance and a navy that crossed oceans.", minutes: 9, tag: "Civilization",
        body: "From Tanjore, the Cholas cast Shiva as the cosmic dancer in lost-wax bronze and sent fleets to Srivijaya. Their temples are not buildings; they are calendars, treasuries, theatres, and astronomical instruments at once." },
      { id: "mughal", title: "Mughal Era", blurb: "Persian gardens, Indian stone, and an emperor who wept at marble.", minutes: 7, tag: "Civilization",
        body: "Babur the gardener, Akbar the listener, Shah Jahan the builder. A dynasty that fused Persia and India into miniatures, charbagh gardens, and a tomb of white marble that changes colour with the hours." },
    ],
  },
  {
    id: "languages",
    name: "Languages & Scripts",
    whisper: "Letters that remember what mouths forgot.",
    stories: [
      { id: "sanskrit", title: "Sanskrit", blurb: "A grammar so precise it inspired computer science.", minutes: 6, tag: "Language", curator: true,
        body: "Panini’s Ashtadhyayi, written around the 4th century BCE, describes Sanskrit in 3,959 rules — a generative grammar two millennia before Chomsky. The language carries the Vedas, the Mahabharata, and the Bhagavad Gita." },
      { id: "brahmi", title: "Brahmi", blurb: "The mother script of half a continent.", minutes: 5, tag: "Script",
        body: "From Brahmi descend Devanagari, Tamil, Sinhala, Burmese, Thai, Khmer, Tibetan. Ashoka’s pillars are written in it. For centuries no one could read them — until James Prinsep decoded the script in 1837." },
      { id: "tamil", title: "Tamil Literature", blurb: "Sangam poems older than most empires.", minutes: 7, tag: "Language",
        body: "The Sangam corpus — 2,381 poems by 473 poets — speaks of love, war, kings, and rain on red earth. Tamil is one of the oldest continuously spoken languages in the world." },
      { id: "persian", title: "Persian Influences", blurb: "The court tongue that became a poet’s mother.", minutes: 5, tag: "Language",
        body: "For five hundred years Persian was the language of administration and verse across South Asia. Ghalib, Amir Khusrau, and a thousand letters between merchants and emperors all flowed through it." },
      { id: "dialects", title: "Forgotten Dialects", blurb: "Voices that survive in lullabies and ledgers.", minutes: 6, tag: "Language",
        body: "Brokpa, Toto, Majhi, Kharia — dozens of tongues spoken by a few hundred elders each. Each one is an entire grammar, an entire cosmology, vanishing in real time." },
    ],
  },
  {
    id: "legends",
    name: "Legends & Folklore",
    whisper: "Stories that walked before they were ever written.",
    stories: [
      { id: "myths", title: "Regional Myths", blurb: "Why the river turned, why the mountain bowed.", minutes: 5, tag: "Folklore",
        body: "Every hill and every bend of a river has a story attached — a goddess who refused to marry, a saint who shifted a peak with a glance, a serpent that taught a king humility." },
      { id: "heroes", title: "Heroic Tales", blurb: "Pabuji, Tejaji, the chieftains who came back for one last duty.", minutes: 6, tag: "Folklore", curator: true,
        body: "In Rajasthan, painted scrolls called phads tell the story of Pabuji across a single seven-metre cloth, sung through the night by bhopas with the help of a single oil lamp." },
      { id: "sacred", title: "Sacred Stories", blurb: "Krishna’s mischief, Sita’s exile, Buddha’s silence.", minutes: 7, tag: "Folklore",
        body: "The Mahabharata is fifteen times the length of the Bible and the Iliad combined. The Ramayana is performed every year in a thousand villages, with the same lines and a different sky." },
      { id: "oral", title: "Oral Traditions", blurb: "Memory as the oldest archive we have.", minutes: 5, tag: "Folklore",
        body: "The Rig Veda survived for over a thousand years before being written, preserved syllable-perfect by the oral memory of Brahmin schools — a feat unrivalled in any other tradition." },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    whisper: "Stone that learned to breathe.",
    stories: [
      { id: "temples", title: "Temples", blurb: "Mountains carved inward until they became gods.", minutes: 8, tag: "Architecture", curator: true,
        body: "From Kailasanatha at Ellora — carved top-down out of a single rock — to the soaring shikharas of Khajuraho, Indian temples are cosmologies in stone." },
      { id: "forts", title: "Forts", blurb: "Walls that watched centuries.", minutes: 6, tag: "Architecture",
        body: "Mehrangarh rises a hundred and twenty metres from the desert floor. Chittor fell three times, and three times the women walked into fire rather than be captured. These are not buildings; they are vows." },
      { id: "stepwells", title: "Stepwells", blurb: "Architecture you descend into, not up.", minutes: 5, tag: "Architecture",
        body: "Rani-ki-Vav in Gujarat is seven storeys deep, lined with eight hundred sculptures. Built by a queen for her husband, it is a temple, a reservoir, and an upside-down monument all at once." },
      { id: "palaces", title: "Palaces", blurb: "Where mirror, marble, and intrigue all reflected each other.", minutes: 6, tag: "Architecture",
        body: "The Hawa Mahal is a screen, not a palace — five storeys of latticed windows so the women of the court could watch the city without being watched in return." },
      { id: "monasteries", title: "Monasteries", blurb: "Cells of silence above the snow line.", minutes: 7, tag: "Architecture",
        body: "Thiksey, Hemis, Tabo — the gompas of the Himalayas are libraries, schools, and meditation halls clinging to cliffs at four thousand metres. Their butter lamps have not gone out in centuries." },
    ],
  },
  {
    id: "art",
    name: "Art & Craft",
    whisper: "Hands that refused to forget.",
    stories: [
      { id: "textiles", title: "Textiles", blurb: "Patola, Jamdani, Kalamkari — fabrics written by hand.", minutes: 7, tag: "Craft", curator: true,
        body: "A double-ikat Patola sari takes six months to weave; the threads are dyed before the loom even begins, so the pattern emerges only as the cloth itself takes shape." },
      { id: "pottery", title: "Pottery", blurb: "Earth, wheel, fire, hand. Nothing else.", minutes: 5, tag: "Craft",
        body: "From the black terracotta of Manipur to the blue pottery of Jaipur — borrowed from Persia, perfected in India — every region speaks in clay." },
      { id: "miniature", title: "Miniature Paintings", blurb: "Stories painted on the back of a hand.", minutes: 6, tag: "Art",
        body: "Mughal, Pahari, Rajput, Deccani — schools that painted gods, lovers, and rulers on palm-sized paper, sometimes with a single squirrel-hair brush." },
      { id: "sculpture", title: "Sculpture", blurb: "From Mathura serenity to Hoysala excess.", minutes: 6, tag: "Art",
        body: "The smile of a Mathura Buddha; the impossible jewellery of a Hoysala goddess at Belur, carved with such depth that a thread can pass through her bangles." },
      { id: "metalwork", title: "Metalwork", blurb: "Bidri, dhokra, repoussé — alloys with memory.", minutes: 5, tag: "Craft",
        body: "Dhokra brass is poured in lost-wax moulds the same way it was four thousand years ago in the Indus Valley. The technology has not needed an upgrade." },
    ],
  },
  {
    id: "music",
    name: "Music & Performance",
    whisper: "Time, measured in raga and breath.",
    stories: [
      { id: "classical", title: "Classical Traditions", blurb: "Hindustani and Carnatic — two rivers from one sky.", minutes: 8, tag: "Music", curator: true,
        body: "A raga is not a scale; it is a personality, a time of day, a season, an emotional weather system. There are hundreds, and a lifetime is not enough to learn one fully." },
      { id: "folk", title: "Folk Music", blurb: "Songs sung while planting, walking, mourning, marrying.", minutes: 5, tag: "Music",
        body: "Baul of Bengal, Lavani of Maharashtra, Sufi qawwali, the wedding songs of Punjab — folk music is the diary of a region kept in melody." },
      { id: "dance", title: "Dance Forms", blurb: "Bharatanatyam, Kathak, Odissi, Manipuri.", minutes: 7, tag: "Performance",
        body: "Every gesture has a name. The hand-shapes — mudras — number more than a hundred, and the eyes have their own grammar of nine emotions." },
      { id: "theatre", title: "Theatre", blurb: "Kathakali masks, Yakshagana torches, Koodiyattam nights.", minutes: 6, tag: "Performance",
        body: "Koodiyattam, the oldest continuously performed theatre in the world, can stretch a single Sanskrit verse across an entire night." },
      { id: "ritual", title: "Ritual Performances", blurb: "Theyyam, where the dancer becomes the god.", minutes: 6, tag: "Performance",
        body: "In northern Kerala, a Theyyam performer paints his face, dons towering headgear, and for a few hours is no longer himself. The village comes to him for blessings, not applause." },
    ],
  },
];

/* ---------------- page ---------------- */

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Story | null>(null);

  const allStories = useMemo(
    () => SHELVES.flatMap((s) => s.stories.map((st) => ({ ...st, shelf: s.name }))),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allStories
      .filter((s) =>
        [s.title, s.blurb, s.tag, s.shelf].some((f) => f.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query, allStories]);

  const curated = useMemo(() => allStories.filter((s) => s.curator), [allStories]);

  // close on esc
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="pt-24 sm:pt-28">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16 sm:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground"
        >
          <BookOpen className="h-3.5 w-3.5" />
          The Library
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl"
        >
          The Library of <span className="text-gradient-ember italic">VIRSA</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          Every story opens another door through time.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-10 max-w-xl"
        >
          <div className="glass flex items-center gap-3 rounded-full px-5 py-3.5 shadow-[var(--shadow-soft)]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the archive — civilizations, ragas, stepwells…"
              aria-label="Search the library"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="glass absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]"
              >
                <ul className="divide-y divide-[var(--glass-border)]">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => {
                          setActive(r);
                          setQuery("");
                        }}
                        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-foreground/5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.shelf} · {r.minutes} min</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Curator's Picks */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" /> Curator’s Selections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">Handpicked by VIRSA</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {curated.slice(0, 6).map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setActive(s)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br from-[color-mix(in_oklab,var(--card)_90%,var(--accent)_10%)] to-[var(--card)] p-7 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)] opacity-10 blur-3xl transition-opacity group-hover:opacity-20" />
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{s.tag}</p>
              <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{s.blurb}</p>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.minutes} min</span>
                <span className="inline-flex items-center gap-1 text-foreground/80 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Shelves */}
      <section className="mx-auto max-w-6xl space-y-20 px-6 pb-32">
        {SHELVES.map((shelf, i) => (
          <Shelf key={shelf.id} shelf={shelf} index={i} onOpen={setActive} />
        ))}
      </section>

      {/* Story modal */}
      <StoryModal story={active} onClose={() => setActive(null)} />
    </div>
  );
}

/* ---------------- shelf ---------------- */

function Shelf({
  shelf,
  index,
  onOpen,
}: {
  shelf: Shelf;
  index: number;
  onOpen: (s: Story) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = shelf.stories.slice(0, 4);
  const rest = shelf.stories.slice(4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Shelf · 0{index + 1}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{shelf.name}</h2>
          <p className="mt-2 max-w-xl text-sm italic text-muted-foreground">{shelf.whisper}</p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="btn-glossy hidden shrink-0 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-foreground sm:inline-flex"
        >
          {expanded ? "Collapse" : "Explore Collection"}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>

      {/* The "shelf" — horizontal scroll on mobile, grid on desktop */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent" />
        <div className="absolute -bottom-2 left-6 right-6 h-4 rounded-[100%] bg-[var(--accent)] opacity-[0.06] blur-2xl" />

        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {preview.map((s, idx) => (
            <StoryCard key={s.id} story={s} index={idx} onOpen={onOpen} />
          ))}
        </div>

        <AnimatePresence initial={false}>
          {expanded && rest.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((s, idx) => (
                  <StoryCard key={s.id} story={s} index={idx} onOpen={onOpen} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="btn-glossy mt-4 inline-flex w-full justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-3 text-xs uppercase tracking-[0.22em] text-foreground sm:hidden"
        >
          {expanded ? "Collapse" : "Explore Collection"}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- story card ---------------- */

function StoryCard({
  story,
  index,
  onOpen,
}: {
  story: Story;
  index: number;
  onOpen: (s: Story) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(story)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] p-5 text-left shadow-[var(--shadow-soft)] transition-all hover:border-[color:var(--accent)]/30 hover:shadow-[var(--shadow-glow)] sm:w-auto"
    >
      {/* Spine */}
      <div className="absolute inset-y-4 left-0 w-[3px] rounded-r bg-gradient-to-b from-[color:var(--accent)]/0 via-[color:var(--accent)]/60 to-[color:var(--accent)]/0 opacity-50 transition-opacity group-hover:opacity-100" />

      <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{story.tag}</p>
      <h3 className="font-display text-xl leading-tight">{story.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{story.blurb}</p>

      <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {story.minutes} min read</span>
        <span className="inline-flex items-center gap-1 text-foreground/70 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- modal ---------------- */

function StoryModal({ story, onClose }: { story: Story | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-stretch justify-end bg-background/60 backdrop-blur-md sm:items-center sm:justify-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={story.title}
        >
          <motion.article
            initial={{ x: "100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative h-full w-full max-w-2xl overflow-y-auto rounded-none border border-[var(--glass-border)] bg-[var(--card)] shadow-[var(--shadow-soft)] sm:h-auto sm:max-h-[88vh] sm:rounded-3xl"
          >
            {/* Header art */}
            <div className="relative h-56 overflow-hidden sm:h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/30 via-[color:var(--primary)]/20 to-transparent" />
              <div className="absolute inset-0 [background-image:radial-gradient(ellipse_at_top_right,oklch(0.74_0.13_75_/_0.35),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.58_0.10_165_/_0.18),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--card)] to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="glass absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{story.tag}</p>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{story.title}</h2>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <p className="text-pretty text-base italic text-muted-foreground">{story.blurb}</p>
              <div className="my-6 h-px w-12 bg-[color:var(--accent)]/50" />
              <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
                {story.body ?? story.blurb}
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-[var(--glass-border)] pt-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {story.minutes} min read</span>
                <button
                  onClick={onClose}
                  className="btn-glossy rounded-full bg-[var(--accent)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent-foreground)]"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
