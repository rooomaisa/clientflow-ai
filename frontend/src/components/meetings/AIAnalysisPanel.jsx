import Badge from '../ui/Badge'

function formatLabel(value) {
  if (!value) return 'Unknown'
  return value.charAt(0) + value.slice(1).toLowerCase()
}

export default function AIAnalysisPanel({ analysis }) {
  if (!analysis) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">AI analysis</h2>
        <Badge tone="emerald">{formatLabel(analysis.sentiment)} sentiment</Badge>
        <Badge tone="amber">{analysis.priority} priority</Badge>
      </div>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Summary</h3>
        <p className="mt-2 text-slate-700">{analysis.summary}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Key points</h3>
          {analysis.keyPoints?.length ? (
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {analysis.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No key points returned.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Action items</h3>
          <p className="mt-1 text-xs text-slate-500">These were also saved as tasks automatically.</p>
          {analysis.actionItems?.length ? (
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {analysis.actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No action items returned.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Follow-up email draft</h3>
        <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {analysis.followUpEmail}
        </pre>
      </section>
    </div>
  )
}
