"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getQuestions, type QuestionSource } from "@/lib/questions/getQuestions";
import { playSound } from "@/lib/sound";
import { calculateRewards, checkAnswer } from "@/lib/quiz";
import type { QuizQuestion } from "@/types";

type Difficulty = QuizQuestion["difficulty"];

export default function QuizClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "Movies";
  const difficulty = parseDifficulty(searchParams.get("difficulty"));
  const source = parseSource(searchParams.get("source"));
  const isDaily = searchParams.get("daily") === "true";

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const autoAdvanceTimer = useRef<number | null>(null);

  const question = questions[currentQuestion];

  useEffect(() => {
    let cancelled = false;

    async function prepareQuiz() {
      setLoading(true);
      setNotice("");
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setSubmittedAnswer(null);
      setTimeLeft(15);

      const requestedSource = isDaily ? "local" : source;
      const quizQuestions = await getQuestions({
        category: isDaily ? "General Knowledge" : category,
        difficulty: isDaily ? undefined : difficulty,
        amount: isDaily ? 5 : 10,
        source: requestedSource,
      });

      if (cancelled) return;

      setQuestions(quizQuestions);

      if (source === "api" && quizQuestions.every((item) => item.source === "local")) {
        setNotice("Online questions are unavailable, using local questions.");
      }

      if (source === "ai") {
        setNotice("AI quizzes are Coming Soon, using local questions for now.");
      }

      setLoading(false);
    }

    prepareQuiz();

    return () => {
      cancelled = true;
    };
  }, [category, difficulty, isDaily, source]);

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

    const isCorrect = checkAnswer(selectedAnswer, question.correctAnswer);
    const finalScore = isCorrect ? score + getQuestionPoints(question) : score;

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] px-4 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
        <div className="rounded-[30px] border border-violet-200/70 bg-white/75 p-6 text-center font-black shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          Preparing your quiz...
        </div>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] px-4 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
        <div className="rounded-[30px] border border-violet-200/70 bg-white/75 p-6 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <h1 className="text-2xl font-black">No questions found</h1>
          <Link href="/play" className="mt-4 block rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">
            Go back to Play
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef7ff_40%,#f8fbff_100%)] pb-44 text-slate-900 transition dark:bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] dark:text-white">
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/play" aria-label="Back to categories" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/70 bg-white/75 text-2xl font-black text-violet-700 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            ←
          </Link>

          <div className="rounded-full border border-violet-200/70 bg-white/75 px-3 py-2 text-sm font-black shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10 sm:px-4">
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

        {notice && (
          <div className="mt-5 rounded-3xl border border-amber-300/50 bg-amber-100/80 p-4 text-sm font-bold text-amber-900 shadow-lg backdrop-blur-xl dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            {notice}
          </div>
        )}

        <div className="mt-6 rounded-[30px] border border-violet-200/70 bg-white/75 p-5 shadow-2xl shadow-violet-200/40 backdrop-blur-xl sm:mt-8 sm:rounded-[36px] sm:p-8 dark:border-white/10 dark:bg-white/10 dark:shadow-purple-950/30">
          <p className="mb-4 text-center text-xs font-black uppercase tracking-widest text-violet-500 dark:text-cyan-200">
            {question.category} • {question.difficulty} • {question.source === "api" ? "Online API" : "Local"}
          </p>
          <h1 className="text-center text-2xl font-black leading-snug sm:text-3xl">
            {question.question}
          </h1>

          <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            {question.options.map((option) => {
              const isCorrect = option === question.correctAnswer;
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

function parseDifficulty(value: string | null): Difficulty {
  return value === "medium" || value === "hard" ? value : "easy";
}

function parseSource(value: string | null): QuestionSource {
  return value === "api" || value === "ai" ? value : "local";
}

function getQuestionPoints(question: QuizQuestion) {
  if (question.difficulty === "hard") return 30;
  if (question.difficulty === "medium") return 20;
  return 10;
}
