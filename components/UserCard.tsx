"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getResolvedAvatar } from "@/lib/avatar";
import { getDisplayName } from "@/lib/getDisplayName";
import { getPlayerData, type PlayerData } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import AvatarImage from "@/components/AvatarImage";

export default function UserCard() {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);

  useEffect(() => {
    const playerTimer = window.setTimeout(() => {
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
      window.clearTimeout(playerTimer);
      listener.subscription.unsubscribe();
    };
  }, []);

  const data = player ?? getEmptyPlayer();
  const displayName = getDisplayName(user, player);
  const avatar = getResolvedAvatar(player, user);
  const xpProgress = data.xp % 1000;
  const progressPercent = useMemo(
    () => Math.min(100, Math.max(0, (xpProgress / 1000) * 100)),
    [xpProgress]
  );

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-purple-600 text-5xl shadow-xl ring-4 ring-white/15">
          <AvatarImage
            src={avatar}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4 min-w-0">
          <h2 className="truncate text-2xl font-black">{displayName}</h2>
          <p className="text-sm text-white/60">
            Level {data.level} • {data.streak} day streak
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black sm:text-sm">
        <div className="truncate rounded-2xl bg-white/10 px-2 py-3">⭐ {data.xp}</div>
        <div className="truncate rounded-2xl bg-white/10 px-2 py-3">🪙 {data.coins}</div>
        <div className="truncate rounded-2xl bg-white/10 px-2 py-3">🔥 {data.streak}</div>
      </div>

      <div className="mt-5 h-3 rounded-full bg-white/10">
        <div
          className="h-3 rounded-full bg-cyan-400"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-2 text-right text-sm text-white/60">
        {xpProgress}/1000 XP
      </p>
    </div>
  );
}

function getEmptyPlayer(): PlayerData {
  return {
    avatar: "",
    avatarType: "emoji",
    customAvatarImage: "",
    xp: 0,
    coins: 0,
    level: 1,
    streak: 0,
    quizzesPlayed: 0,
    achievements: [],
    history: [],
    soundEnabled: true,
    theme: "dark",
    notificationsEnabled: true,
    lastResultId: "",
  };
}
