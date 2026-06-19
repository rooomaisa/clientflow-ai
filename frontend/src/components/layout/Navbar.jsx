import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

export default function Navbar({ variant = 'default' }) {
  const isLanding = variant === 'landing'

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo variant={variant} />

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-slate-900">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Log in
          </Link>
          <Link to="/register" className="landing-btn px-4 py-2">
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
