import { Link } from 'react-router-dom'

export default function Logo({ className = '', asLink = true, variant = 'default' }) {
  const content = (
    <span
      className={`inline-flex items-center gap-2 font-display text-lg font-bold text-slate-900 ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient text-sm font-bold text-white shadow-sm">
        CF
      </span>
      ClientFlow <span className="accent-gradient-text">AI</span>
    </span>
  )

  if (asLink) {
    return <Link to="/">{content}</Link>
  }

  return content
}
