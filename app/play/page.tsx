"use client";

import Image from "next/image";
import Link from "next/link";
import { Bot, ChevronLeft, Cloud, Database, Search } from "lucide-react";
import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { categories } from "@/data/categories";
import type { QuestionSource } from "@/lib/questions/getQuestions";
import type { QuizQuestion } from "@/types";

type Difficulty = QuizQuestion["difficulty"];

const difficultyOptions: {
  label: string;
  value: Difficulty;
}[] = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const sourceOptions: {
  label: string;
  value: QuestionSource;
  description: string;
  icon: typeof Database;
  disabled?: boolean;
}[] = [
  {
    label: "Local",
    value: "local",
    description: "Always available",
    icon: Database,
  },
  {
    label: "Online API",
    value: "api",
    description: "Open Trivia DB",
    icon: Cloud,
  },
  {
    label: "AI",
    value: "ai",
    description: "Coming Soon",
    icon: Bot,
    disabled: true,
  },
];

export default function PlayPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [source, setSource] = useState<QuestionSource>("local");

  const query = useMemo(
    () =>
      new URLSearchParams({
        difficulty,
        source,
      }).toString(),
    [difficulty, source]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] pb-44 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back home"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-white/75 text-violet-700 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <ChevronLeft size={23} strokeWidth={3} aria-hidden="true" />
          </Link>
          <h1 className="text-base font-black sm:text-lg">Choose Quiz</h1>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-white/75 text-violet-700 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-hidden="true"
          >
            <Search size={21} strokeWidth={3} />
          </span>
        </div>

        <Link
          href="/quiz?daily=true"
          className="mt-6 block rounded-[30px] bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-5 text-white shadow-2xl transition hover:-translate-y-1 sm:mt-8 sm:rounded-[36px] sm:p-8"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/80">
            Today Only
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Daily Challenge
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            Complete today&apos;s special quiz and keep your streak alive.
          </p>

          <div className="mt-5 inline-block rounded-full bg-white px-5 py-3 text-sm font-black text-orange-600 shadow-lg sm:text-base">
            Start Challenge
          </div>
        </Link>

        <div className="mt-5 rounded-[30px] border border-violet-200/70 bg-white/75 p-4 shadow-2xl shadow-violet-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-purple-950/30 sm:mt-6 sm:rounded-[36px] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-violet-500 dark:text-cyan-200">
                Difficulty
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value)}
                    aria-pressed={difficulty === option.value}
                    className={`min-h-12 rounded-2xl px-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                      difficulty === option.value
                        ? "bg-slate-950 text-white shadow-lg dark:bg-cyan-300 dark:text-slate-950"
                        : "bg-white/70 text-slate-600 hover:bg-white dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-violet-500 dark:text-cyan-200">
                Question Source
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {sourceOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = source === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!option.disabled) setSource(option.value);
                      }}
                      disabled={option.disabled}
                      aria-pressed={selected}
                      className={`min-h-16 rounded-2xl px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                        selected
                          ? "bg-slate-950 text-white shadow-lg dark:bg-cyan-300 dark:text-slate-950"
                          : "bg-white/70 text-slate-600 hover:bg-white dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                      } ${option.disabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span className="flex items-center gap-2 font-black">
                        <Icon size={17} strokeWidth={3} aria-hidden="true" />
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs font-bold opacity-75">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-lg font-black sm:mt-8 sm:text-xl">
          Pick a Category
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/quiz?category=${encodeURIComponent(category.name)}&${query}`}
              className={`${category.gradient} block rounded-[26px] p-3.5 text-white shadow-xl transition hover:-translate-y-1 active:scale-95 sm:rounded-[30px] sm:p-5`}
            >
              <div className="flex min-h-[150px] flex-col items-center justify-between text-center sm:min-h-[190px]">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="h-12 w-12 drop-shadow-xl sm:h-16 sm:w-16"
                />

                <div className="min-w-0">
                  <h2 className="text-base font-black leading-tight sm:text-2xl">
                    {category.name}
                  </h2>
                  <p className="text-xs font-bold text-white/90 sm:text-sm">
                    {1200 + index * 200}+ Questions
                  </p>
                  <p className="mt-1 hidden text-xs text-white/80 sm:block">
                    {source === "api" ? "Online quiz pool" : "Local fallback ready"}
                  </p>
                </div>

                <span className="text-2xl font-black sm:text-3xl">›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
