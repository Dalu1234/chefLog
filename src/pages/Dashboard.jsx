import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays, Users, CreditCard, TrendingUp,
  Plus, Bell, ChevronRight, AlertTriangle, ArrowRight
} from 'lucide-react'
import { useApp } from '../data/store'
import { formatDate, formatCurrency, paymentStatusLabel, bookingStatusLabel, daysUntil } from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentBadge from '../components/shared/PaymentBadge'
import Modal from '../components/ui/Modal'
import NewClientModal from '../components/modals/NewClientModal'
import NewBookingModal from '../components/modals/NewBookingModal'
import clsx from 'clsx'

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={clsx('p-2.5 rounded-xl', color)}>
          <Icon size={20} className="text-white" />
        </div>
      </CardBody>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { clients, bookings, payments, getClient } = useApp()
  const [showNewClient, setShowNewClient] = useState(false)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [reminderSent, setReminderSent] = useState({})

  // Stats
  const today = new Date()
  const weekFromNow = new Date(); weekFromNow.setDate(today.getDate() + 7)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const upcomingBookings = bookings
    .filter(b => b.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))

  const thisWeekBookings = upcomingBookings.filter(b => {
    const d = new Date(b.date)
    return d >= today && d <= weekFromNow
  })

  const monthRevenue = payments
    .filter(p => p.paidDate && new Date(p.paidDate) >= monthStart)
    .reduce((sum, p) => sum + p.amountPaid, 0)

  const activeClients = clients.filter(c => c.active).length

  const unpaidPayments = payments.filter(p => p.status === 'unpaid' || p.status === 'partial' || p.status === 'overdue')
  const totalOutstanding = unpaidPayments.reduce((sum, p) => sum + (p.totalAmount - p.amountPaid), 0)

  function handleSendReminder(paymentId) {
    setReminderSent(prev => ({ ...prev, [paymentId]: true }))
    // TODO: integrate with email/WhatsApp
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowNewClient(true)}>
            <Plus size={15} /> New Client
          </Button>
          <Button onClick={() => setShowNewBooking(true)}>
            <Plus size={15} /> New Booking
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="This week"
          value={thisWeekBookings.length}
          sub={thisWeekBookings.length === 1 ? 'booking' : 'bookings'}
          icon={CalendarDays}
          color="bg-blue-500"
        />
        <StatCard
          label="Active clients"
          value={activeClients}
          sub={`${clients.filter(c => c.type === 'retainer').length} on retainer`}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          label="Revenue this month"
          value={formatCurrency(monthRevenue)}
          sub="payments received"
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(totalOutstanding)}
          sub={`${unpaidPayments.length} invoice${unpaidPayments.length !== 1 ? 's' : ''}`}
          icon={CreditCard}
          color={totalOutstanding > 0 ? 'bg-orange-500' : 'bg-gray-400'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Bookings</h2>
              <button
                onClick={() => navigate('/bookings')}
                className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </button>
            </CardHeader>
            <div className="divide-y divide-gray-50">
              {upcomingBookings.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-gray-400 text-center py-4">No upcoming bookings</p>
                </CardBody>
              ) : upcomingBookings.slice(0, 5).map(booking => {
                const client = getClient(booking.clientId)
                const days = daysUntil(booking.date)
                const hasAllergies = booking.guestAllergies?.some(g => g.items?.length > 0)
                return (
                  <div
                    key={booking.id}
                    className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-center flex-shrink-0 w-10">
                        <p className="text-xs font-semibold text-gray-900">
                          {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {new Date(booking.date).toLocaleDateString('en-GB', { month: 'short' })}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{client?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-gray-400 truncate">{booking.serviceType} · {booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasAllergies && (
                        <span title="Allergy alert">
                          <AlertTriangle size={14} className="text-orange-500" />
                        </span>
                      )}
                      <PaymentBadge status={booking.paymentStatus} />
                      <span className="text-xs text-gray-400">
                        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days}d`}
                      </span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Outstanding balances */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Outstanding Balances</h2>
            </CardHeader>
            <div className="divide-y divide-gray-50">
              {unpaidPayments.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-gray-400 text-center py-4">All paid up</p>
                </CardBody>
              ) : unpaidPayments.map(payment => {
                const client = getClient(payment.clientId)
                const outstanding = payment.totalAmount - payment.amountPaid
                const sent = reminderSent[payment.id]
                return (
                  <div key={payment.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{client?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{payment.description}</p>
                      </div>
                      <PaymentBadge status={payment.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(outstanding)}</p>
                      <button
                        onClick={() => handleSendReminder(payment.id)}
                        disabled={sent}
                        className={clsx(
                          'flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors',
                          sent
                            ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                            : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        )}
                      >
                        <Bell size={11} />
                        {sent ? 'Sent' : 'Remind'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            {unpaidPayments.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100">
                <button
                  onClick={() => navigate('/payments')}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  Manage all payments <ArrowRight size={13} />
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modals */}
      <NewClientModal open={showNewClient} onClose={() => setShowNewClient(false)} />
      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} />
    </div>
  )
}
