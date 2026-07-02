import type { QuizQuestion } from "@/types";
import {
  getLocalQuestions,
  normalizeCategory,
  shuffleQuestions,
} from "./localQuestions";

type Difficulty = QuizQuestion["difficulty"];

type OpenTriviaQuestion = {
  category: string;
  type: "multiple" | "boolean";
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type OpenTriviaResponse = {
  response_code: number;
  results: OpenTriviaQuestion[];
};

export const OPEN_TRIVIA_CATEGORIES: Record<string, number> = {
  "General Knowledge": 9,
  Books: 10,
  Movies: 11,
  Music: 12,
  Science: 17,
  Technology: 18,
  Computers: 18,
  Math: 19,
  Sports: 21,
  Geography: 22,
  History: 23,
  Animals: 27,
};

export async function getOpenTriviaQuestions({
  category,
  difficulty,
  amount = 10,
}: {
  category: string;
  difficulty?: Difficulty;
  amount?: number;
}): Promise<QuizQuestion[]> {
  const normalizedCategory = normalizeCategory(category);
  const categoryId = OPEN_TRIVIA_CATEGORIES[normalizedCategory];

  if (!categoryId) {
    return getLocalQuestions({
      category: normalizedCategory,
      difficulty,
      amount,
    });
  }

  const params = new URLSearchParams({
    amount: String(Math.max(1, Math.min(amount, 20))),
    type: "multiple",
  });

  params.set("category", String(categoryId));

  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  try {
    const response = await fetch(`https://opentdb.com/api.php?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Open Trivia DB request failed.");
    }

    const data = (await response.json()) as OpenTriviaResponse;

    if (data.response_code !== 0 || data.results.length === 0) {
      throw new Error("Open Trivia DB returned no questions.");
    }

    return data.results.map((question, index) =>
      mapOpenTriviaQuestion(question, normalizedCategory, index)
    );
  } catch {
    return getLocalQuestions({
      category: normalizedCategory,
      difficulty,
      amount,
    });
  }
}

function mapOpenTriviaQuestion(
  question: OpenTriviaQuestion,
  category: string,
  index: number
): QuizQuestion {
  const correctAnswer = decodeHtml(question.correct_answer);
  const incorrectAnswers = question.incorrect_answers.map(decodeHtml);

  return {
    id: `opentdb-${Date.now()}-${index}`,
    category,
    difficulty: question.difficulty,
    question: decodeHtml(question.question),
    options: shuffleQuestions([...incorrectAnswers, correctAnswer]),
    correctAnswer,
    source: "api",
  };
}

function decodeHtml(value: string) {
  const htmlEntities: Record<string, string> = {
    "&quot;": "\"",
    "&#039;": "'",
    "&apos;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&eacute;": "e",
    "&uuml;": "u",
    "&rsquo;": "'",
    "&lsquo;": "'",
    "&ldquo;": "\"",
    "&rdquo;": "\"",
    "&ndash;": "-",
    "&mdash;": "-",
  };

  return value.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    if (htmlEntities[entity]) return htmlEntities[entity];

    if (entity.startsWith("&#")) {
      const codePoint = Number(entity.replace(/[&#;]/g, ""));
      return Number.isFinite(codePoint) ? String.fromCharCode(codePoint) : entity;
    }

    return entity;
  });
}
