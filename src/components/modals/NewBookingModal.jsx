import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { useApp } from '../../data/store'
import { useNavigate } from 'react-router-dom'

export default function NewBookingModal({ open, onClose, preselectedClientId }) {
  const { clients, addBooking, addPayment } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    clientId: preselectedClientId ?? '',
    date: '', time: '', location: '',
    guests: 2, serviceType: '', menuNotes: '', notes: '',
    paymentStatus: 'unpaid', totalAmount: '', depositAmount: '',
  })
  const [allergyRows, setAllergyRows] = useState([{ person: '', items: '' }])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addAllergyRow() { setAllergyRows(prev => [...prev, { person: '', items: '' }]) }
  function removeAllergyRow(i) { setAllergyRows(prev => prev.filter((_, idx) => idx !== i)) }
  function updateAllergyRow(i, field, value) {
    setAllergyRows(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const guestAllergies = allergyRows
      .filter(r => r.person.trim())
      .map(r => ({
        person: r.person.trim(),
        items: r.items.split(',').map(s => s.trim()).filter(Boolean),
      }))

    const booking = addBooking({
      ...form,
      guests: Number(form.guests),
      totalAmount: Number(form.totalAmount) || 0,
      depositAmount: Number(form.depositAmount) || 0,
      status: 'upcoming',
      guestAllergies,
    })

    // Create associated payment record
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

  const selectedClient = clients.find(c => c.id === form.clientId)

  return (
    <Modal open={open} onClose={onClose} title="New Booking" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Client *"
          value={form.clientId}
          onChange={e => handleChange('clientId', e.target.value)}
          required
        >
          <option value="">Select a client…</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date *" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required />
          <Input label="Time" type="time" value={form.time} onChange={e => handleChange('time', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Service type" value={form.serviceType} onChange={e => handleChange('serviceType', e.target.value)} placeholder="Dinner Party, Retainer…" />
          <Input label="No. of guests" type="number" min="1" value={form.guests} onChange={e => handleChange('guests', e.target.value)} />
        </div>

        <Input label="Location" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="Address or venue" />

        {/* Guest allergies for this booking */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">Guest allergies</p>
            <button type="button" onClick={addAllergyRow} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {allergyRows.map((row, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input placeholder="Person" value={row.person} onChange={e => updateAllergyRow(i, 'person', e.target.value)} className="w-28 flex-shrink-0" />
                <Input placeholder="Allergies (comma-separated)" value={row.items} onChange={e => updateAllergyRow(i, 'items', e.target.value)} />
                {allergyRows.length > 1 && (
                  <button type="button" onClick={() => removeAllergyRow(i)} className="p-2 text-gray-400 hover:text-red-500 mt-0.5">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Textarea label="Menu / notes" value={form.menuNotes} onChange={e => handleChange('menuNotes', e.target.value)} placeholder="Menu ideas, special requests…" rows={2} />

        {/* Payment */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Payment</p>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total amount (£)" type="number" value={form.totalAmount} onChange={e => handleChange('totalAmount', e.target.value)} placeholder="1500" />
            <Input label="Deposit amount (£)" type="number" value={form.depositAmount} onChange={e => handleChange('depositAmount', e.target.value)} placeholder="500" />
          </div>
          <div className="mt-3">
            <Select label="Payment status" value={form.paymentStatus} onChange={e => handleChange('paymentStatus', e.target.value)}>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Deposit paid</option>
              <option value="paid">Paid in full</option>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Create Booking</Button>
        </div>
      </form>
    </Modal>
  )
}
