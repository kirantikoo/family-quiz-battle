"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Bell, Coins, LogIn, LogOut, UserRound, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getDisplayName } from "@/lib/getDisplayName";
import { getPlayerData, savePlayerData, type PlayerData } from "@/lib/storage";
import { getResolvedAvatar } from "@/lib/avatar";
import AvatarImage from "@/components/AvatarImage";

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const clientTimer = window.setTimeout(() => {
      setPlayer(getPlayerData());

      const hour = new Date().getHours();

      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
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

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  function toggleNotifications() {
    const currentPlayer = player ?? getPlayerData();
    const updatedPlayer = {
      ...currentPlayer,
      notificationsEnabled: !currentPlayer.notificationsEnabled,
    };

    setPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
  }

  const displayName = getDisplayName(user, player);
  const avatarUrl = getResolvedAvatar(player, user);
  const stats = player ?? {
    xp: 0,
    coins: 0,
    level: 1,
    notificationsEnabled: true,
  };

  return (
    <header className="rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            aria-label="Home"
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg sm:h-14 sm:w-14"
          >
            <Image
              src="/logo.png"
              alt="Family Quiz Battle"
              width={52}
              height={52}
              className="h-9 w-9 object-contain sm:h-12 sm:w-12"
              priority
            />
          </Link>

          <Link
            href="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-[22px] border border-white/10 bg-white/10 px-3 py-2 shadow-inner transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:rounded-[26px] sm:px-4 sm:py-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 shadow-inner sm:h-14 sm:w-14">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={52}
                  height={52}
                  className="h-9 w-9 object-contain sm:h-12 sm:w-12"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-200/80 sm:text-xs">
                {user ? "Google Player" : greeting}
              </p>

              <h1 className="truncate text-base font-black leading-tight sm:text-2xl">
                {displayName}
              </h1>

              <p className="mt-0.5 truncate text-xs font-bold text-white/55 sm:text-sm">
                Level {stats.level ?? 1} • {user ? "Synced" : "Guest"}
              </p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-2">
          <div className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl bg-cyan-300/15 px-2 text-xs font-black text-cyan-100 sm:min-h-12 sm:px-3 sm:text-sm">
            <Zap size={15} strokeWidth={3} aria-hidden="true" />
            <span className="truncate">{stats.xp.toLocaleString()}</span>
          </div>

          <div className="flex min-h-10 items-center justify-center gap-1.5 rounded-2xl bg-yellow-300/15 px-2 text-xs font-black text-yellow-100 sm:min-h-12 sm:px-3 sm:text-sm">
            <Coins size={15} strokeWidth={3} aria-hidden="true" />
            <span className="truncate">{stats.coins.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={toggleNotifications}
            aria-label={
              stats.notificationsEnabled
                ? "Notifications enabled"
                : "Notifications disabled"
            }
            title={
              stats.notificationsEnabled
                ? "Notifications enabled"
                : "Notifications disabled"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:h-12 sm:w-12 ${
              stats.notificationsEnabled
                ? "bg-fuchsia-400 text-slate-950 shadow-lg shadow-fuchsia-500/25"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Bell size={17} strokeWidth={3} aria-hidden="true" />
          </button>

          {user ? (
            <button
              type="button"
              onClick={logout}
              aria-label="Logout"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/80 text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:h-12 sm:w-auto sm:px-4"
            >
              <LogOut size={17} strokeWidth={3} aria-hidden="true" />
              <span className="ml-2 hidden font-black sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:h-12 sm:w-auto sm:px-4"
            >
              <LogIn size={17} strokeWidth={3} aria-hidden="true" />
              <span className="ml-2 hidden font-black sm:inline">Login</span>
            </Link>
          )}

          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:h-12 sm:w-auto sm:px-4"
          >
            <UserRound size={17} strokeWidth={3} aria-hidden="true" />
            <span className="ml-2 hidden font-black sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
