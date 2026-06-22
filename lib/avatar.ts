import type { User } from "@supabase/supabase-js";
import type { PlayerData } from "@/lib/storage";

export const DEFAULT_AVATAR = "/icon-avatar.png";

export function getGoogleAvatar(user: User | null | undefined) {
  return (
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture ||
    ""
  );
}

export function getResolvedAvatar(
  player: PlayerData | null | undefined,
  user: User | null | undefined
) {
  if (player?.customAvatarImage) {
    return player.customAvatarImage;
  }

  if (player?.avatarType === "image" && player.avatar) {
    return player.avatar;
  }

  return getGoogleAvatar(user) || DEFAULT_AVATAR;
}
