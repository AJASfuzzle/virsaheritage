import { motion } from "framer-motion";
import { MapPin, Quote, User } from "lucide-react";
import { useState } from "react";
import story from "@/assets/tradition-story.jpg";
import festival from "@/assets/tradition-festival.jpg";
import craft from "@/assets/tradition-craft.jpg";
import food from "@/assets/tradition-food.jpg";
import dance from "@/assets/tradition-dance.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Item = {
  img: string;
  title: string;
  tag: string;
  region: string;
  year: string;
  contributor: string;
  age: number;
  story: string;
};

const items: Item[] = [
  {
    img: story,
    title: "Oral Histories of the Konkan Coast",
    tag: "Stories",
    region: "Maharashtra · Goa",
    year: "1947",
    contributor: "Shantabai Govekar",
    age: 84,
    story:
      "When I was a girl in Malvan, my grandfather would sit on the verandah after the monsoon clouds had passed and tell us of the Sindhudurg fort built by Shivaji Maharaj on the black rocks of the sea. He said the masons mixed lime with jaggery and seashells, and the waves themselves swore loyalty to the king. On nights when the tide was high, we believed we could hear the conches of his sailors. My mother sang us a lavani about a fisherman who fell in love with a sea-spirit; she refused to come ashore, and he refused to leave the boat, so the gods turned them into the twin rocks you still see off the Tarkarli shore. We learned the sea before we learned the alphabet — and the sea, my grandfather said, remembers every name that ever sailed on it.",
  },
  {
    img: festival,
    title: "Diyas of Kartik Purnima",
    tag: "Festivals",
    region: "Varanasi, UP",
    year: "Living",
    contributor: "Pandit Hari Prasad Mishra",
    age: 71,
    story:
      "On Kartik Purnima, the Ganga becomes a mirror for the heavens. My father, who served at Dashashwamedh Ghat for fifty-three years, taught me that each diya we float carries a wish from one ancestor to another — the living lighting a path for the dead, and the dead, in turn, lighting a path back to the living. We make the wicks from cotton spun by widows of the city, soaked in mustard oil pressed in the lanes behind Vishwanath. When the entire river catches fire with a hundred thousand small flames, you understand why our scriptures call Kashi the city that even Yama cannot enter. I have lit a diya every Kartik Purnima since I was four. My grandson lit his first this year. The river accepted them both.",
  },
  {
    img: craft,
    title: "Banarasi Silk Looms",
    tag: "Crafts",
    region: "Varanasi, UP",
    year: "14th c.",
    contributor: "Mohammad Rafiq Ansari",
    age: 67,
    story:
      "Our family has been weavers in Madanpura for seven generations. My great-grandfather wove a saree for the wedding of the Nawab of Rampur with real gold zari so fine that the pallu weighed less than a sparrow. I learned the kadhwa technique from my father when I was nine — you do not weave a Banarasi, you converse with it. Each butta, each kalga, each meenakari flower is a word in a sentence the loom and the weaver write together. A six-yard saree can take three months and the prayers of two men. People ask why we still sit at the pit-loom when power looms can finish in a day. I tell them: a machine can copy the pattern, but it cannot copy the breath. And it is the breath, woven thread by thread, that a bride feels on her shoulders when she walks around the fire.",
  },
  {
    img: food,
    title: "Sadhya of the Backwaters",
    tag: "Food",
    region: "Kerala",
    year: "Living",
    contributor: "Lakshmi Amma",
    age: 78,
    story:
      "In our tharavad in Alappuzha, the Onam sadhya was never just a meal — it was a calendar of the year laid out on a banana leaf. The leaf must be placed with the tip to the left; the parippu and ghee go first, because the ancestors taught us that lentils were the first cooked food humans ever made. Then olan, kaalan, avial, thoran — each curry in its place, each with its own season, its own soil, its own memory. The payasam at the end is poured slowly so that the elders can bless it before the children dip their fingers. My mother could make twenty-six dishes on a wood stove with one helper. I cook only sixteen now, and my daughters tease me, but each one I cook with the same prayer my mother whispered: that the harvest was kind, the rains were honest, and the table is full enough to invite a stranger.",
  },
  {
    img: dance,
    title: "Kathakali — The Eyes that Speak",
    tag: "Dance",
    region: "Kerala",
    year: "17th c.",
    contributor: "Guru Krishnan Nair Ashan",
    age: 82,
    story:
      "I was taken to the kalari at the age of seven. For the first two years, my teacher did not let me touch a single mudra — only the eye exercises, the navarasam, the nine emotions. We rolled mustard seeds across the floor with our pupils until our eyes wept. He said: 'The face is the stage. The body only carries it.' To play Nala or Bhima or the demoness Poothana, I had to learn to become small enough to fit inside a single glance. The chutti makeup takes four hours; the costume weighs almost as much as a child. By the time the chenda begins to thunder and the lamp is lit, the man who entered the green room is gone. What walks onto the stage is the story itself. I have danced for sixty-one years. When I can no longer dance, I will teach. When I can no longer teach, I will watch. And when I can no longer watch, the lamp will still be lit by someone else's son.",
  },
];

export function Traditions() {
  const [active, setActive] = useState<Item | null>(null);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Featured Traditions</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl text-balance">
              Stories the country <span className="italic text-gradient-ember">still remembers</span>
            </h2>
          </div>
          <a href="/library" className="text-sm text-foreground/70 hover:text-foreground underline-offset-4 hover:underline">
            Enter the Living Library →
          </a>
        </div>

        <div className="-mx-5 overflow-x-auto pb-4 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-5 snap-x snap-mandatory">
            {items.map((it, i) => (
              <motion.button
                type="button"
                onClick={() => setActive(it)}
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative aspect-[3/4] w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 shadow-[var(--shadow-soft)] text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Read story: ${it.title}`}
              >
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,oklch(0.1_0.03_50/0.92)_100%)]" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                  {it.tag}
                </div>
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-display text-2xl leading-tight text-parchment text-balance">
                    {it.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs text-foreground/70">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{it.region}</span>
                    <span className="h-1 w-1 rounded-full bg-foreground/40" />
                    <span>{it.year}</span>
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-primary/90 opacity-0 group-hover:opacity-100 transition">
                    Read the memory →
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl glass border-white/10 max-h-[85vh] overflow-y-auto">
          {active && (
            <>
              <div className="relative -mx-6 -mt-6 h-48 overflow-hidden rounded-t-lg">
                <img src={active.img} alt={active.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,oklch(0.1_0.03_50/0.95)_100%)]" />
                <div className="absolute left-5 top-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                  {active.tag}
                </div>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="font-display text-3xl text-balance">{active.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{active.region}</span>
                  <span className="h-1 w-1 rounded-full bg-foreground/40" />
                  <span>{active.year}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-background/40 p-3 ring-1 ring-white/5">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-ember text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base leading-tight">{active.contributor}</div>
                  <div className="text-xs text-muted-foreground">Contributor · age {active.age} · {active.region}</div>
                </div>
              </div>

              <div className="relative mt-3 rounded-2xl bg-background/30 p-5 ring-1 ring-white/5">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/70" />
                <p className="text-foreground/85 text-[15px] leading-relaxed text-pretty whitespace-pre-line">
                  {active.story}
                </p>
              </div>

              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Submitted to KAAL · transcribed & translated by AI
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
