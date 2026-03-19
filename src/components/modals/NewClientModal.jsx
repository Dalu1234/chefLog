import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { useApp } from '../../data/store'
import { useNavigate } from 'react-router-dom'

const EMPTY_ALLERGY = { person: '', items: '' }

export default function NewClientModal({ open, onClose }) {
  const { addClient } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    type: 'one-off', retainerAmount: '', retainerFrequency: 'monthly',
    dietaryRestrictions: '', intolerances: '',
  })
  const [allergyRows, setAllergyRows] = useState([{ ...EMPTY_ALLERGY }])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addAllergyRow() { setAllergyRows(prev => [...prev, { ...EMPTY_ALLERGY }]) }
  function removeAllergyRow(i) { setAllergyRows(prev => prev.filter((_, idx) => idx !== i)) }
  function updateAllergyRow(i, field, value) {
    setAllergyRows(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const allergies = allergyRows
      .filter(r => r.person.trim())
      .map(r => ({
        person: r.person.trim(),
        items: r.items.split(',').map(s => s.trim()).filter(Boolean),
      }))

    const client = addClient({
      ...form,
      retainerAmount: form.retainerAmount ? Number(form.retainerAmount) : undefined,
      allergies,
      dietaryRestrictions: form.dietaryRestrictions.split(',').map(s => s.trim()).filter(Boolean),
      intolerances: form.intolerances.split(',').map(s => s.trim()).filter(Boolean),
      active: true,
    })
    onClose()
    navigate(`/clients/${client.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Client" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Full name / household name *" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Sofia Marchetti" required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="email@example.com" />
          <Input label="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+44 7700 900000" />
          <div className="sm:col-span-2">
            <Input label="Address" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="123 Example Street, London" />
          </div>
        </div>

        {/* Client type */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Client type</p>
          <div className="flex gap-3">
            {['one-off', 'retainer'].map(t => (
              <label key={t} className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-sm ${form.type === t ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => handleChange('type', t)} className="sr-only" />
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${form.type === t ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`} />
                {t === 'one-off' ? 'One-off bookings' : 'Monthly retainer'}
              </label>
            ))}
          </div>
        </div>

        {form.type === 'retainer' && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Retainer amount (£)" type="number" value={form.retainerAmount} onChange={e => handleChange('retainerAmount', e.target.value)} placeholder="3200" />
            <Select label="Frequency" value={form.retainerFrequency} onChange={e => handleChange('retainerFrequency', e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </Select>
          </div>
        )}

        {/* Allergies */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">Allergies (per person)</p>
            <button type="button" onClick={addAllergyRow} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus size={12} /> Add person
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {allergyRows.map((row, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input
                  placeholder="Person name"
                  value={row.person}
                  onChange={e => updateAllergyRow(i, 'person', e.target.value)}
                  className="flex-shrink-0 w-32"
                />
                <Input
                  placeholder="Allergies (comma-separated)"
                  value={row.items}
                  onChange={e => updateAllergyRow(i, 'items', e.target.value)}
                />
                {allergyRows.length > 1 && (
                  <button type="button" onClick={() => removeAllergyRow(i)} className="p-2 text-gray-400 hover:text-red-500 mt-0.5">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">e.g. person: "James", allergies: "Nuts, Shellfish"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Dietary restrictions" value={form.dietaryRestrictions} onChange={e => handleChange('dietaryRestrictions', e.target.value)} placeholder="Vegan, Halal, Kosher…" />
          <Input label="Intolerances" value={form.intolerances} onChange={e => handleChange('intolerances', e.target.value)} placeholder="Gluten (mild), Lactose…" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">Add Client</Button>
        </div>
      </form>
    </Modal>
  )
}
