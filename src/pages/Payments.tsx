import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, CreditCard, Send, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatCurrency } from '../lib/utils'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { PaymentStripe } from '../components/shared/StatusBadge'
import QuoteModal from '../components/modals/QuoteModal'
import type { PaymentStatus } from '../types'

type Filter = PaymentStatus | 'all'

const TABS: { value: Filter; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'unpaid',  label: 'Unpaid' },
  { value: 'partial', label: 'Deposit' },
  { value: 'paid',    label: 'Paid' },
]

export default function Payments() {
  const { payments, getClient, getBooking, updatePayment } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [showQuote, setShowQuote] = useState<string | null>(null)
  const [quoteSent, setQuoteSent] = useState<Set<string>>(new Set())

  const filtered = payments
    .filter(p => filter === 'all' || p.status === filter)
    .sort((a, b) => {
      const o: Record<PaymentStatus, number> = { overdue: 0, unpaid: 1, partial: 2, paid: 3 }
      return o[a.status] - o[b.status]
    })

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amountPaid, 0)
  const totalOwed    = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.totalAmount - p.amountPaid), 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + (p.totalAmount - p.amountPaid), 0)
  const count = (f: Filter) => f === 'all' ? payments.length : payments.filter(p => p.status === f).length

  const quotePayment = showQuote ? payments.find(p => p.id === showQuote) : null
  const quoteClient  = quotePayment ? getClient(quotePayment.clientId) : null

  return (
    <div className="flex flex-col gap-6">

      <p className="text-[13px] text-surface-500">{payments.length} total payments</p>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Received',    value: formatCurrency(totalPaid),    icon: CheckCircle2, iconCls: 'text-success-500', bgCls: 'bg-success-50', dim: false },
          { label: 'Outstanding', value: formatCurrency(totalOwed),    icon: TrendingUp,   iconCls: 'text-warning-500', bgCls: 'bg-warning-50', dim: totalOwed === 0 },
          { label: 'Overdue',     value: formatCurrency(totalOverdue), icon: AlertCircle,  iconCls: totalOverdue > 0 ? 'text-danger-500' : 'text-surface-400', bgCls: totalOverdue > 0 ? 'bg-danger-50' : 'bg-surface-200', dim: totalOverdue === 0 },
        ].map(({ label, value, icon: Icon, iconCls, bgCls, dim }) => (
          <div key={label} className="bg-white rounded-2xl border border-surface-200/80 shadow-card px-5 pt-5 pb-4 transition-all duration-200 hover:shadow-card-hover">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-surface-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bgCls}`}>
                <Icon size={14} className={iconCls} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-[24px] font-bold tracking-tight leading-none tabular-nums ${dim ? 'text-surface-400' : 'text-surface-800'}`}>
              {value}
            </p>
          </div>
        ))}
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

      {/* List */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<CreditCard size={18} />} title="No payments" />
        ) : (
          <div className="divide-y divide-surface-100">
            {filtered.map(payment => {
              const client  = getClient(payment.clientId)
              const booking = getBooking(payment.bookingId)
              const owed    = payment.totalAmount - payment.amountPaid
              const isReminded   = reminded.has(payment.id)
              const isQuoteSent  = quoteSent.has(payment.id)

              return (
                <div key={payment.id} className="relative overflow-hidden px-5 py-4">

                  <div className="flex items-center justify-between gap-4 mb-2 pr-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7C6BF0 0%, #A193FF 100%)' }}>
                        {client?.name.charAt(0) ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-surface-800 truncate">{client?.name}</p>
                        <p className="text-[11px] font-medium text-surface-500 truncate">{payment.description}</p>
                      </div>
                    </div>
                    <p className="text-[15px] font-bold text-surface-800 tabular-nums flex-shrink-0">{formatCurrency(payment.totalAmount)}</p>
                  </div>

                  <PaymentStripe status={payment.status} />

                  <div className="flex items-center gap-3 text-[11px] font-medium mb-3 flex-wrap">
                    {payment.dueDate && <span className="text-surface-500">Due {formatDate(payment.dueDate)}</span>}
                    {owed > 0 && payment.status !== 'paid' && (
                      <span className="text-danger-500 font-semibold tabular-nums">{formatCurrency(owed)} outstanding</span>
                    )}
                    {payment.paidDate && payment.status === 'paid' && (
                      <span className="text-success-600 font-semibold">Paid {formatDate(payment.paidDate)}</span>
                    )}
                  </div>

                  {payment.lineItems.length > 0 && (
                    <div className="bg-surface-100 rounded-xl px-4 py-3 mb-3 space-y-1.5">
                      {payment.lineItems.map((item, i) => (
                        <div key={i} className="flex justify-between text-[12px]">
                          <span className="font-medium text-surface-600">{item.label}</span>
                          <span className="font-semibold text-surface-700 tabular-nums">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {payment.status !== 'paid' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setReminded(prev => new Set([...prev, payment.id]))}
                        disabled={isReminded}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                          isReminded ? 'text-surface-500 bg-surface-200' : 'text-white bg-coral-500 hover:bg-coral-600'
                        }`}>
                        <Bell size={10} /> {isReminded ? 'Sent' : 'Send reminder'}
                      </button>
                      <button
                        onClick={() => setShowQuote(payment.id)}
                        disabled={isQuoteSent}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          isQuoteSent
                            ? 'border-surface-200 text-surface-500'
                            : 'border-surface-300 text-surface-600 hover:border-surface-400'
                        }`}>
                        <Send size={10} /> {isQuoteSent ? 'Quote sent' : 'Send quote'}
                      </button>
                      {booking && (
                        <button onClick={() => navigate(`/bookings/${booking.id}`)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-brand-500 hover:text-brand-700 ml-auto transition-colors">
                          Booking <ChevronRight size={10} />
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

      <QuoteModal
        open={!!showQuote} onClose={() => setShowQuote(null)}
        onSend={(lines) => {
          if (!showQuote) return
          const total = lines.reduce((s, l) => s + l.amount, 0)
          updatePayment(showQuote, { lineItems: lines, totalAmount: total || undefined })
          setQuoteSent(prev => new Set([...prev, showQuote]))
        }}
        clientName={quoteClient?.name}
        initialLines={quotePayment?.lineItems}
      />
    </div>
  )
}
