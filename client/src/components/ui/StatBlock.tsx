interface Stat {
  value: string;
  label: string;
}

export function StatBlock({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 divide-x-2 divide-line border-y-2 border-line sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="px-4 py-6">
          <div className="font-serif text-4xl text-ink sm:text-5xl">{stat.value}</div>
          <div className="mt-1 font-mono text-meta text-ink-mute">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
