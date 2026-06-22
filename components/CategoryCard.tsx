import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/quiz?category=${category.id}`}
      className={`
        group relative flex min-h-[172px] cursor-pointer flex-col justify-between
        overflow-hidden rounded-[26px] ${category.gradient} p-3.5 shadow-2xl
        transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]
        active:scale-95 sm:min-h-[230px] sm:rounded-[32px] sm:p-5
      `}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-1 flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md sm:h-24 sm:w-24 sm:rounded-3xl">
          <Image
            src={category.icon}
            alt={category.name}
            width={80}
            height={80}
            className="h-12 w-12 object-contain drop-shadow-2xl sm:h-20 sm:w-20"
          />
        </div>

        <h3 className="mt-3 text-base font-black leading-tight text-white sm:mt-5 sm:text-2xl">
          {category.name}
        </h3>

        <p className="mt-1 text-xs font-bold text-white/80 sm:mt-2 sm:text-sm">1,500+ Questions</p>

        <div className="mt-3 rounded-full bg-white/20 px-3 py-2 text-[11px] font-black text-white sm:mt-4 sm:px-4 sm:text-sm">
          PLAY
        </div>
      </div>
    </Link>
  );
}
