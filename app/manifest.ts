import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Family Quiz Battle",
    short_name: "Quiz Battle",
    description:
      "Multiplayer family quiz game with live rooms, leaderboards and rewards.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#7C3AED",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}