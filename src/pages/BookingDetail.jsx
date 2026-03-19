import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CalendarDays, MapPin, Users, FileText,
  AlertTriangle, CreditCard, Bell, Send, ChevronDown
} from 'lucide-react'
import { useApp } from '../data/store'
import { formatDate, formatCurrency, paymentStatusLabel, bookingStatusLabel, clientTypeLabel } from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentBadge from '../components/shared/PaymentBadge'
import AllergyDisplay from '../components/shared/AllergyDisplay'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'

const PAYMENT_STATUSES = [
  { value: 'unpaid',  label: 'Unpaid' },
  { value: 'partial', label: 'Deposit paid' },
  { value: 'paid',    label: 'Paid in full' },
  { value: 'overdue', label: 'Overdue' },
]

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBooking, getClient, getPaymentForBooking, updateBooking, updatePayment } = useApp()

  const booking = getBooking(id)
  const client = booking ? getClient(booking.clientId) : null
  const payment = booking ? getPaymentForBooking(id) : null

  const [showPaymentEdit, setShowPaymentEdit] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [newPayStatus, setNewPayStatus] = useState(payment?.status ?? 'unpaid')
  const [newAmountPaid, setNewAmountPaid] = useState(String(payment?.amountPaid ?? 0))

  if (!booking) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to bookings
        </button>
        <p className="text-gray-400">Booking not found.</p>
      </div>
    )
  }

  const hasAllergies = booking.guestAllergies?.some(g => g.items?.length > 0)
  const outstanding = payment ? (payment.totalAmount - payment.amountPaid) : booking.totalAmount

  function handleUpdatePayment(e) {
    e.preventDefault()
    if (payment) {
      updatePayment(payment.id, {
        status: newPayStatus,
        amountPaid: Number(newAmountPaid),
        paidDate: newPayStatus === 'paid' ? new Date().toISOString().split('T')[0] : payment.paidDate,
      })
    }
    updateBooking(id, { paymentStatus: newPayStatus })
    setShowPaymentEdit(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 w-fit">
        <ArrowLeft size={16} /> Bookings
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{booking.serviceType}</h1>
            <PaymentBadge status={booking.paymentStatus} />
            {booking.status === 'cancelled' && <Badge variant="red">Cancelled</Badge>}
          </div>
          <p className="text-sm text-gray-500">
            {client?.name} · {formatDate(booking.date)}{booking.time ? ` at ${booking.time}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowPaymentEdit(true)}>
            <CreditCard size={14} /> Update payment
          </Button>
        </div>
      </div>

      {/* Allergy banner */}
      {hasAllergies && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Allergy alert for this booking</p>
            <div className="mt-2">
              <AllergyDisplay allergies={booking.guestAllergies} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col — booking info */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-gray-900">Booking details</h3></CardHeader>
            <CardBody className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarDays size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Date & time</p>
                  <p className="text-sm text-gray-900 font-medium">{formatDate(booking.date)}</p>
                  {booking.time && <p className="text-xs text-gray-400">{booking.time}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Guests</p>
                  <p className="text-sm text-gray-900 font-medium">{booking.guests} people</p>
                </div>
              </div>
              {booking.location && (
                <div className="flex items-start gap-3 col-span-2">
                  <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{booking.location}</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {booking.menuNotes && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">Menu & notes</h3>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-700 leading-relaxed">{booking.menuNotes}</p>
              </CardBody>
            </Card>
          )}

          {booking.notes && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-gray-900">Internal notes</h3></CardHeader>
              <CardBody>
                <p className="text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right col — client + payment */}
        <div className="flex flex-col gap-5">
          {/* Client card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Client</h3>
              <button
                onClick={() => navigate(`/clients/${client?.id}`)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View profile
              </button>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-900">{client?.name}</p>
              {client?.email && <p className="text-xs text-gray-400">{client.email}</p>}
              {client?.phone && <p className="text-xs text-gray-400">{client.phone}</p>}
              {client?.type === 'retainer' && (
                <Badge variant="purple" className="self-start mt-1">Retainer client</Badge>
              )}
            </CardBody>
          </Card>

          {/* Payment card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
                <PaymentBadge status={booking.paymentStatus} />
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</span>
                </div>
                {booking.depositAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deposit</span>
                    <span className="text-gray-700">{formatCurrency(booking.depositAmount)}</span>
                  </div>
                )}
                {outstanding > 0 && (
                  <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                    <span className="text-gray-600 font-medium">Outstanding</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(outstanding)}</span>
                  </div>
                )}
              </div>

              {payment?.lineItems?.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Line items</p>
                  <div className="space-y-1.5">
                    {payment.lineItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="text-gray-700">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {outstanding > 0 && (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => { setReminderSent(true) }}
                    disabled={reminderSent}
                  >
                    <Bell size={13} />
                    {reminderSent ? 'Reminder sent' : 'Send reminder'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => { setQuoteSent(true) }}
                    disabled={quoteSent}
                  >
                    <Send size={13} />
                    {quoteSent ? 'Quote sent' : 'Send quote'}
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Update payment modal */}
      <Modal open={showPaymentEdit} onClose={() => setShowPaymentEdit(false)} title="Update Payment">
        <form onSubmit={handleUpdatePayment} className="flex flex-col gap-4">
          <Select
            label="Payment status"
            value={newPayStatus}
            onChange={e => setNewPayStatus(e.target.value)}
          >
            {PAYMENT_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
          <Input
            label="Amount paid (£)"
            type="number"
            value={newAmountPaid}
            onChange={e => setNewAmountPaid(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowPaymentEdit(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
