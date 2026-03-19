import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Bell, ChevronRight,
  UserPlus, CalendarDays, FileText, Users, TrendingUp, AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency, getGreeting, todayFormatted, daysUntil } from '../lib/utils'
import Button from '../components/ui/Button'
import { PaymentStripe } from '../components/shared/StatusBadge'
import NewClientModal from '../components/modals/NewClientModal'
import NewBookingModal from '../components/modals/NewBookingModal'
import QuoteModal from '../components/modals/QuoteModal'

export default function Dashboard() {
  const navigate = useNavigate()
  const { clients, bookings, payments, getClient } = useApp()
  const [showNewClient, setShowNewClient] = useState(false)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [reminded, setReminded] = useState<Set<string>>(new Set())

  const today = new Date()
  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const todayStr = today.toISOString().split('T')[0]

  const upcoming = bookings.filter(b => b.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const thisWeek = upcoming.filter(b => new Date(b.date) >= today && new Date(b.date) <= weekEnd).length
  const activeClients = clients.filter(c => c.active).length
  const monthRevenue = payments.filter(p => p.paidDate && new Date(p.paidDate) >= monthStart).reduce((s, p) => s + p.amountPaid, 0)
  const outstanding = payments.filter(p => p.status !== 'paid').sort((a, b) => {
    const o = { overdue: 0, unpaid: 1, partial: 2 }
    return (o[a.status as keyof typeof o] ?? 9) - (o[b.status as keyof typeof o] ?? 9)
  })
  const totalOutstanding = outstanding.reduce((s, p) => s + (p.totalAmount - p.amountPaid), 0)
  const hasDebt = totalOutstanding > 0
  const retainerCount = clients.filter(c => c.type === 'retainer').length

  return (
    <div className="flex flex-col gap-6">

      {/* Greeting + actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-surface-800">{getGreeting()}, Chef Alex</h2>
          <p className="text-[13px] text-surface-500">{todayFormatted()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowNewClient(true)}>
            <UserPlus size={13} /> Add client
          </Button>
          <Button size="sm" onClick={() => setShowNewBooking(true)}>
            <Plus size={13} /> New booking
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'This week',
            value: String(thisWeek),
            sub: 'bookings',
            icon: CalendarDays,
            iconBg: 'bg-brand-50',
            iconColor: 'text-brand-500',
          },
          {
            label: 'Active clients',
            value: String(activeClients),
            sub: `${retainerCount} on retainer`,
            icon: Users,
            iconBg: 'bg-brand-50',
            iconColor: 'text-brand-400',
          },
          {
            label: 'Revenue',
            value: formatCurrency(monthRevenue),
            sub: 'this month',
            icon: TrendingUp,
            iconBg: 'bg-success-50',
            iconColor: 'text-success-500',
            valueColor: undefined as string | undefined,
          },
          {
            label: 'Outstanding',
            value: formatCurrency(totalOutstanding),
            sub: `${outstanding.length} invoice${outstanding.length !== 1 ? 's' : ''}`,
            icon: AlertCircle,
            iconBg: hasDebt ? 'bg-danger-50' : 'bg-surface-200',
            iconColor: hasDebt ? 'text-danger-400' : 'text-surface-400',
            valueColor: hasDebt ? 'text-danger-600' : 'text-surface-400',
          },
        ].map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }) => (
          <div key={label} className="bg-white rounded-2xl border border-surface-200/80 shadow-card px-5 pt-5 pb-4 transition-all duration-200 hover:shadow-card-hover">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-surface-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <Icon size={14} className={iconColor} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-[26px] font-bold tracking-tight leading-none tabular-nums ${valueColor ?? 'text-surface-800'}`}>
              {value}
            </p>
            <p className="text-[11px] font-medium text-surface-500 mt-1.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/60">
            <p className="text-[13px] font-semibold text-surface-800">Upcoming bookings</p>
            <button onClick={() => navigate('/bookings')}
              className="flex items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-700 transition-colors">
              View all <ChevronRight size={12} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-[13px] font-medium text-surface-400">No upcoming bookings</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {upcoming.slice(0, 6).map(booking => {
                const client = getClient(booking.clientId)
                const days = daysUntil(booking.date)
                const isToday = booking.date === todayStr
                const isTomorrow = days === 1
                const d = new Date(booking.date)

                return (
                  <div key={booking.id}
                    className={`relative overflow-hidden flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                      isToday    ? 'bg-warning-50/40 hover:bg-warning-50/60' :
                      isTomorrow ? 'bg-success-50/30 hover:bg-success-50/50' :
                      'hover:bg-surface-100'
                    }`}
                    onClick={() => navigate(`/bookings/${booking.id}`)}>

                    <div className={`flex flex-col items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl ${
                      isToday ? 'bg-brand-500' : 'bg-surface-200'
                    }`}>
                      <span className={`text-[13px] font-bold leading-none ${isToday ? 'text-white' : 'text-surface-800'}`}>
                        {d.getDate()}
                      </span>
                      <span className={`text-[8px] font-bold uppercase leading-none mt-0.5 tracking-widest ${isToday ? 'text-white/60' : 'text-surface-500'}`}>
                        {d.toLocaleDateString('en', { month: 'short' })}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-surface-800 truncate">{client?.name}</p>
                      <p className="text-[11px] font-medium text-surface-500 truncate mt-0.5">
                        {booking.serviceType} · {booking.time}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pr-3">
                      {isToday ? (
                        <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg bg-warning-100 text-warning-700">Today</span>
                      ) : isTomorrow ? (
                        <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg bg-success-100 text-success-700">Tmrw</span>
                      ) : days !== null && days > 0 ? (
                        <span className="text-[11px] font-semibold text-surface-500">{days}d</span>
                      ) : null}
                    </div>

                    <PaymentStripe status={booking.paymentStatus} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Outstanding payments */}
        <div className="bg-white rounded-2xl border border-surface-200/80 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/60">
            <p className="text-[13px] font-semibold text-surface-800">Outstanding</p>
            {hasDebt && (
              <span className="text-[12px] font-bold text-danger-500 tabular-nums">{formatCurrency(totalOutstanding)}</span>
            )}
          </div>

          {outstanding.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-5 py-6">
              <div className="w-2 h-2 rounded-full bg-success-400" />
              <p className="text-[12px] font-semibold text-surface-500">All settled</p>
            </div>
          ) : (
            <div>
              <div className="divide-y divide-surface-100">
                {outstanding.slice(0, 4).map(p => {
                  const client = getClient(p.clientId)
                  const owed = p.totalAmount - p.amountPaid
                  const isReminded = reminded.has(p.id)
                  return (
                    <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-surface-800 truncate">{client?.name}</p>
                        <p className="text-[11px] font-medium text-surface-500 tabular-nums mt-0.5">{formatCurrency(owed)}</p>
                      </div>
                      <button
                        onClick={() => setReminded(prev => new Set([...prev, p.id]))}
                        disabled={isReminded}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex-shrink-0 active:scale-[0.97] ${
                          isReminded
                            ? 'bg-surface-200 text-surface-500'
                            : 'bg-coral-50 text-coral-600 hover:bg-coral-500 hover:text-white'
                        }`}>
                        <Bell size={10} />
                        {isReminded ? 'Sent' : 'Remind'}
                      </button>
                    </div>
                  )
                })}
              </div>
              <button onClick={() => navigate('/payments')}
                className="flex items-center gap-1 text-[12px] font-semibold text-brand-500 hover:text-brand-700 w-full px-5 py-3 border-t border-surface-200/60 transition-colors">
                All payments <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-surface-200/80 shadow-card overflow-hidden lg:col-span-3">
          <div className="px-5 py-4 border-b border-surface-200/60">
            <p className="text-[13px] font-semibold text-surface-800">Quick actions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-surface-100">
            {[
              { icon: UserPlus,     label: 'Add new client',   sub: 'Create a client profile',   onClick: () => setShowNewClient(true) },
              { icon: CalendarDays, label: 'Create booking',   sub: 'Schedule a new event',      onClick: () => setShowNewBooking(true) },
              { icon: FileText,     label: 'Send a quote',     sub: 'Preview and send pricing',  onClick: () => setShowQuote(true) },
            ].map(({ icon: Icon, label, sub, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex items-center gap-3 px-5 py-4 text-left w-full transition-all hover:bg-surface-100 group active:scale-[0.98]">
                <div className="w-9 h-9 rounded-xl bg-surface-200 group-hover:bg-brand-50 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon size={15} className="text-surface-500 group-hover:text-brand-500 transition-colors" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-surface-800 leading-tight">{label}</p>
                  <p className="text-[11px] text-surface-500 leading-tight mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={14} className="text-surface-400 flex-shrink-0 group-hover:text-surface-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <NewClientModal open={showNewClient} onClose={() => setShowNewClient(false)} />
      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} />
      <QuoteModal open={showQuote} onClose={() => setShowQuote(false)} onSend={() => {}} />
    </div>
  )
}
