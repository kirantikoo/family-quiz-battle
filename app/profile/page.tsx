"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getDisplayName } from "@/lib/getDisplayName";
import { getResolvedAvatar } from "@/lib/avatar";

import BadgeCard from "@/components/BadgeCard";
import BottomNav from "@/components/BottomNav";
import AvatarImage from "@/components/AvatarImage";
import { avatars } from "@/data/avatars";
import { badges } from "@/data/badges";
import {
  getPlayerData,
  savePlayerData,
  type PlayerData,
} from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const playerTimer = window.setTimeout(() => {
      const savedPlayer = getPlayerData();
      setPlayer(savedPlayer);
      setNameDraft(getDisplayName(null, savedPlayer));
    }, 0);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setNameDraft((current) => current || getDisplayName(data.user));
    });

    return () => {
      window.clearTimeout(playerTimer);
    };
  }, []);

  function updatePlayer(updatedPlayer: PlayerData) {
    setPlayer(updatedPlayer);
    savePlayerData(updatedPlayer);
  }

  function changeAvatar(avatar: string) {
    if (!player) return;

    updatePlayer({
      ...player,
      avatar,
      avatarType: "image",
      customAvatarImage: "",
    });
  }

  function uploadProfileImage(event: ChangeEvent<HTMLInputElement>) {
    if (!player) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result as string;

      updatePlayer({
        ...player,
        avatarType: "image",
        customAvatarImage: imageData,
      });
    };

    reader.readAsDataURL(file);
  }

  function removeCustomPhoto() {
    if (!player) return;

    updatePlayer({
      ...player,
      avatar: "",
      avatarType: "emoji",
      customAvatarImage: "",
    });
  }

  function saveDisplayName() {
    if (!player) return;

    const trimmedName = nameDraft.trim();

    updatePlayer({
      ...player,
      displayNameOverride: trimmedName,
    });
    setNameDraft(trimmedName || getDisplayName(user));
    setIsEditingName(false);
  }

  if (!player) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] text-white">
        Loading...
      </main>
    );
  }

  const displayName = getDisplayName(user, player);
  const profileImage = getResolvedAvatar(player, user);
  const hasLocalAvatar = Boolean(player.customAvatarImage || player.avatar);

  const xpProgress = player.xp % 1000;
  const progressPercent = (xpProgress / 1000) * 100;
  const history = player.history || [];
  const achievements = player.achievements || [];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Back home" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            ←
          </Link>

          <h1 className="text-lg font-black sm:text-xl">Profile</h1>

          <Link href="/settings" aria-label="Settings" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            ⚙️
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 text-center shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-purple-600 ring-4 ring-white/20 sm:h-32 sm:w-32">
                  <AvatarImage
                    src={profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 text-xl shadow-lg transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Upload profile photo"
                  title="Change photo"
                >
                  📷
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadProfileImage}
                />
              </div>

              {isEditingName ? (
                <div className="mt-5 space-y-3">
                  <label htmlFor="display-name" className="sr-only">
                    Display name
                  </label>
                  <input
                    id="display-name"
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center text-xl font-black text-white outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder={displayName}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={saveDisplayName}
                      className="rounded-2xl bg-cyan-400 px-4 py-3 font-black text-slate-950"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNameDraft(displayName);
                        setIsEditingName(false);
                      }}
                      className="rounded-2xl bg-white/10 px-4 py-3 font-black"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <h2 className="truncate text-2xl font-black sm:text-3xl">{displayName}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setNameDraft(displayName);
                      setIsEditingName(true);
                    }}
                    className="mt-3 rounded-2xl bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    Edit Name
                  </button>
                </div>
              )}

              <p className="mt-2 text-sm text-white/60 sm:text-base">
                Level {player.level} • {player.streak} day streak
              </p>

              <div className="mt-6 h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-cyan-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-white/60">
                {xpProgress}/1000 XP to next level
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl bg-white px-4 py-3 font-black text-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  Upload
                </button>

                <button
                  type="button"
                  onClick={removeCustomPhoto}
                  className="rounded-2xl bg-white/10 px-4 py-3 font-black transition enabled:hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  disabled={!hasLocalAvatar}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black">Level Progress</h2>

              <div className="mt-5">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Level {player.level}</span>
                  <span>{1000 - xpProgress} XP Left</span>
                </div>

                <div className="mt-3 h-4 rounded-full bg-white/10">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black">Choose Avatar</h2>

              <div className="mt-5 grid grid-cols-3 gap-3 min-[380px]:grid-cols-4">
                {avatars.map((avatar) => (
                  <button
                    type="button"
                    key={avatar.id}
                    onClick={() => changeAvatar(avatar.value)}
                    aria-label={`Select ${avatar.id} avatar`}
                    className={`mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                      !player.customAvatarImage && player.avatar === avatar.value
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/30"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <AvatarImage
                      src={avatar.value}
                      alt={avatar.id}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-white/10 p-4 text-center shadow-xl sm:p-5">
                <Image
                  src="/icon-xp.png"
                  alt="XP"
                  width={42}
                  height={42}
                  className="mx-auto"
                />
                <p className="mt-2 text-white/60">XP</p>
                <h3 className="text-xl font-black sm:text-2xl">{player.xp}</h3>
              </div>

              <div className="rounded-3xl bg-white/10 p-4 text-center shadow-xl sm:p-5">
                <Image
                  src="/icon-coins.png"
                  alt="Coins"
                  width={42}
                  height={42}
                  className="mx-auto"
                />
                <p className="mt-2 text-white/60">Coins</p>
                <h3 className="text-xl font-black sm:text-2xl">{player.coins}</h3>
              </div>

              <div className="rounded-3xl bg-white/10 p-4 text-center shadow-xl sm:p-5">
                <Image
                  src="/icon-streak.png"
                  alt="Streak"
                  width={42}
                  height={42}
                  className="mx-auto"
                />
                <p className="mt-2 text-white/60">Streak</p>
                <h3 className="text-xl font-black sm:text-2xl">{player.streak}</h3>
              </div>

              <div className="rounded-3xl bg-white/10 p-4 text-center shadow-xl sm:p-5">
                <Image
                  src="/icon-achievement.png"
                  alt="Played"
                  width={42}
                  height={42}
                  className="mx-auto"
                />
                <p className="mt-2 text-white/60">Played</p>
                <h3 className="text-xl font-black sm:text-2xl">
                  {player.quizzesPlayed}
                </h3>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black sm:text-2xl">Badge Collection</h2>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    icon={badge.icon}
                    title={badge.title}
                    unlocked={achievements.includes(badge.id)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black sm:text-2xl">Recent Quiz History</h2>

              <div className="mt-5 space-y-3">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-3xl bg-white/10 p-4 sm:flex sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-black capitalize">
                          🎯 {item.category}
                        </p>
                        <p className="text-sm text-white/60">
                          {item.date}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-black">{item.score} Score</p>
                        <p className="text-sm text-cyan-300">
                          +{item.xp} XP • +{item.coins} Coins
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No quiz history yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
