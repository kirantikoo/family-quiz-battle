import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({ children, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-[#6C5CE7] px-5 py-4 font-black text-white shadow-lg transition hover:bg-[#5b4ed1] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      {children}
    </button>
  );
}
