import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarDays, CreditCard,
  Settings, UtensilsCrossed, X, Menu, HelpCircle, ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

const NAV_MAIN = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/bookings', label: 'Bookings',  icon: CalendarDays },
  { to: '/clients',  label: 'Clients',   icon: Users },
  { to: '/payments', label: 'Payments',  icon: CreditCard },
]

function NavItem({ to, label, icon: Icon, exact, onClick }: {
  to: string; label: string; icon: React.ElementType; exact?: boolean; onClick?: () => void
}) {
  return (
    <NavLink to={to} end={exact} onClick={onClick}
      className={({ isActive }) => cn(
        'flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-150',
        isActive
          ? 'bg-brand-50 text-brand-600 font-semibold'
          : 'text-surface-700 hover:bg-surface-100 hover:text-surface-800'
      )}>
      {({ isActive }) => (
        <>
          <Icon
            size={22} strokeWidth={isActive ? 2 : 1.6}
            className={cn(
              'flex-shrink-0 transition-colors',
              isActive ? 'text-brand-500' : 'text-surface-500'
            )}
          />
          {label}
        </>
      )}
    </NavLink>
  )
}

function SidebarInner({ onNav }: { onNav?: () => void }) {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed size={18} className="text-white" strokeWidth={2.2} />
        </div>
        <div>
          <span className="text-[18px] font-bold text-surface-800 tracking-tight leading-none block">ChefLog</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_MAIN.map(item => <NavItem key={item.to} {...item} onClick={onNav} />)}

        <div className="h-px bg-surface-200 my-5" />

        <NavItem to="/settings" label="Settings" icon={Settings} onClick={onNav} />

        {/* Help desk dropdown */}
        <button
          onClick={() => setHelpOpen(!helpOpen)}
          className={cn(
            'flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-150 w-full text-left',
            'text-surface-700 hover:bg-surface-100 hover:text-surface-800'
          )}
        >
          <HelpCircle size={22} strokeWidth={1.6} className="text-surface-500 flex-shrink-0" />
          <span className="flex-1">Help desk</span>
          <ChevronDown size={16} className={cn('text-surface-400 transition-transform', helpOpen && 'rotate-180')} />
        </button>
      </nav>

      {/* User profile */}
      <div className="pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:bg-surface-100">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7C6BF0 0%, #A193FF 100%)' }}>
            CA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-surface-800 leading-tight truncate">Chef Alex</p>
            <p className="text-[12px] text-surface-500 leading-tight truncate mt-0.5">Private Chef</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[280px] h-screen sticky top-0 flex-shrink-0 overflow-y-auto bg-white shadow-sidebar">
      <SidebarInner />
    </aside>
  )
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="md:hidden flex items-center justify-between px-5 py-3 sticky top-0 z-30 bg-white border-b border-surface-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <UtensilsCrossed size={16} className="text-white" strokeWidth={2.2} />
          </div>
          <span className="text-[16px] font-bold text-surface-800">ChefLog</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors">
          <Menu size={20} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-[300px] h-full overflow-y-auto bg-white shadow-elevated">
            <button onClick={() => setOpen(false)}
              className="absolute top-6 right-4 p-1.5 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-all">
              <X size={18} />
            </button>
            <SidebarInner onNav={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
