import Logo from '../ui/Logo'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="app-bg relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-mesh-hero" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="page-header-title mt-8">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        </div>

        <div className="card-accent p-6 shadow-card-hover">{children}</div>
      </div>
    </div>
  )
}
