"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import {
  Award,
  Bell,
  CalendarDays,
  Gamepad2,
  History,
  Home,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { getResolvedAvatar } from "@/lib/avatar";
import { getDisplayName } from "@/lib/getDisplayName";
import { getPlayerData, savePlayerData, type PlayerData } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";

type DrawerItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const drawerItems: DrawerItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/play", label: "Play", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile#achievements", label: "Achievements", icon: Award },
  { href: "/quiz?daily=true", label: "Daily Challenge", icon: CalendarDays },
  { href: "/profile#history", label: "History", icon: History },
];

function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const clientTimer = window.setTimeout(() => {
      setPlayer(getPlayerData());
    }, 0);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      window.clearTimeout(clientTimer);
      listener.subscription.unsubscribe();
    };
  }, []);

  const displayName = useMemo(() => getDisplayName(user, player), [player, user]);
  const avatarUrl = useMemo(() => getResolvedAvatar(player, user), [player, user]);
  const notificationsEnabled = player?.notificationsEnabled ?? true;

  function toggleNotifications() {
    const currentPlayer = player ?? getPlayerData();
    const updatedPlayer = {
      ...currentPlayer,
      notificationsEnabled: !currentPlayer.notificationsEnabled,
    };

    setPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="rounded-[28px] border border-slate-200/70 bg-white/80 px-3 py-3 text-slate-900 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-black/20 sm:rounded-[32px] sm:px-4"
      >
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:bg-slate-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <Menu size={22} strokeWidth={3} aria-hidden="true" />
            </button>

            <Link
              href="/"
              aria-label="Family Quiz Battle home"
              className="flex min-w-0 items-center gap-2 rounded-2xl py-1 pr-1 transition hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:gap-3"
            >
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-11 shrink-0 object-contain drop-shadow-lg"
                priority
              />
              <h1 className="truncate text-base font-black leading-tight sm:text-xl">
                Family Quiz Battle
              </h1>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label={
                notificationsEnabled
                  ? "Notifications enabled"
                  : "Notifications disabled"
              }
              title={
                notificationsEnabled
                  ? "Notifications enabled"
                  : "Notifications disabled"
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 shadow-lg backdrop-blur transition hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                notificationsEnabled
                  ? "border-fuchsia-300 bg-fuchsia-400 text-slate-950 shadow-fuchsia-500/25"
                  : "border-slate-200 bg-slate-100 text-slate-700 shadow-slate-900/10 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              }`}
            >
              <Bell size={20} strokeWidth={3} aria-hidden="true" />
            </button>

            <Link
              href="/settings"
              aria-label="Open settings"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:bg-slate-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <Settings size={20} strokeWidth={3} aria-hidden="true" />
            </Link>

            <Link
              href={user ? "/profile" : "/login"}
              aria-label={user ? "Open profile" : "Login"}
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:bg-slate-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={20} strokeWidth={3} aria-hidden="true" />
              )}
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[1000] bg-slate-950/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className="fixed left-0 top-0 z-[1001] flex h-dvh w-[min(84vw,340px)] flex-col border-r border-white/10 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Family Quiz Battle"
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 object-contain drop-shadow-lg"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black">
                      Family Quiz Battle
                    </h2>
                    <p className="truncate text-xs font-bold text-white/60">
                      {displayName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-lg transition hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <X size={21} strokeWidth={3} aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-6 grid gap-2" aria-label="Menu navigation">
                {drawerItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 font-black transition hover:bg-white/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    >
                      <Icon size={19} strokeWidth={3} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6">
                {user ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-red-300/20 bg-red-500/20 px-4 font-black text-red-100 transition hover:bg-red-500/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    <LogOut size={19} strokeWidth={3} aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 font-black transition hover:bg-white/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    <LogIn size={19} strokeWidth={3} aria-hidden="true" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(AppHeader);
