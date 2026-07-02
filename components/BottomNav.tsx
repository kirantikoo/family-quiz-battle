"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Home,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/play", label: "Play", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.6rem)] left-1/2 z-[999] w-[calc(100%-1rem)] max-w-[390px] -translate-x-1/2 px-0.5 sm:bottom-[calc(env(safe-area-inset-bottom)+1rem)]"
    >
      <div className="grid grid-cols-4 items-center gap-1 rounded-[28px] border border-slate-200 bg-white/90 p-1.5 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-purple-950/40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-[22px] px-1 py-2 text-[10px] font-black leading-none transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:min-h-[62px] sm:text-xs ${
                isActive
                  ? "bg-violet-100 text-violet-700 shadow-lg shadow-violet-500/10 dark:bg-white/10 dark:text-white dark:shadow-cyan-500/25"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-2xl transition sm:h-8 sm:w-8 ${
                  isActive
                    ? "bg-white/70 dark:bg-white/20"
                    : "bg-slate-100 group-hover:bg-white dark:bg-white/10 dark:group-hover:bg-white/15"
                }`}
              >
                <Icon size={17} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
