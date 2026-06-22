"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import BottomNav from "@/components/BottomNav";
import UserCard from "@/components/UserCard";
import AvatarImage from "@/components/AvatarImage";
import { getResolvedAvatar } from "@/lib/avatar";
import { getDisplayName } from "@/lib/getDisplayName";
import { getPlayerData, type PlayerData } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);

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

  const data = player ?? {
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    quizzesPlayed: 0,
  };
  const displayName = getDisplayName(user, player);
  const avatar = getResolvedAvatar(player, user);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-8">
        <h1 className="text-center text-3xl font-black sm:text-4xl">🏆 Leaderboard</h1>

        <p className="mt-2 text-center text-white/60">
          Your weekly progress
        </p>

        <div className="mx-auto mt-6 max-w-md sm:mt-8">
          <UserCard />
        </div>

        <div className="mt-7 rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:mt-10 sm:rounded-[36px] sm:p-6">
          <h2 className="text-xl font-black sm:text-2xl">Rankings</h2>

          <div className="mt-5">
            <div className="grid gap-4 rounded-3xl bg-white/10 p-4 sm:flex sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="text-2xl font-black sm:text-3xl">#1</div>

                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10 sm:h-14 sm:w-14">
                  <AvatarImage
                    src={avatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black">{displayName}</p>
                  <p className="text-sm text-white/60">Level {data.level}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-cyan-300/10 px-4 py-3 sm:block sm:bg-transparent sm:p-0 sm:text-right">
                <p className="font-black">{data.xp.toLocaleString()}</p>
                <p className="text-sm text-cyan-300">XP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
