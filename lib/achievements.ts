import { PlayerData } from "./storage";

export function unlockAchievements(
  player: PlayerData
) {
  const achievements = [
    ...player.achievements,
  ];

  if (
    player.quizzesPlayed >= 1 &&
    !achievements.includes("first_quiz")
  ) {
    achievements.push("first_quiz");
  }

  if (
    player.quizzesPlayed >= 10 &&
    !achievements.includes("quiz_master")
  ) {
    achievements.push("quiz_master");
  }

  if (
    player.streak >= 7 &&
    !achievements.includes("week_streak")
  ) {
    achievements.push("week_streak");
  }

  return achievements;
}