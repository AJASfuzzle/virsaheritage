import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero-heritage.jpg";

export function Hero() {
  return (
    <section id="top" className="dark relative min-h-[100svh] w-full overflow-hidden grain bg-background text-foreground">
      <div className="absolute inset-0">
        <img
          src={hero}
          alt="Aerial dusk view of an Indian temple landscape with diyas and a river"
          className="h-full w-full object-cover animate-ken-burns"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.04_50/0.55)_0%,oklch(0.14_0.04_50/0.35)_40%,oklch(0.14_0.04_50/0.92)_100%)]" />
        <div className="absolute inset-0 [background:var(--gradient-aurora)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-40 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex w-fit items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs uppercase tracking-[0.22em] text-foreground/85"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          The Soul of India, Preserved Forever
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-6 max-w-5xl font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl lg:text-[5.5rem]"
        >
          Every memory
          <br className="hidden sm:block" />
          <span className="italic text-gradient-ember">leaves a map.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-7 max-w-2xl text-lg text-foreground/80 text-pretty sm:text-xl"
        >
          VIRSA is India's living archive — preserving the languages, stories,
          recipes, songs and traditions that exist only in the memory of those
          who carry them. Explore a country, one whisper at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="/atlas"
            className="btn-glossy group inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.72_0.18_55/0.7)]"
          >
            <MapPin className="h-4 w-4" />
            Explore Heritage Map
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/echoes"
            className="btn-glossy inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium"
          >
            Open Echoes
          </a>
        </motion.div>

        <div className="mt-16 hidden sm:flex items-center gap-6 text-xs uppercase tracking-[0.28em] text-foreground/55">
          <span className="h-px w-12 bg-foreground/30" />
          Scroll to journey through India
        </div>
      </div>
    </section>
  );
}
