import { useEffect, useState } from "react";
import { Compass, Menu, Moon, Sun, X } from "lucide-react";

const links = [
  { href: "#explore", label: "Explore Map" },
  { href: "#timeline", label: "Timeline" },
  { href: "#shruti", label: "SHRUTI" },
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
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-ember text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.72_0.18_55/0.6)]">
            <Compass className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl tracking-tight">
            KAAL<span className="text-muted-foreground font-sans text-[10px] uppercase tracking-[0.28em] ml-2 align-middle">Heritage Atlas</span>
          </span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-foreground/75 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLight((v) => !v)}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/10 transition"
          >
            {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <a
            href="#contribute"
            className="hidden sm:inline-flex items-center rounded-full gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)] hover:brightness-110 transition"
          >
            Contribute
          </a>
          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-full glass"
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
