import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Quiz Battle",
  description: "A fun multiplayer quiz game for kids, adults and families.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("family_quiz_theme");
                  var player = localStorage.getItem("family_quiz_player");
                  if ((theme !== "light" && theme !== "dark") && player) {
                    theme = JSON.parse(player).theme;
                  }
                  if (theme !== "light" && theme !== "dark") theme = "dark";
                  document.documentElement.classList.toggle("dark", theme === "dark");
                  document.documentElement.dataset.theme = theme;
                  localStorage.setItem("family_quiz_theme", theme);
                } catch (error) {
                  document.documentElement.classList.add("dark");
                  document.documentElement.dataset.theme = "dark";
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <div className="sticky top-0 z-[900] bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-5">
            <div className="mx-auto max-w-6xl">
              <AppHeader />
            </div>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
