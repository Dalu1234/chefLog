import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Users, FileText, CreditCard, Bell, Send, ChefHat } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatCurrency } from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { PaymentBadge, ClientTypeBadge } from '../components/shared/StatusBadge'
import { AllergyAlertBanner } from '../components/shared/AllergyDisplay'
import Modal from '../components/ui/Modal'
import { Select, Input } from '../components/ui/Input'
import QuoteModal from '../components/modals/QuoteModal'
import type { PaymentStatus } from '../types'

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid',  label: 'Unpaid' },
  { value: 'partial', label: 'Deposit paid' },
  { value: 'paid',    label: 'Paid in full' },
  { value: 'overdue', label: 'Overdue' },
]

function DetailField({ icon: Icon, label, children }: {
  icon: React.ElementType; label: string; children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-surface-200 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-surface-500" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-0.5">{label}</p>
        <div className="text-[13px] text-surface-800 font-medium">{children}</div>
      </div>
    </div>
  )
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getBooking, getClient, getPaymentForBooking, updateBooking, updatePayment } = useApp()

  const booking = getBooking(id!)
  const client = booking ? getClient(booking.clientId) : null
  const payment = booking ? getPaymentForBooking(id!) : null

  const [showPayEdit, setShowPayEdit] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [reminderSent, setReminderSent] = useState(false)
  const [payStatus, setPayStatus] = useState<PaymentStatus>(payment?.status ?? 'unpaid')
  const [amountPaid, setAmountPaid] = useState(String(payment?.amountPaid ?? 0))

  if (!booking || !client) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800">
          <ArrowLeft size={14} /> Back to bookings
        </button>
        <p className="text-surface-500">Booking not found.</p>
      </div>
    )
  }

  const hasAllergies = booking.guestAllergies.some(a => a.items.length > 0)
  const outstanding = payment
    ? payment.totalAmount - payment.amountPaid
    : booking.totalAmount - booking.depositAmount

  function handleUpdatePayment(e: React.FormEvent) {
    e.preventDefault()
    const updates = {
      status: payStatus,
      amountPaid: Number(amountPaid),
      paidDate: payStatus === 'paid' ? new Date().toISOString().split('T')[0] : payment?.paidDate ?? null,
    }
    if (payment) updatePayment(payment.id, updates)
    updateBooking(id!, { paymentStatus: payStatus })
    setShowPayEdit(false)
  }

  function handleSendQuote(lines: { label: string; amount: number }[]) {
    if (payment) {
      const total = lines.reduce((s, l) => s + l.amount, 0)
      updatePayment(payment.id, { lineItems: lines, totalAmount: total || payment.totalAmount })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate('/bookings')}
        className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 font-semibold transition-colors w-fit">
        <ArrowLeft size={13} strokeWidth={2.5} /> Bookings
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h1 className="text-xl font-semibold text-surface-800 tracking-tight">{booking.serviceType}</h1>
            <PaymentBadge status={booking.paymentStatus} />
            {booking.status === 'cancelled' && <Badge variant="red">Cancelled</Badge>}
            {client.type === 'retainer' && <Badge variant="indigo">Retainer</Badge>}
          </div>
          <p className="text-[13px] text-surface-500 font-medium">
            {client.name} · {formatDate(booking.date)} at {booking.time}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowPayEdit(true)}>
          <CreditCard size={13} /> Update payment
        </Button>
      </div>

      {hasAllergies && <AllergyAlertBanner allergies={booking.guestAllergies} />}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-[13px] font-semibold text-surface-800">Booking Details</h3>
            </CardHeader>
            <CardBody className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <DetailField icon={CalendarDays} label="Date">
                <span>{formatDate(booking.date)}</span>
                <p className="text-[11px] text-surface-500 font-normal mt-0.5">{booking.time}</p>
              </DetailField>
              <DetailField icon={Users} label="Guests">
                {booking.guestCount} people
              </DetailField>
              {booking.location && (
                <DetailField icon={MapPin} label="Location">
                  <span className="font-normal text-surface-700 leading-relaxed">{booking.location}</span>
                </DetailField>
              )}
            </CardBody>
          </Card>

          {booking.menuNotes && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChefHat size={13} className="text-surface-500" strokeWidth={2} />
                  <h3 className="text-[13px] font-semibold text-surface-800">Menu & Service Notes</h3>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-[13px] text-surface-700 leading-relaxed">{booking.menuNotes}</p>
              </CardBody>
            </Card>
          )}

          {booking.internalNotes && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-surface-500" strokeWidth={2} />
                  <h3 className="text-[13px] font-semibold text-surface-800">Internal Notes</h3>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-[13px] text-surface-600 leading-relaxed">{booking.internalNotes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-surface-800">Client</h3>
                <button onClick={() => navigate(`/clients/${client.id}`)}
                  className="text-[11px] text-brand-500 hover:text-brand-700 font-semibold transition-colors">
                  View profile
                </button>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7C6BF0 0%, #A193FF 100%)' }}>
                  {client.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-surface-800 truncate">{client.name}</p>
                  <ClientTypeBadge type={client.type} />
                </div>
              </div>
              {client.email && <p className="text-[11px] text-surface-500 font-medium">{client.email}</p>}
              {client.phone && <p className="text-[11px] text-surface-500 font-medium">{client.phone}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-surface-800">Payment</h3>
                <PaymentBadge status={booking.paymentStatus} />
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-surface-600 font-medium">Total</span>
                  <span className="font-bold text-surface-800">{formatCurrency(booking.totalAmount)}</span>
                </div>
                {booking.depositAmount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-surface-600 font-medium">Deposit</span>
                    <span className="font-medium text-surface-600">{formatCurrency(booking.depositAmount)}</span>
                  </div>
                )}
                {outstanding > 0 && (
                  <div className="flex justify-between text-[13px] pt-2.5 border-t border-surface-200">
                    <span className="font-semibold text-surface-700">Outstanding</span>
                    <span className="font-bold text-danger-600">{formatCurrency(outstanding)}</span>
                  </div>
                )}
              </div>

              {payment?.lineItems && payment.lineItems.length > 0 && (
                <div className="border-t border-surface-200 pt-3">
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-2.5">Breakdown</p>
                  <div className="space-y-2">
                    {payment.lineItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-surface-600 font-medium">{item.label}</span>
                        <span className="font-semibold text-surface-700">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.status !== 'cancelled' && outstanding > 0 && (
                <div className="flex flex-col gap-2 border-t border-surface-200 pt-3">
                  <Button variant="coral" size="sm" fullWidth onClick={() => setReminderSent(true)} disabled={reminderSent}>
                    <Bell size={12} />
                    {reminderSent ? 'Reminder sent' : 'Send reminder'}
                  </Button>
                  <Button variant="ghost" size="sm" fullWidth onClick={() => setShowQuote(true)}>
                    <Send size={12} /> Send quote
                  </Button>
                </div>
              )}

              {outstanding === 0 && payment?.paidDate && (
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="w-4 h-4 rounded-full bg-success-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                  </div>
                  <p className="text-[11px] text-success-700 font-semibold">Paid {formatDate(payment.paidDate)}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal open={showPayEdit} onClose={() => setShowPayEdit(false)} title="Update Payment Status">
        <form onSubmit={handleUpdatePayment} className="flex flex-col gap-4">
          <Select label="Payment status" value={payStatus} onChange={e => setPayStatus(e.target.value as PaymentStatus)}>
            {PAYMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Input
            label="Amount paid"
            type="number"
            value={amountPaid}
            onChange={e => setAmountPaid(e.target.value)}
          />
          <div className="flex gap-3 pt-2 border-t border-surface-200">
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowPayEdit(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Save</Button>
          </div>
        </form>
      </Modal>

      <QuoteModal
        open={showQuote}
        onClose={() => setShowQuote(false)}
        onSend={handleSendQuote}
        clientName={client.name}
        initialLines={payment?.lineItems}
      />
    </div>
  )
}
