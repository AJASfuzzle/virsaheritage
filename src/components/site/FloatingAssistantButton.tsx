import { Bot } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FloatingAssistantButton() {
  return (
    <Link
      to="/assistant"
      aria-label="Open AI Heritage Assistant"
      className="fixed left-5 bottom-5 z-50 group flex items-center gap-2"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full gradient-ember text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)] ring-1 ring-white/20 transition-all duration-500 hover:scale-110 hover:shadow-[0_14px_40px_-8px_oklch(0.72_0.18_55/0.55)] active:scale-95">
        <Bot className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="hidden sm:block rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/90 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
        Ask VIRSA
      </span>
    </Link>
  );
}
