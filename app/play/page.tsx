import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { categories } from "@/data/categories";

export default function PlayPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#7C3AED_0%,#312E81_35%,#0F172A_100%)] pb-44 text-white">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Back home" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black shadow-lg backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300">←</Link>
          <h1 className="text-base font-black sm:text-lg">Choose Category</h1>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-lg backdrop-blur" aria-hidden="true">🔍</span>
        </div>

        <h2 className="mt-6 text-lg font-black sm:mt-8 sm:text-xl">🔥 Trending Now</h2>

        <Link
          href="/quiz?daily=true"
          className="mt-4 block rounded-[30px] bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-5 shadow-2xl transition hover:-translate-y-1 sm:mt-6 sm:rounded-[36px] sm:p-8"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/80">
            🔥 Today Only
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Daily Challenge
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            Complete today’s special quiz and keep your streak alive.
          </p>

          <div className="mt-5 inline-block rounded-full bg-white px-5 py-3 text-sm font-black text-orange-600 shadow-lg sm:text-base">
            Start Challenge →
          </div>
        </Link>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/quiz?category=${category.id}`}
              className={`${category.gradient} block rounded-[26px] p-3.5 shadow-xl transition hover:-translate-y-1 active:scale-95 sm:rounded-[30px] sm:p-5`}
            >
              <div className="flex min-h-[150px] flex-col items-center justify-between text-center sm:min-h-[190px]">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="h-12 w-12 drop-shadow-xl sm:h-16 sm:w-16"
                />

                <div className="min-w-0">
                  <h2 className="text-base font-black leading-tight sm:text-2xl">{category.name}</h2>
                  <p className="text-xs font-bold text-white/90 sm:text-sm">
                    {1200 + index * 200}+ Questions
                  </p>
                  <p className="mt-1 hidden text-xs text-white/80 sm:block">
                    👨‍👩‍👧 {7 + index}.2K plays
                  </p>
                </div>

                <span className="text-2xl font-black sm:text-3xl">›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
