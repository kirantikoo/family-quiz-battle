import { localQuestions } from "@/data/questions";
import type { QuizQuestion } from "@/types";

type Difficulty = QuizQuestion["difficulty"];

export const SAFE_QUIZ_CATEGORIES = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Sports",
  "Movies",
  "Music",
  "Kids",
  "Animals",
  "Technology",
  "Math",
  "World",
  "Books",
] as const;

const CATEGORY_ALIASES: Record<string, string> = {
  general: "General Knowledge",
  "general knowledge": "General Knowledge",
  movies: "Movies",
  movie: "Movies",
  music: "Music",
  school: "Kids",
  kids: "Kids",
  world: "World",
  sports: "Sports",
  history: "History",
  science: "Science",
  geography: "Geography",
  animals: "Animals",
  technology: "Technology",
  computers: "Technology",
  math: "Math",
  maths: "Math",
  books: "Books",
};

export function normalizeCategory(category: string) {
  const trimmedCategory = category.trim();
  const alias = CATEGORY_ALIASES[trimmedCategory.toLowerCase()];

  return alias ?? trimmedCategory;
}

export function getLocalQuestions({
  category,
  difficulty,
  amount = 10,
}: {
  category: string;
  difficulty?: Difficulty;
  amount?: number;
}) {
  const normalizedCategory = normalizeCategory(category);
  const matchingQuestions = localQuestions.filter((question) => {
    const categoryMatches = question.category === normalizedCategory;
    const difficultyMatches = !difficulty || question.difficulty === difficulty;

    return categoryMatches && difficultyMatches;
  });

  const categoryFallback = localQuestions.filter(
    (question) => question.category === normalizedCategory
  );

  const safePool =
    matchingQuestions.length > 0
      ? matchingQuestions
      : categoryFallback.length > 0
        ? categoryFallback
        : localQuestions;

  return takeWithRepeat(shuffleQuestions(safePool), amount);
}

export function shuffleQuestions<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function takeWithRepeat(questions: QuizQuestion[], amount: number) {
  if (questions.length === 0) return [];

  const requestedAmount = Math.max(1, amount);
  const result: QuizQuestion[] = [];
  let round = 0;

  while (result.length < requestedAmount) {
    for (const question of shuffleQuestions(questions)) {
      if (result.length >= requestedAmount) break;

      result.push({
        ...question,
        id: round === 0 ? question.id : `${question.id}-repeat-${round}`,
      });
    }

    round += 1;
  }

  return result;
}
