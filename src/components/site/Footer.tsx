import { Compass } from "lucide-react";

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
              <span className="font-display text-2xl">KAAL</span>
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
              <li><a href="#explore" className="hover:text-foreground text-foreground/75">Heritage Map</a></li>
              <li><a href="#timeline" className="hover:text-foreground text-foreground/75">Timeline</a></li>
              <li><a href="#shruti" className="hover:text-foreground text-foreground/75">SHRUTI Languages</a></li>
              <li><a href="#trails" className="hover:text-foreground text-foreground/75">Heritage Trails</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Participate</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#contribute" className="hover:text-foreground text-foreground/75">Contribute a Memory</a></li>
              <li><a href="#assistant" className="hover:text-foreground text-foreground/75">Ask the Assistant</a></li>
              <li><a href="#library" className="hover:text-foreground text-foreground/75">Living Library</a></li>
              <li><a href="#" className="hover:text-foreground text-foreground/75">For Educators</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} KAAL · Knowledge Archive of Ancestral Legacy</span>
          <span>Made with care, across 28 states.</span>
        </div>
      </div>
    </footer>
  );
}
