type Props = {
  label: string;
  value: string | number;
  icon: string;
};

export default function StatCard({ label, value, icon }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 text-slate-900 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:text-white dark:shadow-black/20">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-sm text-slate-500 dark:text-white/60">{label}</p>
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{value}</h3>
    </div>
  );
}
