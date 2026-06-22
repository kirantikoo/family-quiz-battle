"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import BottomNav from "@/components/BottomNav";
import { getResolvedAvatar } from "@/lib/avatar";
import {
  getPlayerData,
  resetPlayerData,
  savePlayerData,
  type PlayerData,
} from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const playerTimer = window.setTimeout(() => {
      setPlayer(getPlayerData());
    }, 0);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    return () => {
      window.clearTimeout(playerTimer);
    };
  }, []);

  function toggleSound() {
    updatePlayer((current) => ({
      ...current,
      soundEnabled: !current.soundEnabled,
    }));
  }

  function toggleTheme() {
    updatePlayer((current) => ({
      ...current,
      theme: current.theme === "dark" ? "light" : "dark",
    }));
  }

  function toggleNotifications() {
    updatePlayer((current) => ({
      ...current,
      notificationsEnabled: !current.notificationsEnabled,
    }));
  }

  function updatePlayer(updater: (current: PlayerData) => PlayerData) {
    if (!player) return;

    const updatedPlayer = updater(player);

    setPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
  }

  function resetProgress() {
    const confirmReset = confirm(
      "Are you sure you want to reset your progress?"
    );

    if (!confirmReset) return;

    resetPlayerData();
    setPlayer(getPlayerData());
  }

  if (!player) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/profile" aria-label="Back to profile" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            ←
          </Link>

          <h1 className="text-lg font-black sm:text-xl">Settings</h1>

          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-lg backdrop-blur">⚙️</span>
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:mt-8 sm:rounded-[36px] sm:p-6">
          <h2 className="text-xl font-black sm:text-2xl">Game Settings</h2>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={player.soundEnabled}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl bg-white/10 p-4 text-left font-bold transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:p-5"
            >
              <span>🔊 Sound Effects</span>

              <span
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black sm:text-sm ${
                  player.soundEnabled
                    ? "bg-green-500"
                    : "bg-white/10"
                }`}
              >
                {player.soundEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={player.theme === "dark"}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl bg-white/10 p-4 text-left font-bold transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:p-5"
            >
              <span>🌙 Theme</span>
              <span className="shrink-0 rounded-full bg-purple-600 px-3 py-2 text-xs font-black sm:px-4 sm:text-sm">
                {player.theme === "dark" ? "Game Dark" : "Game Light"}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-pressed={player.notificationsEnabled}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl bg-white/10 p-4 text-left font-bold transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:p-5"
            >
              <span>🔔 Notifications</span>
              <span
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black sm:text-sm ${
                  player.notificationsEnabled ? "bg-green-500" : "bg-white/10"
                }`}
              >
                {player.notificationsEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <div className="flex min-h-16 items-center justify-between gap-3 rounded-3xl bg-white/10 p-4 font-bold sm:p-5">
              <span>👤 Avatar</span>
              <img
                src={getResolvedAvatar(player, user)}
                alt="Avatar"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex min-h-16 items-center justify-between gap-3 rounded-3xl bg-white/10 p-4 font-bold sm:p-5">
              <span>⭐ Level</span>
              <span>{player.level}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] border border-red-400/20 bg-red-500/10 p-5 shadow-2xl backdrop-blur-xl sm:mt-6 sm:rounded-[36px] sm:p-6">
          <h2 className="text-xl font-black sm:text-2xl">Danger Zone</h2>

          <button
            type="button"
            onClick={resetProgress}
            className="mt-5 min-h-14 w-full rounded-2xl bg-red-500 py-4 font-black shadow-xl transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Reset Progress
          </button>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
