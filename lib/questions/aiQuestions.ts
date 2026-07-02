import type { QuizQuestion } from "@/types";
import { getLocalQuestions } from "./localQuestions";

type Difficulty = QuizQuestion["difficulty"];

export async function getAiQuestions({
  category,
  difficulty,
  amount = 10,
}: {
  category: string;
  difficulty?: Difficulty;
  amount?: number;
}) {
  // TODO: Add AI-generated quizzes from a secure backend route only.
  // Never call OpenAI, Gemini, or any paid model directly from frontend code.
  // Future implementation must include moderation and kids-safe filtering
  // before returning generated questions to the client.
  return getLocalQuestions({
    category,
    difficulty,
    amount,
  });
}
