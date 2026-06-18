import { useEffect, useState } from "react";
import { Coins, Menu, Moon, Sun, X } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { UserMenu } from "@/components/site/UserMenu";
import { getMyState } from "@/lib/virsa.functions";

const links = [
  { to: "/trails", label: "Trails" },
  { to: "/atlas", label: "Heritage Atlas" },
  { to: "/library", label: "Library" },
  { to: "/kitab", label: "Kitab" },
  { to: "/khazane", label: "Khazane" },
  { to: "/echoes", label: "Echoes" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  const fetchState = useServerFn(getMyState);
  const { data: state } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
    enabled: !!user,
    staleTime: 30_000,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <Link
          to="/"
          aria-label="VIRSA home"
          className="flex items-center group shrink-0 transition-transform duration-500 hover:scale-[1.03]"
        >
          <BrandLogo className="h-8 w-auto" />
        </Link>

        <nav
          className={`hidden lg:flex items-center gap-0.5 rounded-full border border-[var(--glass-border)] px-1.5 py-1 transition-all duration-500 ${
            scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" : "bg-foreground/[0.03] backdrop-blur-md"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-foreground/10 text-foreground" }}
              className="btn-glossy whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/75 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="btn-glossy relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[var(--glass-border)] bg-gradient-to-br from-foreground/12 to-foreground/[0.04] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_14px_-4px_rgba(0,0,0,0.3)] hover:border-foreground/25"
          >
            <Sun className={`absolute h-4 w-4 transition-all duration-500 ${isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
            <Moon className={`absolute h-4 w-4 transition-all duration-500 ${isLight ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          </button>

          {loading ? (
            <div className="h-9 w-20 rounded-full bg-foreground/5 animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="btn-glossy hidden sm:inline-flex items-center rounded-full gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)]"
            >
              Sign in
            </Link>
          )}

          <button
            className="btn-glossy lg:hidden grid h-9 w-9 place-items-center rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mx-5 mt-3 rounded-2xl glass p-3 animate-fade-in">
          {user && state && (
            <Link
              to="/khazane"
              onClick={() => setOpen(false)}
              className="mb-2 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5 text-sm ring-1 ring-primary/25"
            >
              <span className="inline-flex items-center gap-2 text-primary"><Coins className="h-4 w-4" /> Your coins</span>
              <span className="font-semibold text-primary">{state.balance}</span>
            </Link>
          )}
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm hover:bg-foreground/5"
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-primary/15 text-primary px-4 py-2.5 text-sm font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
