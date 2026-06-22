import { getPlayerData } from "@/lib/storage";

export function playSound(src: string) {
  if (typeof window === "undefined") return;

  const player = getPlayerData();

  if (!player.soundEnabled) return;

  const audio = new Audio(src);
  audio.volume = 0.6;
  audio.play().catch(() => {});
}