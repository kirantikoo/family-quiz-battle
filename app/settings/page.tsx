"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  Bell,
  Bot,
  Check,
  ChevronLeft,
  Gauge,
  Medal,
  Mic2,
  Moon,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  UsersRound,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import type { Theme } from "@/components/ThemeProvider";
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

  function handleThemeChange(theme: Theme) {
    updatePlayer((current) => ({
      ...current,
      theme,
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
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
        <div className="rounded-3xl border border-violet-200/70 bg-white/70 px-5 py-4 font-black shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          Loading settings...
        </div>
      </main>
    );
  }

  const statusStyles = {
    Completed: "bg-emerald-500 text-white",
    "In Progress": "bg-amber-400 text-slate-950",
    "Coming Soon": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/75",
  } as const;

  const featureProgressCards: {
    title: string;
    icon: LucideIcon;
    progress: number;
    accent: string;
    iconTone: string;
    features: {
      label: string;
      status: keyof typeof statusStyles;
    }[];
  }[] = [
    {
      title: "Voice Assistant",
      icon: Mic2,
      progress: 35,
      accent: "from-cyan-300 via-violet-400 to-fuchsia-400",
      iconTone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-300/15 dark:text-cyan-100",
      features: [
        { label: "Speak quiz questions", status: "Completed" },
        { label: "Read answer options", status: "Completed" },
        { label: "Voice countdown", status: "In Progress" },
        { label: "Correct / wrong answer feedback", status: "In Progress" },
        { label: "Hands-free quiz mode", status: "Coming Soon" },
        { label: "Parent/kids accessibility mode", status: "Coming Soon" },
      ],
    },
    {
      title: "AI Daily Quiz",
      icon: Bot,
      progress: 25,
      accent: "from-violet-300 via-blue-400 to-cyan-300",
      iconTone: "bg-violet-100 text-violet-700 dark:bg-violet-300/15 dark:text-violet-100",
      features: [
        { label: "AI-generated daily questions", status: "In Progress" },
        { label: "Genre/category-based quiz generation", status: "In Progress" },
        { label: "Kids-safe question filtering", status: "Coming Soon" },
        { label: "Difficulty selection", status: "Completed" },
        { label: "Save daily quiz history", status: "Coming Soon" },
      ],
    },
    {
      title: "Family Team Battle",
      icon: UsersRound,
      progress: 20,
      accent: "from-emerald-300 via-teal-400 to-cyan-300",
      iconTone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-100",
      features: [
        { label: "Create family teams", status: "In Progress" },
        { label: "Team vs team battle rooms", status: "Coming Soon" },
        { label: "Shared family score", status: "Coming Soon" },
        { label: "Parent/kids mode", status: "Completed" },
        { label: "Team leaderboard", status: "Coming Soon" },
      ],
    },
    {
      title: "Achievement Store",
      icon: Medal,
      progress: 30,
      accent: "from-amber-300 via-orange-400 to-pink-400",
      iconTone: "bg-amber-100 text-amber-700 dark:bg-amber-300/15 dark:text-amber-100",
      features: [
        { label: "Spend coins on badges", status: "In Progress" },
        { label: "Unlock premium avatars", status: "Coming Soon" },
        { label: "Buy quiz themes", status: "Coming Soon" },
        { label: "Reward collection", status: "Completed" },
        { label: "Store history", status: "Coming Soon" },
      ],
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] pb-44 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/profile" aria-label="Back to profile" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-white/75 text-violet-700 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            <ChevronLeft size={23} strokeWidth={3} aria-hidden="true" />
          </Link>

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-violet-500 dark:text-cyan-200">
              Family Quiz Battle
            </p>
            <h1 className="text-xl font-black sm:text-2xl">Settings</h1>
          </div>

          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-white/75 text-violet-700 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white">
            <Settings size={21} strokeWidth={3} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 rounded-[30px] border border-violet-200/70 bg-white/75 p-5 shadow-2xl shadow-violet-200/50 backdrop-blur-xl sm:mt-8 sm:rounded-[36px] sm:p-6 dark:border-white/10 dark:bg-white/10 dark:shadow-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 dark:bg-cyan-300/15 dark:text-cyan-100">
              <Sparkles size={22} strokeWidth={3} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black sm:text-2xl">Game Settings</h2>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-white/60">
                Personalize your quiz room and device experience.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={player.soundEnabled}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl border border-violet-100 bg-white/70 p-4 text-left font-bold shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:p-5 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-300/15 dark:text-cyan-100">
                  <Volume2 size={19} strokeWidth={3} aria-hidden="true" />
                </span>
                Sound Effects
              </span>

              <span
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black sm:text-sm ${
                  player.soundEnabled
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                {player.soundEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <div className="rounded-3xl border border-violet-100 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 font-bold">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-fuchsia-300/15 dark:text-fuchsia-100">
                    {player.theme === "dark" ? (
                      <Moon size={19} strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <Sun size={19} strokeWidth={3} aria-hidden="true" />
                    )}
                  </span>
                  Theme
                </span>
                <span className="rounded-full bg-violet-600 px-3 py-2 text-xs font-black text-white shadow-lg shadow-violet-500/20 dark:bg-cyan-300 dark:text-slate-950">
                  {player.theme === "dark" ? "Dark Active" : "Light Active"}
                </span>
              </div>
              <ThemeToggle onThemeChange={handleThemeChange} />
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-pressed={player.notificationsEnabled}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl border border-violet-100 bg-white/70 p-4 text-left font-bold shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:p-5 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-300/15 dark:text-amber-100">
                  <Bell size={19} strokeWidth={3} aria-hidden="true" />
                </span>
                Notifications
              </span>
              <span
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black sm:text-sm ${
                  player.notificationsEnabled
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                {player.notificationsEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <div className="flex min-h-16 items-center justify-between gap-3 rounded-3xl border border-violet-100 bg-white/70 p-4 font-bold shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-5">
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700 dark:bg-pink-300/15 dark:text-pink-100">
                  <UserRound size={19} strokeWidth={3} aria-hidden="true" />
                </span>
                Avatar
              </span>
              <img
                src={getResolvedAvatar(player, user)}
                alt="Avatar"
                className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex min-h-16 items-center justify-between gap-3 rounded-3xl border border-violet-100 bg-white/70 p-4 font-bold shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-5">
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-100">
                  <Gauge size={19} strokeWidth={3} aria-hidden="true" />
                </span>
                Level
              </span>
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                {player.level}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] border border-cyan-200/80 bg-white/75 p-5 shadow-2xl shadow-cyan-200/40 backdrop-blur-xl sm:mt-6 sm:rounded-[36px] sm:p-6 dark:border-white/10 dark:bg-white/10 dark:shadow-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-100 text-cyan-700 dark:bg-cyan-300/15 dark:text-cyan-100">
              <ShieldCheck size={22} strokeWidth={3} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black sm:text-2xl">
                Coming Soon Features
              </h2>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-white/60">
                Future-ready settings and progress for the next quiz upgrades.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {featureProgressCards.map((card) => {
              const Icon = card.icon;

              return (
              <div
                key={card.title}
                className="overflow-hidden rounded-3xl border border-violet-100 bg-white/70 p-4 shadow-xl shadow-violet-200/30 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:shadow-purple-950/20 dark:hover:bg-white/15 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl ${card.iconTone}`}>
                      <Icon size={23} strokeWidth={3} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black sm:text-xl">
                          {card.title}
                        </h3>
                        <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-lg shadow-fuchsia-500/20">
                          Coming Soon
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-500 dark:text-white/60">
                        Progress: {card.progress}%
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-cyan-100 shadow-lg dark:bg-white dark:text-slate-950">
                    {card.progress}%
                  </span>
                </div>

                <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.accent} shadow-lg shadow-cyan-500/20`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>

                <div className="mt-4 grid gap-2">
                  {card.features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-white/70 p-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/10"
                    >
                      <span className="flex min-w-0 items-center gap-2 font-bold">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-100">
                          <Check size={15} strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">{feature.label}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-black ${statusStyles[feature.status]}`}
                      >
                        {feature.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[30px] border border-red-300/50 bg-red-50/80 p-5 shadow-2xl shadow-red-200/40 backdrop-blur-xl sm:mt-6 sm:rounded-[36px] sm:p-6 dark:border-red-400/20 dark:bg-red-500/10 dark:shadow-purple-950/30">
          <h2 className="text-xl font-black sm:text-2xl">Danger Zone</h2>

          <button
            type="button"
            onClick={resetProgress}
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 font-black text-white shadow-xl transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <RotateCcw size={18} strokeWidth={3} aria-hidden="true" />
            Reset Progress
          </button>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
