"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getDailyChallengeQuestions } from "@/lib/dailyChallenge";
import { playSound } from "@/lib/sound";
import {
  calculateRewards,
  checkAnswer,
  getRandomQuestions,
} from "@/lib/quiz";

export default function QuizClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "movies";
  const isDaily = searchParams.get("daily") === "true";

  const [questions] = useState(
    isDaily
      ? getDailyChallengeQuestions(5)
      : getRandomQuestions(category, 10)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const autoAdvanceTimer = useRef<number | null>(null);

  const question = questions[currentQuestion];

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimer.current === null) return;

    window.clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = null;
  }

  const finishQuiz = useCallback(
    (finalScore: number) => {
      const rewards = calculateRewards(finalScore);

      router.push(
        `/result?score=${finalScore}&xp=${rewards.xp}&coins=${rewards.coins}&category=${
          isDaily ? "daily-challenge" : category
        }&daily=${isDaily}&id=${crypto.randomUUID()}`
      );
    },
    [category, isDaily, router]
  );

  const handleNextQuestion = useCallback(
    (finalScore: number) => {
      clearAutoAdvanceTimer();

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setSubmittedAnswer(null);
        setTimeLeft(15);
      } else {
        finishQuiz(finalScore);
      }
    },
    [currentQuestion, finishQuiz, questions.length]
  );

  function handleAnswer(answer: string) {
    if (submittedAnswer || !question) return;

    setSelectedAnswer(answer);
  }

  function submitAnswer() {
    if (!selectedAnswer || submittedAnswer || !question) return;

    setSubmittedAnswer(selectedAnswer);

    const isCorrect = checkAnswer(selectedAnswer, question.answer);
    const finalScore = isCorrect ? score + question.points : score;

    if (isCorrect) {
      playSound("/sounds/correct.mp3");
      setScore(finalScore);
    } else {
      playSound("/sounds/wrong.mp3");
    }

    clearAutoAdvanceTimer();
    autoAdvanceTimer.current = window.setTimeout(() => {
      handleNextQuestion(finalScore);
    }, 900);
  }

  function skipQuestion() {
    if (submittedAnswer) return;

    handleNextQuestion(score);
  }

  useEffect(() => {
    if (submittedAnswer) return;

    if (timeLeft <= 0) {
      const timer = window.setTimeout(() => {
        handleNextQuestion(score);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, submittedAnswer, score, handleNextQuestion]);

  useEffect(() => {
    return () => {
      clearAutoAdvanceTimer();
    };
  }, []);

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] px-4 text-white">
        <div className="rounded-[30px] border border-white/10 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-black">No questions found</h1>
          <Link href="/play" className="mt-4 block rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">
            Go back to Play
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/play" aria-label="Back to categories" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            ←
          </Link>

          <div className="rounded-full bg-white/10 px-3 py-2 text-sm font-black shadow-lg backdrop-blur sm:px-4">
            Question {currentQuestion + 1}/{questions.length}
          </div>

          <div className="rounded-full border border-cyan-300/70 bg-cyan-300/10 px-3 py-2 text-sm font-black shadow-lg backdrop-blur sm:px-4">
            {timeLeft}s
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10 shadow-inner sm:mt-6">
          <div
            className="h-3 rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:mt-8 sm:rounded-[36px] sm:p-8">
          <h1 className="text-center text-2xl font-black leading-snug sm:text-3xl">
            {question.question}
          </h1>

          <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            {question.options.map((option) => {
              const isCorrect = option === question.answer;
              const isSelected = selectedAnswer === option;
              const showCorrect = submittedAnswer && isCorrect;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={!!submittedAnswer}
                  onClick={() => handleAnswer(option)}
                  aria-pressed={isSelected}
                  className={`min-h-14 w-full rounded-2xl p-4 text-left text-sm font-bold leading-5 transition-all active:scale-95 sm:p-5 sm:text-base
                    ${!submittedAnswer ? "bg-white/10 hover:bg-white/20" : "bg-white/10"}
                    ${isSelected && !submittedAnswer ? "ring-2 ring-cyan-300" : ""}
                    ${submittedAnswer && isSelected && isCorrect ? "bg-green-500 text-white" : ""}
                    ${submittedAnswer && isSelected && !isCorrect ? "bg-red-500 text-white" : ""}
                    ${showCorrect ? "ring-2 ring-green-300" : ""}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={skipQuestion}
            disabled={!!submittedAnswer}
            className="min-h-14 rounded-2xl bg-white/10 px-5 py-4 font-black transition enabled:hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Skip
          </button>

          <button
            type="button"
            onClick={submitAnswer}
            disabled={!selectedAnswer || !!submittedAnswer}
            className="min-h-14 rounded-2xl bg-cyan-400 px-5 py-4 font-black text-slate-950 shadow-xl transition enabled:hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Submit
          </button>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:mt-6">
          <div className="flex items-center justify-between">
            <p>⭐ Score</p>
            <h2 className="text-2xl font-black">{score}</h2>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
