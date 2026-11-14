import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { SUPPORTED_LANGS, useLanguage, type LangCode } from "@/i18n/LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = SUPPORTED_LANGS.find((l) => l.code === lang) ?? SUPPORTED_LANGS[0];

  const choose = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative" data-i18n-skip>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="btn-glossy inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-gradient-to-br from-foreground/12 to-foreground/[0.04] px-2.5 py-1.5 text-[12px] font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_14px_-4px_rgba(0,0,0,0.3)] hover:border-foreground/25"
      >
        <Globe className="h-3.5 w-3.5" />
        {compact ? (
          <span className="uppercase">{current.code.split("-")[0]}</span>
        ) : (
          <span className="hidden sm:inline">{current.native}</span>
        )}
        {!compact && <span className="sm:hidden uppercase">{current.code.split("-")[0]}</span>}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl glass shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-[var(--glass-border)]"
        >
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {SUPPORTED_LANGS.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(l.code)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5 ${active ? "text-primary" : "text-foreground/85"}`}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{l.native}</span>
                    <span className="text-[11px] text-foreground/55">{l.label}</span>
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
