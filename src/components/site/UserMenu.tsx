import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Coins, LogOut, Map, Settings as SettingsIcon, UserRound, Gift } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getMyState } from "@/lib/virsa.functions";

function initialsFrom(name?: string | null, email?: string | null) {
  const base = (name ?? email ?? "K").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fetchState = useServerFn(getMyState);
  const { data } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
    enabled: !!user,
    staleTime: 30_000,
  });

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!user) return null;

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? null;
  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;
  const initials = initialsFrom(fullName, user.email);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        {/* coin pill */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary whitespace-nowrap">
          <Coins className="h-3.5 w-3.5" />
          {data?.balance ?? 0}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Open user menu"
          className="btn-glossy relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-primary/30 to-accent/20 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_22px_-8px_oklch(0.74_0.13_75/0.5)] hover:border-primary/40 transition"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-display tracking-wider">{initials}</span>
          )}
        </button>
      </div>


      {open && (
        <div
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl glass p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 animate-fade-in z-50"
        >
          <div className="px-3 py-3 border-b border-white/5">
            <div className="text-sm font-medium truncate">{fullName ?? user.email}</div>
            <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
              <Coins className="h-3 w-3" /> {data?.balance ?? 0} Virsa Coins
            </div>
          </div>
          <div className="p-1">
            <MenuItem to="/dashboard" icon={UserRound} onClick={() => setOpen(false)}>Dashboard</MenuItem>
            <MenuItem to="/trails" icon={Map} onClick={() => setOpen(false)}>My trails</MenuItem>
            <MenuItem to="/khazane" icon={Gift} onClick={() => setOpen(false)}>Khazane</MenuItem>
            <MenuItem to="/settings" icon={SettingsIcon} onClick={() => setOpen(false)}>Settings</MenuItem>
          </div>
          <div className="border-t border-white/5 p-1">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-white/[0.06] hover:text-foreground transition"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  to,
  icon: Icon,
  children,
  onClick,
}: {
  to: "/dashboard" | "/trails" | "/khazane" | "/settings";
  icon: typeof UserRound;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/85 hover:bg-white/[0.06] hover:text-foreground transition"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{children}</span>
    </Link>
  );
}
