"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { unlockAchievements } from "@/lib/achievements";
import { calculateLevel } from "@/lib/level";
import { getPlayerData, savePlayerData } from "@/lib/storage";
import { updateStreak } from "@/lib/streak";
import BottomNav from "@/components/BottomNav";

export default function ResultClient() {
  const searchParams = useSearchParams();

  const score = searchParams.get("score") || "0";
  const xp = searchParams.get("xp") || "0";
  const coins = searchParams.get("coins") || "0";
  const category = searchParams.get("category") || "quiz";
  const isDaily = searchParams.get("daily") === "true";
  const resultId =
    searchParams.get("id") ||
    `${score}:${xp}:${coins}:${category}:${String(isDaily)}`;

  const earned = useMemo(
    () => ({
      score: Number(score),
      xp: Number(xp),
      coins: Number(coins),
      category,
    }),
    [score, xp, coins, category]
  );

  useEffect(() => {
    const player = getPlayerData();

    if (player.lastResultId === resultId) {
      return;
    }

    const streakResult = updateStreak(
      player.lastPlayedDate || "",
      player.streak
    );

    const streakBonus =
      isDaily && streakResult.streak > player.streak
        ? streakResult.streak * 10
        : 0;

    const dailyBonusXP = isDaily ? 50 : 0;
    const totalXP = earned.xp + dailyBonusXP;
    const totalCoins = earned.coins + streakBonus;

    const updatedPlayer = {
      ...player,
      xp: player.xp + totalXP,
      coins: player.coins + totalCoins,
      quizzesPlayed: player.quizzesPlayed + 1,
      level: calculateLevel(player.xp + totalXP),
      streak: streakResult.streak,
      lastPlayedDate: streakResult.date,
      lastResultId: resultId,
      history: [
        {
          score: earned.score,
          xp: totalXP,
          coins: totalCoins,
          category: earned.category,
          date: new Date().toLocaleDateString(),
        },
        ...(player.history || []),
      ].slice(0, 20),
    };

    updatedPlayer.achievements = unlockAchievements(updatedPlayer);
    savePlayerData(updatedPlayer);
  }, [earned, isDaily, resultId]);

  const displayXP = earned.xp + (isDaily ? 50 : 0);
  const displayCoins = earned.coins;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] px-4 py-5 pb-44 text-white sm:py-6">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-purple-400/40 bg-[radial-gradient(circle_at_top,#3B0CA3_0%,#150044_45%,#07001F_100%)] px-4 py-6 shadow-2xl sm:rounded-[42px] sm:px-5 sm:py-8 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute left-[12%] top-[8%] text-4xl">🟨</div>
          <div className="absolute right-[10%] top-[12%] text-3xl">🟦</div>
          <div className="absolute left-[6%] top-[35%] text-3xl">🟪</div>
          <div className="absolute right-[8%] top-[38%] text-3xl">🟧</div>
          <div className="absolute left-[20%] bottom-[12%] text-3xl">✨</div>
          <div className="absolute right-[22%] bottom-[18%] text-3xl">🎉</div>
        </div>

        <div className="relative text-center">
          <div className="drop-shadow-2xl">
            <Image
              src="/icon-trophy.png"
              alt="Trophy"
              width={140}
              height={140}
              className="mx-auto h-24 w-24 drop-shadow-2xl sm:h-[140px] sm:w-[140px]"
            />
          </div>

          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white drop-shadow-xl sm:text-5xl md:text-7xl">
            Quiz Complete!
          </h1>

          <p className="mt-2 text-lg font-black text-purple-200 sm:mt-3 sm:text-2xl">
            Great job! Keep it up!
          </p>
        </div>

        <div className="relative mt-7 grid gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3">
          <div className="rounded-[26px] border-2 border-purple-400/60 bg-purple-900/60 p-4 text-center shadow-2xl sm:rounded-[32px] sm:p-6">
            <div className="text-4xl sm:text-6xl">🎯</div>
            <p className="mt-3 text-sm font-black uppercase sm:mt-4 sm:text-xl">Score</p>
            <h2 className="mt-2 text-4xl font-black sm:mt-3 sm:text-6xl">{earned.score}</h2>
          </div>

          <div className="rounded-[26px] border-2 border-cyan-400/60 bg-blue-900/60 p-4 text-center shadow-2xl sm:rounded-[32px] sm:p-6">
            <div>
              <Image
                src="/icon-xp.png"
                alt="XP"
                width={60}
                height={60}
                className="mx-auto h-11 w-11 sm:h-[60px] sm:w-[60px]"
              />
            </div>
            <p className="mt-3 text-sm font-black uppercase sm:mt-4 sm:text-xl">XP Earned</p>
            <h2 className="mt-2 text-4xl font-black text-cyan-300 sm:mt-3 sm:text-6xl">
              +{displayXP}
            </h2>
          </div>

          <div className="rounded-[26px] border-2 border-orange-400/60 bg-orange-950/60 p-4 text-center shadow-2xl sm:rounded-[32px] sm:p-6">
            <div>
              <Image
                src="/icon-coins.png"
                alt="Coins"
                width={60}
                height={60}
                className="mx-auto h-11 w-11 sm:h-[60px] sm:w-[60px]"
              />
            </div>
            <p className="mt-3 text-sm font-black uppercase sm:mt-4 sm:text-xl">Coins Earned</p>
            <h2 className="mt-2 text-4xl font-black text-yellow-300 sm:mt-3 sm:text-6xl">
              +{displayCoins}
            </h2>
          </div>
        </div>

        {isDaily && (
          <div className="relative mt-6 rounded-[28px] border-2 border-yellow-400/70 bg-yellow-950/60 p-4 shadow-2xl sm:mt-8 sm:rounded-[34px] sm:p-6">
            <div className="grid gap-4 md:grid-cols-[120px_1fr_220px] md:items-center">
              <div className="text-center text-5xl sm:text-8xl">🔥</div>

              <div>
                <h2 className="text-2xl font-black uppercase text-yellow-300 sm:text-3xl">
                  Daily Challenge Bonus
                </h2>
                <p className="mt-2 text-sm font-bold leading-6 text-white/85 sm:mt-3 sm:text-lg">
                  You earned bonus XP and streak coins for playing today!
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-cyan-300/40 bg-cyan-500/20 px-5 py-3 text-center text-lg font-black text-cyan-200 sm:text-2xl">
                  ⭐ +50 XP
                </div>

                <div className="rounded-2xl border border-yellow-300/40 bg-yellow-500/20 px-5 py-3 text-center text-lg font-black text-yellow-200 sm:text-2xl">
                  🪙 Bonus Coins
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative mt-8 grid gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3">
          <Link
            href="/play"
            className="rounded-[24px] bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-4 text-center text-base font-black shadow-2xl transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:rounded-[28px] sm:px-6 sm:py-6 sm:text-2xl"
          >
            🔄 PLAY AGAIN
          </Link>

          <Link
            href="/leaderboard"
            className="rounded-[24px] bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-4 text-center text-base font-black text-slate-950 shadow-2xl transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:rounded-[28px] sm:px-6 sm:py-6 sm:text-2xl"
          >
            🏆 LEADERBOARD
          </Link>

          <Link
            href="/profile"
            className="rounded-[24px] bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-4 text-center text-base font-black shadow-2xl transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:rounded-[28px] sm:px-6 sm:py-6 sm:text-2xl"
          >
            👤 VIEW PROFILE
          </Link>
        </div>

        <div className="relative mt-8 text-center">
          <Link
            href="/"
            className="text-lg font-black text-purple-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:text-2xl"
          >
            🏠 BACK TO HOME
          </Link>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
