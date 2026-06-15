export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
