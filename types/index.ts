export interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

export interface Question {
  id: string;
  category: string;
  ageMode: "kids" | "family" | "adults";
  question: string;
  options: string[];
  answer: string;
  points: number;
  difficulty?: "easy" | "medium" | "hard";
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  xp: number;
  coins: number;
}