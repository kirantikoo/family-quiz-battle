import Image from "next/image";

type Props = {
  icon: string;
  title: string;
  unlocked: boolean;
};

export default function BadgeCard({
  icon,
  title,
  unlocked,
}: Props) {
  return (
    <div
      className={`rounded-3xl p-5 text-center transition-all ${
        unlocked
          ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl"
          : "border border-slate-200/70 bg-white/80 text-slate-500 opacity-80 dark:border-white/10 dark:bg-white/10 dark:text-white/60"
      }`}
    >
      <Image
        src={icon}
        alt={title}
        width={64}
        height={64}
        className="mx-auto"
      />

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm">
        {unlocked ? "Unlocked" : "Locked"}
      </p>
    </div>
  );
}
