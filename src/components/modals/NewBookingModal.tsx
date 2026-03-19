import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import type { PaymentStatus } from '../../types'

interface AllergyRow { person: string; items: string }

export default function NewBookingModal({
  open,
  onClose,
  preselectedClientId,
}: {
  open: boolean
  onClose: () => void
  preselectedClientId?: string
}) {
  const { clients, addBooking, addPayment } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    clientId: preselectedClientId ?? '',
    date: '', time: '19:00', location: '',
    guestCount: '2', serviceType: '', menuNotes: '', internalNotes: '',
    paymentStatus: 'unpaid' as PaymentStatus,
    totalAmount: '', depositAmount: '',
  })
  const [allergyRows, setAllergyRows] = useState<AllergyRow[]>([{ person: '', items: '' }])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateAllergy(i: number, field: keyof AllergyRow, value: string) {
    setAllergyRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const guestAllergies = allergyRows
      .filter(r => r.person.trim())
      .map(r => ({
        person: r.person.trim(),
        items: r.items.split(',').map(s => s.trim()).filter(Boolean),
      }))

    const booking = addBooking({
      clientId: form.clientId,
      serviceType: form.serviceType,
      date: form.date,
      time: form.time,
      location: form.location,
      guestCount: Number(form.guestCount) || 2,
      status: 'upcoming',
      paymentStatus: form.paymentStatus,
      totalAmount: Number(form.totalAmount) || 0,
      depositAmount: Number(form.depositAmount) || 0,
      guestAllergies,
      menuNotes: form.menuNotes,
      internalNotes: form.internalNotes,
    })

    addPayment({
      bookingId: booking.id,
      clientId: form.clientId,
      description: `${form.serviceType} — ${form.date}`,
      totalAmount: Number(form.totalAmount) || 0,
      amountPaid: Number(form.depositAmount) || 0,
      status: form.paymentStatus,
      dueDate: form.date,
      paidDate: form.paymentStatus === 'paid' ? new Date().toISOString().split('T')[0] : null,
      lineItems: [],
    })

    onClose()
    navigate(`/bookings/${booking.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Booking" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Select label="Client *" value={form.clientId} onChange={e => set('clientId', e.target.value)} required>
          <option value="">Choose a client...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date *" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
          <Input label="Time" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Service type" value={form.serviceType} onChange={e => set('serviceType', e.target.value)} placeholder="Dinner Party, Retainer..." />
          <Input label="Guests" type="number" min="1" value={form.guestCount} onChange={e => set('guestCount', e.target.value)} />
        </div>

        <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Address or venue" />

        {/* Allergies */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-medium text-surface-600">Guest allergies</p>
            <button type="button" onClick={() => setAllergyRows(r => [...r, { person: '', items: '' }])}
              className="text-xs text-brand-500 hover:text-brand-700 flex items-center gap-1 font-medium">
              <Plus size={12} /> Add
            </button>
          </div>
          {allergyRows.map((row, i) => (
            <div key={i} className="grid grid-cols-[120px_1fr_auto] gap-2 items-start mb-2">
              <Input placeholder="Person" value={row.person} onChange={e => updateAllergy(i, 'person', e.target.value)} />
              <Input placeholder="Allergies, comma-separated" value={row.items} onChange={e => updateAllergy(i, 'items', e.target.value)} />
              {allergyRows.length > 1 && (
                <button type="button" onClick={() => setAllergyRows(r => r.filter((_, idx) => idx !== i))}
                  className="p-2 text-surface-400 hover:text-danger-500 transition-colors mt-0.5">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <Textarea label="Menu notes" value={form.menuNotes} onChange={e => set('menuNotes', e.target.value)} placeholder="Menu ideas, courses, special requirements..." rows={2} />
        <Textarea label="Internal notes" value={form.internalNotes} onChange={e => set('internalNotes', e.target.value)} placeholder="Logistics, timing, arrival notes..." rows={2} />

        {/* Payment */}
        <div className="border-t border-surface-200 pt-4">
          <p className="text-xs font-medium text-surface-600 mb-3">Payment</p>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Total" type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="1800" />
            <Input label="Deposit" type="number" value={form.depositAmount} onChange={e => set('depositAmount', e.target.value)} placeholder="600" />
            <Select label="Status" value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value as PaymentStatus)}>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Deposit paid</option>
              <option value="paid">Paid in full</option>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-surface-200">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth>Create Booking</Button>
        </div>
      </form>
    </Modal>
  )
}
