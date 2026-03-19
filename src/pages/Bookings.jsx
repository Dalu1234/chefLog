import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertTriangle, ChevronRight, CalendarDays } from 'lucide-react'
import { useApp } from '../data/store'
import { formatDate, formatCurrency, bookingStatusLabel } from '../lib/utils'
import { Card } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentBadge from '../components/shared/PaymentBadge'
import NewBookingModal from '../components/modals/NewBookingModal'

const STATUS_FILTERS = ['all', 'upcoming', 'past', 'cancelled']

export default function Bookings() {
  const { bookings, getClient } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('upcoming')
  const [showNew, setShowNew] = useState(false)

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .sort((a, b) => {
      if (filter === 'past') return b.date.localeCompare(a.date)
      return a.date.localeCompare(b.date)
    })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {bookings.filter(b => b.status === 'upcoming').length} upcoming
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={15} /> New Booking
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 self-start">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {f === 'all' ? 'All' : f}
            {f !== 'all' && (
              <span className={`ml-1.5 ${filter === f ? 'text-gray-300' : 'text-gray-400'}`}>
                ({bookings.filter(b => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <Card>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No {filter !== 'all' ? filter : ''} bookings</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Table header — desktop */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-2.5 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide rounded-t-xl">
              <span>Date / Time</span>
              <span>Client</span>
              <span>Service</span>
              <span>Guests</span>
              <span>Amount</span>
              <span>Payment</span>
            </div>

            {filtered.map(booking => {
              const client = getClient(booking.clientId)
              const hasAllergies = booking.guestAllergies?.some(g => g.items?.length > 0)
              const { label: statusLabel, variant } = bookingStatusLabel(booking.status)

              return (
                <div
                  key={booking.id}
                  className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-medium text-gray-900">{client?.name ?? 'Unknown'}</p>
                        {hasAllergies && <AlertTriangle size={13} className="text-orange-500" />}
                      </div>
                      <p className="text-xs text-gray-500">{booking.serviceType}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(booking.date)} · {booking.time} · {booking.guests} guests</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <PaymentBadge status={booking.paymentStatus} />
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</p>
                      <p className="text-xs text-gray-400">{booking.time}</p>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{client?.name ?? 'Unknown'}</p>
                      {hasAllergies && <AlertTriangle size={13} className="text-orange-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">{booking.serviceType}</p>
                    <p className="text-sm text-gray-600 text-center">{booking.guests}</p>
                    <p className="text-sm font-medium text-gray-900 text-right">{formatCurrency(booking.totalAmount)}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <PaymentBadge status={booking.paymentStatus} />
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
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
