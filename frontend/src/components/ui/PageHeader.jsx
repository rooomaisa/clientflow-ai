export default function PageHeader({ label, title, description, children }) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {label && <p className="page-header-label">{label}</p>}
        <h1 className={`page-header-title ${label ? 'mt-1' : ''}`}>{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-slate-600">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
    </section>
  )
}
