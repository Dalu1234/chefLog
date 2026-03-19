import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, CalendarDays } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../lib/utils'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PaymentStripe } from '../components/shared/StatusBadge'
import NewBookingModal from '../components/modals/NewBookingModal'
import type { BookingStatus } from '../types'

type Filter = BookingStatus | 'all'

const TABS: { value: Filter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'past',      label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function Bookings() {
  const { bookings, getClient } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('upcoming')
  const [showNew, setShowNew] = useState(false)
  const todayStr = new Date().toISOString().split('T')[0]

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .sort((a, b) => filter === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))

  const count = (f: Filter) => f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between gap-4">
        <p className="text-[13px] text-surface-500">{bookings.length} total bookings</p>
        <Button size="sm" onClick={() => setShowNew(true)}><Plus size={13} /> New booking</Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-surface-200 rounded-xl overflow-hidden self-start">
        {TABS.map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-[12px] font-semibold transition-all ${
              filter === tab.value
                ? 'bg-brand-50 text-brand-600'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
            }`}>
            {tab.label}
            <span className="ml-1.5 text-[11px] opacity-60">{count(tab.value)}</span>
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={18} />}
            title="No bookings here"
            action={filter === 'upcoming' && (
              <Button size="sm" onClick={() => setShowNew(true)}><Plus size={13} /> New booking</Button>
            )}
          />
        ) : (
          <div className="divide-y divide-surface-100">
            {filtered.map(booking => {
              const client = getClient(booking.clientId)
              const isToday = booking.date === todayStr
              const d = new Date(booking.date)

              return (
                <div key={booking.id}
                  className="relative overflow-hidden flex items-center gap-4 px-5 py-3.5 hover:bg-surface-100 cursor-pointer transition-colors"
                  onClick={() => navigate(`/bookings/${booking.id}`)}>

                  <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${
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
                      {booking.serviceType} · {booking.time} · {booking.guestCount} guests
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 pr-3">
                    <span className="text-[13px] font-bold text-surface-700 hidden sm:block tabular-nums">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                    <ChevronRight size={14} className="text-surface-400" />
                  </div>
                  <PaymentStripe status={booking.paymentStatus} />
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <NewBookingModal open={showNew} onClose={() => setShowNew(false)} />
    </div>
  )
}
