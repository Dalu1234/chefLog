import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Send, ChevronRight, Plus, CreditCard } from 'lucide-react'
import { useApp } from '../data/store'
import { formatDate, formatCurrency, paymentStatusLabel } from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentBadge from '../components/shared/PaymentBadge'
import Modal from '../components/ui/Modal'
import { Input, Textarea, Select } from '../components/ui/Input'

const STATUS_TABS = ['all', 'unpaid', 'overdue', 'partial', 'paid']

export default function Payments() {
  const { payments, getClient, getBooking, updatePayment } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [reminderSent, setReminderSent] = useState({})
  const [showQuote, setShowQuote] = useState(null) // payment id

  // Quote form state
  const [quoteLines, setQuoteLines] = useState([{ label: '', amount: '' }])
  const [quoteSentIds, setQuoteSentIds] = useState({})

  const filtered = payments
    .filter(p => filter === 'all' || p.status === filter)
    .sort((a, b) => {
      // overdue first, then by due date
      const order = { overdue: 0, unpaid: 1, partial: 2, paid: 3 }
      return (order[a.status] ?? 9) - (order[b.status] ?? 9)
    })

  // Stats
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amountPaid, 0)
  const totalUnpaid = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.totalAmount - p.amountPaid), 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.totalAmount - p.amountPaid), 0)

  function handleSendReminder(paymentId) {
    setReminderSent(prev => ({ ...prev, [paymentId]: true }))
  }

  function openQuoteModal(paymentId) {
    setQuoteLines([{ label: '', amount: '' }])
    setShowQuote(paymentId)
  }

  function addQuoteLine() { setQuoteLines(prev => [...prev, { label: '', amount: '' }]) }
  function removeQuoteLine(i) { setQuoteLines(prev => prev.filter((_, idx) => idx !== i)) }
  function updateQuoteLine(i, field, value) {
    setQuoteLines(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  function handleSendQuote(e) {
    e.preventDefault()
    const lines = quoteLines.filter(l => l.label.trim())
    const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0)
    updatePayment(showQuote, {
      lineItems: lines.map(l => ({ label: l.label, amount: Number(l.amount) || 0 })),
      totalAmount: total || undefined,
    })
    setQuoteSentIds(prev => ({ ...prev, [showQuote]: true }))
    setShowQuote(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{payments.length} invoices total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Received</p>
            <p className="text-xl font-semibold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Outstanding</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{formatCurrency(totalUnpaid)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Overdue</p>
            <p className={`text-xl font-semibold mt-1 ${totalOverdue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {formatCurrency(totalOverdue)}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 self-start flex-wrap">
        {STATUS_TABS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {f === 'all' ? 'All' : f === 'partial' ? 'Deposit paid' : f}
            {f !== 'all' && (
              <span className={`ml-1 ${filter === f ? 'text-gray-300' : 'text-gray-400'}`}>
                ({payments.filter(p => p.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Payments list */}
      <Card>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CreditCard size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No payments in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(payment => {
              const client = getClient(payment.clientId)
              const booking = getBooking(payment.bookingId)
              const outstanding = payment.totalAmount - payment.amountPaid
              const sent = reminderSent[payment.id]
              const qSent = quoteSentIds[payment.id]

              return (
                <div key={payment.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{client?.name}</p>
                        <PaymentBadge status={payment.status} />
                      </div>
                      <p className="text-xs text-gray-500 truncate">{payment.description}</p>
                      {payment.dueDate && (
                        <p className="text-xs text-gray-400 mt-0.5">Due: {formatDate(payment.dueDate)}</p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.totalAmount)}</p>
                      {outstanding > 0 && payment.status !== 'paid' && (
                        <p className="text-xs text-orange-600 mt-0.5">{formatCurrency(outstanding)} outstanding</p>
                      )}
                      {payment.paidDate && payment.status === 'paid' && (
                        <p className="text-xs text-green-600 mt-0.5">Paid {formatDate(payment.paidDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Line items preview */}
                  {payment.lineItems?.length > 0 && (
                    <div className="mt-2 ml-0 flex flex-wrap gap-2">
                      {payment.lineItems.map((item, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                          {item.label} — {formatCurrency(item.amount)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {payment.status !== 'paid' && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => handleSendReminder(payment.id)}
                        disabled={sent}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                          sent
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        <Bell size={12} />
                        {sent ? 'Reminder sent' : 'Send reminder'}
                      </button>
                      <button
                        onClick={() => openQuoteModal(payment.id)}
                        disabled={qSent}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                          qSent
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Send size={12} />
                        {qSent ? 'Quote sent' : 'Send quote'}
                      </button>
                      {booking && (
                        <button
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 ml-auto"
                        >
                          View booking <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Send quote modal */}
      <Modal open={!!showQuote} onClose={() => setShowQuote(null)} title="Send Quote">
        <form onSubmit={handleSendQuote} className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Add line items for the quote. The total will be calculated automatically.
          </p>
          <div className="flex flex-col gap-2">
            {quoteLines.map((line, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input
                  placeholder="Description"
                  value={line.label}
                  onChange={e => updateQuoteLine(i, 'label', e.target.value)}
                />
                <Input
                  placeholder="£"
                  type="number"
                  value={line.amount}
                  onChange={e => updateQuoteLine(i, 'amount', e.target.value)}
                  className="w-24 flex-shrink-0"
                />
                {quoteLines.length > 1 && (
                  <button type="button" onClick={() => removeQuoteLine(i)} className="p-2 text-gray-400 hover:text-red-500 mt-0.5 text-sm">✕</button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addQuoteLine}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start"
          >
            <Plus size={12} /> Add line item
          </button>
          <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>{formatCurrency(quoteLines.reduce((s, l) => s + (Number(l.amount) || 0), 0))}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowQuote(null)}>Cancel</Button>
            <Button type="submit" className="flex-1">
              <Send size={14} /> Send Quote
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
