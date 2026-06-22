"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { getPlayerData, type PlayerData } from "@/lib/storage";

export default function UserStats() {
  const [player, setPlayer] = useState<PlayerData | null>(null);

  useEffect(() => {
    const playerTimer = window.setTimeout(() => {
      setPlayer(getPlayerData());
    }, 0);

    return () => {
      window.clearTimeout(playerTimer);
    };
  }, []);

  const data = player ?? {
    xp: 0,
    coins: 0,
    streak: 0,
    quizzesPlayed: 0,
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
      <StatCard label="XP" value={data.xp.toLocaleString()} icon="⭐" />
      <StatCard label="Coins" value={data.coins.toLocaleString()} icon="🪙" />
      <StatCard label="Streak" value={`${data.streak} Days`} icon="🔥" />
      <StatCard label="Played" value={data.quizzesPlayed} icon="🏆" />
    </div>
  );
}
