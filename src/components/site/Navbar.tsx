import { useEffect, useState } from "react";
import { Compass, Menu, Moon, Sun, X } from "lucide-react";

const links = [
  { href: "#explore", label: "Explore" },
  { href: "#timeline", label: "Timeline" },
  { href: "#shruti", label: "SHRUTI" },
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
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 rounded-full transition-all duration-500 ${
          scrolled ? "glass-glossy py-2" : "py-2"
        }`}
        style={scrolled ? { marginLeft: "1rem", marginRight: "1rem" } : undefined}
      >
        {/* Brand — single line */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-ember text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.72_0.18_55/0.7)] transition-transform duration-500 group-hover:rotate-[15deg]">
            <Compass className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span className="flex items-baseline gap-2 whitespace-nowrap leading-none">
            <span className="font-display text-xl tracking-tight">KAAL</span>
            <span className="hidden sm:inline text-muted-foreground font-sans text-[10px] uppercase tracking-[0.28em]">
              Heritage Atlas
            </span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-foreground/75 hover:text-foreground hover:bg-white/10 transition-all duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLight((v) => !v)}
            aria-label="Toggle theme"
            className="relative grid h-9 w-16 place-items-center rounded-full glass-glossy hover:brightness-110 transition-all duration-500 overflow-hidden"
          >
            <span
              className={`absolute top-1 h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_4px_12px_-2px_oklch(0.72_0.18_55/0.6)] transition-all duration-500 ${
                light ? "left-8" : "left-1"
              }`}
            />
            <span className="relative z-10 flex w-full justify-between px-2 text-foreground/80">
              <Sun className={`h-3.5 w-3.5 transition ${light ? "opacity-40" : "opacity-100 text-primary-foreground"}`} />
              <Moon className={`h-3.5 w-3.5 transition ${light ? "opacity-100 text-primary-foreground" : "opacity-40"}`} />
            </span>
          </button>

          <a
            href="#contribute"
            className="btn-glossy hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Contribute
          </a>

          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-full glass-glossy"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-5 mt-3 rounded-2xl glass-glossy p-3 animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm hover:bg-white/10 transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
