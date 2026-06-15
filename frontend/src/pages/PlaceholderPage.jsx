export default function PlaceholderPage({ title, phase }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">This section is coming in Phase {phase}.</p>
    </div>
  )
}
