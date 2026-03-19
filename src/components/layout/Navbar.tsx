import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, CreditCard, Settings } from 'lucide-react'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/clients',  label: 'Clients',   icon: Users },
  { to: '/bookings', label: 'Bookings',  icon: CalendarDays },
  { to: '/payments', label: 'Payments',  icon: CreditCard },
]

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 w-full flex items-center px-6 md:px-8 h-12 gap-8 flex-shrink-0"
      style={{ backgroundColor: '#111113', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-[22px] h-[22px] rounded-md bg-indigo-500 flex items-center justify-center shadow-sm">
          <UtensilsCrossed size={11} className="text-white" strokeWidth={2.2} />
        </div>
        <span className="text-[13px] font-semibold text-white tracking-tight">ChefLog</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-0.5 flex-1">
        {NAV.map(({ to, label, exact }) => (
          <NavLink key={to} to={to} end={exact}
            className={({ isActive }) => cn(
              'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150',
              isActive
                ? 'bg-white/[0.09] text-white'
                : 'text-[#6E6E7A] hover:text-[#B8B8C2] hover:bg-white/[0.04]'
            )}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right — settings + profile */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <NavLink to="/settings"
          className={({ isActive }) => cn(
            'p-1.5 rounded-lg transition-all duration-150',
            isActive
              ? 'text-white bg-white/[0.09]'
              : 'text-[#4E4E58] hover:text-[#8C8C96] hover:bg-white/[0.05]'
          )}>
          <Settings size={15} strokeWidth={1.8} />
        </NavLink>

        <div className="w-[1px] h-4 mx-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

        <div className="flex items-center gap-2 pl-0.5 cursor-pointer group">
          <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)' }}>
            A
          </div>
          <span className="text-[12px] font-medium hidden sm:block transition-colors"
            style={{ color: '#6E6E7A' }}>
            Chef Alex
          </span>
        </div>
      </div>
    </header>
  )
}
