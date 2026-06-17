import { Compass } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-ember text-primary-foreground">
                <Compass className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-2xl">VIRSA</span>
            </div>
            <p className="mt-5 text-muted-foreground text-pretty">
              Knowledge Archive of Ancestral Legacy — a non-profit, AI-powered
              atlas preserving the languages, stories and traditions of the
              Indian subcontinent for the generations to come.
            </p>
            <p className="mt-6 font-display italic text-lg text-gradient-ember">
              "The soul of India, preserved forever."
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/atlas" className="hover:text-foreground text-foreground/75">Heritage Atlas</Link></li>
              <li><Link to="/library" className="hover:text-foreground text-foreground/75">Living Library</Link></li>
              <li><Link to="/kitab" className="hover:text-foreground text-foreground/75">kitab · Languages</Link></li>
              <li><Link to="/trails" className="hover:text-foreground text-foreground/75">Heritage Trails</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Participate</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/contribute" className="hover:text-foreground text-foreground/75">Contribute a Memory</Link></li>
              <li><Link to="/assistant" className="hover:text-foreground text-foreground/75">Ask the Assistant</Link></li>
              <li><Link to="/library" className="hover:text-foreground text-foreground/75">Living Library</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} VIRSA · Knowledge Archive of Ancestral Legacy</span>
          <span>Made with care, across 28 states.</span>
        </div>
      </div>
    </footer>
  );
}
