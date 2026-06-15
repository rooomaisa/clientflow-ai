import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            ClientFlow <span className="text-brand-600">AI</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
      </div>
    </div>
  )
}
