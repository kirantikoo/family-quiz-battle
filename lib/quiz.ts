import { questions } from "@/data/questions";
import type { Question } from "@/types";

export function getQuestionsByCategory(
  categoryId: string
): Question[] {
  return questions.filter(
    (question) => question.category === categoryId
  );
}

export function getQuestionsByMode(
  ageMode: "kids" | "family" | "adults"
): Question[] {
  return questions.filter(
    (question) => question.ageMode === ageMode
  );
}

export function getQuestionsByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): Question[] {
  return questions.filter(
    (question) => question.difficulty === difficulty
  );
}

export function getQuestions(
  categoryId: string,
  ageMode?: "kids" | "family" | "adults",
  difficulty?: "easy" | "medium" | "hard"
): Question[] {
  return questions.filter((question) => {
    const categoryMatch =
      question.category === categoryId;

    const ageMatch =
      !ageMode || question.ageMode === ageMode;

    const difficultyMatch =
      !difficulty ||
      question.difficulty === difficulty;

    return (
      categoryMatch &&
      ageMatch &&
      difficultyMatch
    );
  });
}

export function shuffleQuestions(
  quizQuestions: Question[]
): Question[] {
  return [...quizQuestions].sort(
    () => Math.random() - 0.5
  );
}

export function getRandomQuestions(
  categoryId: string,
  count = 10
): Question[] {
  return shuffleQuestions(
    getQuestionsByCategory(categoryId)
  ).slice(0, count);
}

export function calculateRewards(
  score: number
) {
  return {
    xp: score * 5,
    coins: score * 2,
    levelProgress: Math.floor(score / 10),
  };
}

export function checkAnswer(
  selectedAnswer: string,
  correctAnswer: string
) {
  return selectedAnswer === correctAnswer;
}