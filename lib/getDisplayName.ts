import type { User } from "@supabase/supabase-js";
import type { PlayerData } from "@/lib/storage";

export function getDisplayName(
  user: User | null | undefined,
  player?: PlayerData | null
) {
  return (
    player?.displayNameOverride ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest"
  );
}
