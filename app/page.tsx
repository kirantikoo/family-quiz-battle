import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CategoryCard from "@/components/CategoryCard";
import AppHeader from "@/components/AppHeader";
import DailyRewardButton from "@/components/DailyRewardButton";
import UserCard from "@/components/UserCard";
import UserStats from "@/components/UserStats";
import { categories } from "@/data/categories";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#8B5CF6_0%,#312E81_32%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-5 sm:py-6 md:py-8">
        <AppHeader />

        <div className="mt-5 grid items-start gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <div className="space-y-5 sm:space-y-6">
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-5 shadow-2xl sm:rounded-[36px] sm:p-7 md:p-10">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 right-6 hidden text-9xl md:block">
                🏆
              </div>

              <div className="relative max-w-xl">
                <p className="text-sm font-black uppercase tracking-widest text-white/80 sm:text-lg sm:normal-case sm:tracking-normal">🔥 Daily Challenge</p>

                <h2 className="mt-3 text-3xl font-black leading-tight sm:mt-4 sm:text-4xl md:text-6xl">
                  Play Family Battle
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/90 sm:mt-4 sm:text-base">
                  Challenge your family, answer fun questions, earn XP, collect
                  coins and unlock badges.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
                  <Link
                    href="/play"
                    className="rounded-2xl bg-cyan-300 px-4 py-3 text-center text-sm font-black text-slate-950 shadow-xl transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-white sm:px-6 sm:py-4 sm:text-base"
                  >
                    Play Now
                  </Link>

                  <Link
                    href="/quiz?daily=true"
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-purple-700 shadow-xl transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white sm:px-6 sm:py-4 sm:text-base"
                  >
                    Daily
                  </Link>

                  <Link
                    href="/quiz"
                    className="rounded-2xl bg-white/15 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white sm:px-6 sm:py-4 sm:text-base"
                  >
                    Continue
                  </Link>

                  <Link
                    href="/rooms"
                    className="rounded-2xl bg-black/20 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white sm:px-6 sm:py-4 sm:text-base"
                  >
                    Rooms
                  </Link>

                  <Link
                    href="/profile"
                    className="col-span-2 rounded-2xl bg-black/20 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white sm:col-span-1 sm:px-6 sm:py-4 sm:text-base"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Popular Categories</h2>

                <Link
                  href="/play"
                  className="text-sm font-bold text-purple-200"
                >
                  View All
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {categories.slice(0, 6).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black">Live Rooms</h2>

              <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-2">
                <Link
                  href="/rooms"
                  className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:rounded-[28px] sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-black">Room #AB123</p>

                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black">
                      LIVE
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/60">6 / 8 Players</p>
                  <p className="mt-4 text-2xl">👦 👧 👨 👩</p>
                </Link>

                <Link
                  href="/rooms"
                  className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:rounded-[28px] sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-black">Room #XY456</p>

                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black">
                      LIVE
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/60">4 / 8 Players</p>
                  <p className="mt-4 text-2xl">👴 👵 🧒 👩</p>
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:pt-0">
            <UserCard />

            <div>
              <h2 className="text-xl font-black">Your Progress</h2>
              <UserStats />
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Keep Climbing</h2>

                <Link
                  href="/leaderboard"
                  className="text-sm font-bold text-purple-200"
                >
                  View
                </Link>
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <p className="font-black">Your weekly rank updates as you play.</p>
                <p className="mt-2 text-sm text-white/60">
                  Finish quizzes, keep your streak alive, and watch your XP grow.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black">Daily Rewards 🎁</h2>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {["⭐", "🪙", "🔥"].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/10 p-4 text-center text-3xl"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <DailyRewardButton />
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:rounded-[36px] sm:p-6">
              <h2 className="text-xl font-black">Coming Soon 🚀</h2>

              <div className="mt-4 space-y-3 text-sm text-white/80">
                <p>🎙️ Voice Assistant</p>
                <p>🤖 AI Daily Quiz</p>
                <p>👨‍👩‍👧 Family Team Battle</p>
                <p>🏅 Achievement Store</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
