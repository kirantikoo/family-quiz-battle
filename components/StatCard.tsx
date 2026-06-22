type Props = {
  label: string;
  value: string | number;
  icon: string;
};

export default function StatCard({ label, value, icon }: Props) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-sm text-white/60">{label}</p>
      <h3 className="text-xl font-black text-white">{value}</h3>
    </div>
  );
}