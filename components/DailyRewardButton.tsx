"use client";

import { useEffect, useState } from "react";
import { getPlayerData, savePlayerData } from "@/lib/storage";

const DAILY_REWARD_KEY = "family_quiz_daily_reward";

export default function DailyRewardButton() {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setClaimed(localStorage.getItem(DAILY_REWARD_KEY) === todayKey());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function claimReward() {
    if (claimed) return;

    const player = getPlayerData();
    savePlayerData({
      ...player,
      coins: player.coins + 25,
      xp: player.xp + 25,
    });
    localStorage.setItem(DAILY_REWARD_KEY, todayKey());
    setClaimed(true);
  }

  return (
    <button
      type="button"
      onClick={claimReward}
      disabled={claimed}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 font-black text-white transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      {claimed ? "Reward Claimed" : "Claim Reward"}
    </button>
  );
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
