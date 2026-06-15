import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/clients', label: 'Clients' },
  { to: '/tasks', label: 'Tasks' },
]

function SidebarNav({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `block rounded-xl px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-lg font-semibold text-slate-900">
              ClientFlow <span className="text-brand-600">AI</span>
            </p>
          </div>
          <div className="flex flex-1 flex-col px-4 py-6">
            <SidebarNav />
            <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <Button variant="secondary" className="mt-3 w-full" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white md:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-lg font-semibold text-slate-900">
                ClientFlow <span className="text-brand-600">AI</span>
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Menu
              </button>
            </div>
            {mobileOpen && (
              <div className="border-t border-slate-200 px-4 py-4">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <Button variant="secondary" className="mt-3 w-full" onClick={logout}>
                    Log out
                  </Button>
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
