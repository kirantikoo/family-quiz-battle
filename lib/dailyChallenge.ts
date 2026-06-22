import { questions } from "@/data/questions";
import type { Question } from "@/types";

export function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function getDailyChallengeQuestions(count = 5): Question[] {
  const today = getTodayKey();

  const seed = today
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const shuffled = [...questions].sort((a, b) => {
    const aValue = a.id.charCodeAt(1) + seed;
    const bValue = b.id.charCodeAt(1) + seed;
    return aValue - bValue;
  });

  return shuffled.slice(0, count);
}