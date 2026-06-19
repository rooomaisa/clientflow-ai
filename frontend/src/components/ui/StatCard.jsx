export default function StatCard({ label, value, hint, icon: Icon, accent = 'violet' }) {
  const accents = {
    violet: 'from-violet-500/10 to-violet-600/5 text-violet-600',
    orange: 'from-orange-500/10 to-orange-600/5 text-orange-600',
    brand: 'from-violet-500/10 to-violet-600/5 text-violet-600',
    blue: 'from-blue-500/10 to-blue-600/5 text-blue-600',
    amber: 'from-amber-500/10 to-amber-600/5 text-amber-600',
    slate: 'from-slate-500/10 to-slate-600/5 text-slate-600',
  }

  return (
    <article className="card-accent group relative p-5">
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition group-hover:opacity-100 ${accents[accent]}`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {Icon && (
            <div className={`rounded-lg bg-gradient-to-br p-2 ${accents[accent]}`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
    </article>
  )
}
