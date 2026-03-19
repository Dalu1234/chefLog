import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarDays, CreditCard, Settings, ChefHat, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/clients',  label: 'Clients',   icon: Users },
  { to: '/bookings', label: 'Bookings',  icon: CalendarDays },
  { to: '/payments', label: 'Payments',  icon: CreditCard },
  { to: '/settings', label: 'Settings',  icon: Settings },
]

function NavItem({ to, label, icon: Icon, exact, onClick }) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  )
}

// Desktop sidebar (always visible on md+)
export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 py-6 px-3 flex-shrink-0">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="bg-gray-900 text-white rounded-lg p-1.5">
          <ChefHat size={18} />
        </div>
        <span className="font-semibold text-gray-900 text-base">Chef Log</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.slice(0, -1).map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-auto">
        <NavItem {...NAV_ITEMS[NAV_ITEMS.length - 1]} />
      </div>
    </aside>
  )
}

// Mobile top bar + slide-over
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white rounded-lg p-1.5">
            <ChefHat size={16} />
          </div>
          <span className="font-semibold text-gray-900 text-sm">Chef Log</span>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl py-6 px-3 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-3 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="bg-gray-900 text-white rounded-lg p-1.5">
                  <ChefHat size={18} />
                </div>
                <span className="font-semibold text-gray-900">Chef Log</span>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_ITEMS.map(item => (
                <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
