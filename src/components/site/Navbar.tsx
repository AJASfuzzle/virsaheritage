import { useEffect, useState } from "react";
import { Compass, Menu, Moon, Sun, X } from "lucide-react";

const links = [
  { href: "#explore", label: "Explore Map" },
  { href: "#timeline", label: "Timeline" },
  { href: "#shruti", label: "the kitab" },
  { href: "#library", label: "Library" },
  { href: "#trails", label: "Trails" },
  { href: "#contribute", label: "Contribute" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <a
          href="#explore"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("explore")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          aria-label="Open the heritage map"
          title="Open the heritage map"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-ember text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.72_0.18_55/0.6)] transition-transform duration-500 group-hover:scale-105">
            <Compass className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="flex items-baseline gap-2 whitespace-nowrap leading-none">
            <span className="font-display text-xl tracking-tight">KAAL</span>
            <span className="text-muted-foreground font-sans text-[10px] uppercase tracking-[0.28em]">
              Heritage Atlas
            </span>
          </span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-0.5 rounded-full border border-white/5 px-1.5 py-1 transition-all duration-500 ${
            scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" : "bg-white/[0.03] backdrop-blur-md"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="btn-glossy whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/75 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLight((v) => !v)}
            aria-label="Toggle theme"
            className="btn-glossy relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_-4px_rgba(0,0,0,0.4)] hover:border-white/25"
          >
            <Sun className={`absolute h-4 w-4 transition-all duration-500 ${light ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            <Moon className={`absolute h-4 w-4 transition-all duration-500 ${light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
          </button>
          <a
            href="#contribute"
            className="btn-glossy hidden sm:inline-flex items-center rounded-full gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)]"
          >
            Contribute
          </a>
          <button
            className="btn-glossy md:hidden grid h-9 w-9 place-items-center rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-5 mt-3 rounded-2xl glass p-3 animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
