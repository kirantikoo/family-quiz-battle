export interface QuizHistory {
  score: number;
  xp: number;
  coins: number;
  category: string;
  date: string;
}

export interface PlayerData {
  avatar: string;
  avatarType: "emoji" | "image";
  customAvatarImage?: string;
  displayNameOverride?: string;
  xp: number;
  coins: number;
  level: number;
  streak: number;
  quizzesPlayed: number;
  achievements: string[];
  history: QuizHistory[];
  lastPlayedDate?: string;
  soundEnabled: boolean;
  theme: "dark" | "light";
  notificationsEnabled: boolean;
  lastResultId?: string;
}

const STORAGE_KEY = "family_quiz_player";

export function getPlayerData(): PlayerData {
  if (typeof window === "undefined") {
    return defaultPlayer();
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultPlayer();
  }

  try {
    const parsed = JSON.parse(saved);
    const migrated = migratePlayerData(parsed);
    savePlayerData(migrated);

    return migrated;
  } catch {
    return defaultPlayer();
  }
}

export function savePlayerData(data: PlayerData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function resetPlayerData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

function defaultPlayer(): PlayerData {
  return {
    avatar: "",
    avatarType: "emoji",
    customAvatarImage: "",
    displayNameOverride: "",
    xp: 0,
    coins: 0,
    level: 1,
    streak: 0,
    quizzesPlayed: 0,
    achievements: [],
    history: [],
    lastPlayedDate: "",
    soundEnabled: true,
    theme: "dark",
    notificationsEnabled: true,
    lastResultId: "",
  };
}

function migratePlayerData(value: unknown): PlayerData {
  const parsed =
    value && typeof value === "object"
      ? (value as Partial<PlayerData> & Record<string, unknown>)
      : {};
  const fallback = defaultPlayer();
  const avatar = typeof parsed.avatar === "string" ? parsed.avatar : "";
  const avatarType =
    parsed.avatarType === "image" || parsed.avatarType === "emoji"
      ? parsed.avatarType
      : avatar.startsWith("/") || avatar.startsWith("data:image/")
        ? "image"
        : "emoji";

  return {
    avatar,
    avatarType,
    customAvatarImage:
      typeof parsed.customAvatarImage === "string"
        ? parsed.customAvatarImage
        : fallback.customAvatarImage,
    displayNameOverride:
      typeof parsed.displayNameOverride === "string"
        ? parsed.displayNameOverride
        : fallback.displayNameOverride,
    xp: toNumber(parsed.xp, fallback.xp),
    coins: toNumber(parsed.coins, fallback.coins),
    level: Math.max(1, toNumber(parsed.level, fallback.level)),
    streak: toNumber(parsed.streak, fallback.streak),
    quizzesPlayed: toNumber(parsed.quizzesPlayed, fallback.quizzesPlayed),
    achievements: Array.isArray(parsed.achievements)
      ? parsed.achievements.filter(
          (item): item is string => typeof item === "string"
        )
      : fallback.achievements,
    history: Array.isArray(parsed.history)
      ? parsed.history
          .map(toQuizHistory)
          .filter((item): item is QuizHistory => item !== null)
      : fallback.history,
    lastPlayedDate:
      typeof parsed.lastPlayedDate === "string"
        ? parsed.lastPlayedDate
        : fallback.lastPlayedDate,
    soundEnabled:
      typeof parsed.soundEnabled === "boolean"
        ? parsed.soundEnabled
        : fallback.soundEnabled,
    theme:
      parsed.theme === "light" || parsed.theme === "dark"
        ? parsed.theme
        : fallback.theme,
    notificationsEnabled:
      typeof parsed.notificationsEnabled === "boolean"
        ? parsed.notificationsEnabled
        : fallback.notificationsEnabled,
    lastResultId:
      typeof parsed.lastResultId === "string"
        ? parsed.lastResultId
        : fallback.lastResultId,
  };
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toQuizHistory(value: unknown): QuizHistory | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<QuizHistory>;

  return {
    score: toNumber(item.score, 0),
    xp: toNumber(item.xp, 0),
    coins: toNumber(item.coins, 0),
    category: typeof item.category === "string" ? item.category : "quiz",
    date: typeof item.date === "string" ? item.date : "",
  };
}
