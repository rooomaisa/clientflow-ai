import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CheckSquare, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Logo from '../ui/Logo'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
]

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SidebarNav({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent-gradient" />
              )}
              <Icon className={`h-4 w-4 ${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserCard({ user, onLogout }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-xs font-bold text-white">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
      <Button variant="secondary" className="mt-3 w-full gap-2" onClick={onLogout}>
        <LogOut className="h-3.5 w-3.5" />
        Log out
      </Button>
    </div>
  )
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-bg min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white/90 backdrop-blur-sm md:flex md:flex-col">
          <div className="border-b border-slate-200/80 px-5 py-5">
            <Logo />
          </div>
          <div className="flex flex-1 flex-col px-3 py-6">
            <SidebarNav />
            <div className="mt-auto px-1">
              <UserCard user={user} onLogout={logout} />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-50"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            <div
              className={`overflow-hidden border-t border-slate-200/80 transition-all duration-300 ${
                mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 py-4">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                <div className="mt-4">
                  <UserCard user={user} onLogout={logout} />
                </div>
              </div>
            </div>
          </header>

          <main key={location.pathname} className="flex-1 animate-fade-in px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
