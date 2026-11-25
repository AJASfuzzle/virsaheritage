import { createFileRoute } from "@tanstack/react-router";
import shriya from "@/assets/team/shriya-sawhney.jpeg.asset.json";
import ahaan from "@/assets/team/ahaan-chopra.jpeg.asset.json";
import aarav from "@/assets/team/aarav-anand.jpeg.asset.json";
import jai from "@/assets/team/jai-goel.jpeg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us · VIRSA" },
      { name: "description", content: "Meet the four Delhi teens behind VIRSA, a home for India's heritage, languages and stories." },
      { property: "og:title", content: "About Us · VIRSA" },
      { property: "og:description", content: "Meet the team behind VIRSA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  { name: "Shriya Sawhney", photo: shriya.url },
  { name: "Ahaan Chopra", photo: ahaan.url },
  { name: "Aarav Anand", photo: aarav.url },
  { name: "Jai Goel", photo: jai.url },
];

function AboutPage() {
  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      </div>
      <header className="mx-auto max-w-3xl px-5 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-primary/90">About us</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl text-balance">The people behind VIRSA</h1>
        <p className="mt-5 text-muted-foreground text-lg">
          We are four 17-year-olds from Delhi who want to keep India's heritage, languages and stories alive for the next generation.
        </p>
      </header>
      <section className="mx-auto mt-16 grid max-w-6xl gap-8 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m) => (
          <article key={m.name} className="rounded-2xl border border-border bg-card/60 p-4 text-center">
            <img src={m.photo} alt={m.name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <h2 className="mt-4 font-display text-2xl">{m.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">17 · Delhi, India</p>
          </article>
        ))}
      </section>
    </div>
  );
}
