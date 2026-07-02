import type { QuizQuestion } from "@/types";
import { getAiQuestions } from "./aiQuestions";
import { getLocalQuestions } from "./localQuestions";
import { getOpenTriviaQuestions } from "./openTrivia";

export type QuestionSource = QuizQuestion["source"];

type Difficulty = QuizQuestion["difficulty"];

export async function getQuestions({
  category,
  difficulty,
  amount = 10,
  source = "local",
}: {
  category: string;
  difficulty?: Difficulty;
  amount?: number;
  source?: QuestionSource;
}): Promise<QuizQuestion[]> {
  if (source === "local") {
    return getLocalQuestions({ category, difficulty, amount });
  }

  if (source === "ai") {
    return getAiQuestions({ category, difficulty, amount });
  }

  const apiQuestions = await getOpenTriviaQuestions({
    category,
    difficulty,
    amount,
  });

  if (apiQuestions.length === 0) {
    return getLocalQuestions({ category, difficulty, amount });
  }

  return apiQuestions;
}
