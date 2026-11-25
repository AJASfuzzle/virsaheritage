import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Users, Languages, Headphones, MapPin, Map, BookOpen, ScrollText, Route as RouteIcon, MessageCircle, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import shriya from "@/assets/team/shriya-sawhney.jpeg.asset.json";
import ahaan from "@/assets/team/ahaan-chopra.jpeg.asset.json";
import aarav from "@/assets/team/aarav-anand.jpeg.asset.json";
import jai from "@/assets/team/jai-goel.jpeg.asset.json";

// TODO: replace with the team's contact email address.
const CONTACT_EMAIL = "TODO-add-team-email@example.com";

// Fill in each role later; an empty role is not shown.
const TEAM = [
  { name: "Aarav Anand", photo: aarav.url, role: "" },
  { name: "Ahaan Chopra", photo: ahaan.url, role: "" },
  { name: "Jai Goel", photo: jai.url, role: "" },
  { name: "Shriya Sawhney", photo: shriya.url, role: "" },
];

const BELIEFS = [
  { icon: Users, title: "Community-powered", text: "Elders, students and local contributors build the archive." },
  { icon: Languages, title: "Multilingual", text: "Designed for India's linguistic diversity." },
  { icon: Headphones, title: "Audio-led access", text: "Another way to experience heritage, beyond reading." },
  { icon: MapPin, title: "Place-connected", text: "Maps, trails and on-site discovery." },
];

const WAYS = [
  { to: "/atlas", icon: Map, title: "Heritage Atlas", text: "Explore heritage locations through an interactive map." },
  { to: "/library", icon: BookOpen, title: "Living Library", text: "Discover community-contributed stories, recipes, songs and traditions." },
  { to: "/kitab", icon: ScrollText, title: "Kitab", text: "Explore and document India's languages." },
  { to: "/trails", icon: RouteIcon, title: "Heritage Trails", text: "Follow curated journeys through places, history and culture." },
  { to: "/echoes", icon: MessageCircle, title: "Echoes", text: "Preserve and share community voices, photographs and memories." },
  { to: "/assistant", icon: Sparkles, title: "VIRSA AI Assistant", text: "Find personalised stories, trails and answers." },
] as const;

const TITLE = "About VIRSA | India's Living Memory";
const DESC = "VIRSA is a non-profit, AI-powered cultural atlas of India's heritage, built by four students from Delhi.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://virsa.com.co/about" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://virsa.com.co/about" }],
  }),
  component: AboutPage,
});

function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <FadeUp className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl sm:text-4xl text-balance">{children}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </FadeUp>
  );
}

function AboutPage() {
  return (
    <div className="relative overflow-x-hidden pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] max-w-[200vw] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      </div>

      {/* 1. Hero */}
      <header className="mx-auto max-w-3xl px-5 text-center">
        <FadeUp>
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-primary">Made by four teenagers</p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-balance">India's memory deserves to be remembered.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            VIRSA is a non-profit, AI-powered cultural atlas to preserve, explore and hear India's heritage across geography and time. We are four students from Delhi, and we built it ourselves.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/atlas">Explore the Atlas</Link></Button>
            <Button asChild size="lg" variant="outline">
              <a href="#team" onClick={(e) => { e.preventDefault(); document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }); }}>Meet the team</a>
            </Button>
          </div>
        </FadeUp>
      </header>

      {/* 2. Our story */}
      <section className="mx-auto mt-24 max-w-2xl px-5" aria-labelledby="story">
        <FadeUp><h2 id="story" className="font-display text-3xl sm:text-4xl text-center">Why we built VIRSA</h2></FadeUp>
        <FadeUp className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>Languages, folk stories, recipes, songs and festivals often survive only through elders and local communities. When they are not documented, knowledge can disappear.</p>
          <p>Monuments are visited, but their histories are not always understood. Static, text-heavy guides do not serve every visitor.</p>
          <p>So four teenagers decided to build the kind of heritage platform we wished existed: one that lets anyone explore a place, hear a language, and add their own memory to a growing archive.</p>
        </FadeUp>
        <FadeUp className="mt-14 text-center">
          <blockquote className="font-display text-3xl italic sm:text-4xl text-balance">"When an elder dies, a library burns."</blockquote>
          <p className="mt-3 text-sm text-muted-foreground">African proverb</p>
          <div className="mx-auto mt-6 h-px w-16 bg-primary" />
          <p className="mt-4 text-sm tracking-wide text-primary">Every memory leaves a map.</p>
        </FadeUp>
      </section>

      {/* 3. Team */}
      <section id="team" className="mx-auto mt-24 max-w-6xl scroll-mt-28 px-5">
        <SectionHeading sub="Team AJAS, students at Delhi Public School, R.K. Puram, Delhi.">The four of us</SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <FadeUp key={m.name} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-card/60 p-5 text-center">
                <img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" className="mx-auto aspect-square w-full max-w-[240px] rounded-full object-cover ring-1 ring-primary/70 ring-offset-4 ring-offset-card" />
                <h3 className="mt-5 font-display text-xl font-bold">{m.name}</h3>
                {m.role && <p className="mt-1 text-sm">{m.role}</p>}
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Team AJAS · VIRSA</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 4. Recognition */}
      <section className="mx-auto mt-24 max-w-3xl px-5">
        <SectionHeading>Where we are</SectionHeading>
        <FadeUp className="mt-8 flex items-start gap-4 rounded-2xl border border-primary/30 bg-card/60 p-6 sm:p-8">
          <Award className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
          <p className="text-lg">Finalists, Bharat Innovation Challenge by LPU. Category: AI in Culture &amp; Heritage Preservation.</p>
        </FadeUp>
      </section>

      {/* 5. Beliefs */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <SectionHeading>Four ideas behind everything we build</SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BELIEFS.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.05} className="rounded-2xl border border-border bg-card/60 p-6">
              <b.icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-display text-xl">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 6. Ways in */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <SectionHeading>Six ways in</SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WAYS.map((w) => (
            <Link key={w.to} to={w.to} className="group flex gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <w.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block font-display text-lg group-hover:text-primary">{w.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{w.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CTA */}
      <section className="dark mt-24 bg-indigo-night px-5 py-20 text-center text-parchment">
        <FadeUp className="mx-auto max-w-2xl">
          <p className="font-display text-3xl italic sm:text-4xl text-balance">VIRSA — The soul of India, preserved forever.</p>
          <p className="mt-5 opacity-80">Have a story, a recipe, a song or a word that only your family remembers? Add it to the archive.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/echoes">Share a memory</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-parchment/40 bg-transparent text-parchment hover:bg-parchment/10 hover:text-parchment">
              <a href={`mailto:${CONTACT_EMAIL}`}>Contact the team</a>
            </Button>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
