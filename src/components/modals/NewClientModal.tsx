import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

interface AllergyRow { person: string; items: string; notes: string }

const EMPTY_ALLERGY: AllergyRow = { person: '', items: '', notes: '' }

export default function NewClientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addClient } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', householdSize: '',
    type: 'one-off' as 'one-off' | 'retainer',
    retainerAmount: '', retainerFrequency: 'monthly' as 'monthly' | 'weekly',
    dietaryRestrictions: '', intolerances: '',
  })
  const [allergyRows, setAllergyRows] = useState<AllergyRow[]>([{ ...EMPTY_ALLERGY }])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateAllergy(i: number, field: keyof AllergyRow, value: string) {
    setAllergyRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allergies = allergyRows
      .filter(r => r.person.trim())
      .map(r => ({
        person: r.person.trim(),
        items: r.items.split(',').map(s => s.trim()).filter(Boolean),
        notes: r.notes.trim(),
      }))

    const client = addClient({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      householdSize: form.householdSize ? Number(form.householdSize) : undefined,
      type: form.type,
      retainerAmount: form.type === 'retainer' && form.retainerAmount ? Number(form.retainerAmount) : undefined,
      retainerFrequency: form.type === 'retainer' ? form.retainerFrequency : undefined,
      active: true,
      allergies,
      dietaryRestrictions: form.dietaryRestrictions.split(',').map(s => s.trim()).filter(Boolean),
      intolerances: form.intolerances.split(',').map(s => s.trim()).filter(Boolean),
      outstandingBalance: 0,
    })
    onClose()
    navigate(`/clients/${client.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Client" subtitle="Enter client details to get started" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full name / household name *"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Sofia Marchetti or The Henderson Family"
              required
            />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="client@email.com" />
          <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+44 7700 000000" />
          <div className="sm:col-span-2">
            <Input label="Address" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" />
          </div>
          <Input label="Household size" type="number" min="1" value={form.householdSize} onChange={e => set('householdSize', e.target.value)} placeholder="2" />
        </div>

        {/* Client type */}
        <div>
          <p className="text-xs font-medium text-surface-600 mb-2.5">Client type</p>
          <div className="grid grid-cols-2 gap-3">
            {(['one-off', 'retainer'] as const).map(t => (
              <label key={t}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                  form.type === t
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-surface-300 hover:border-surface-400 bg-white'
                }`}
              >
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => set('type', t)} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${form.type === t ? 'border-brand-500' : 'border-surface-400'}`}>
                  {form.type === t && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${form.type === t ? 'text-brand-700' : 'text-surface-700'}`}>
                    {t === 'one-off' ? 'One-off' : 'Retainer'}
                  </p>
                  <p className="text-[11px] text-surface-500">
                    {t === 'one-off' ? 'Individual bookings' : 'Monthly ongoing service'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {form.type === 'retainer' && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly amount" type="number" value={form.retainerAmount} onChange={e => set('retainerAmount', e.target.value)} placeholder="3200" />
            <Select label="Frequency" value={form.retainerFrequency} onChange={e => set('retainerFrequency', e.target.value as 'monthly' | 'weekly')}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </Select>
          </div>
        )}

        {/* Allergies */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-medium text-surface-600">Allergies per person</p>
            <button type="button" onClick={() => setAllergyRows(r => [...r, { ...EMPTY_ALLERGY }])}
              className="text-xs text-brand-500 hover:text-brand-700 flex items-center gap-1 font-medium">
              <Plus size={12} /> Add person
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {allergyRows.map((row, i) => (
              <div key={i} className="grid grid-cols-[120px_1fr_auto] gap-2 items-start">
                <Input placeholder="Person name" value={row.person} onChange={e => updateAllergy(i, 'person', e.target.value)} />
                <Input placeholder="Allergies (comma-separated)" value={row.items} onChange={e => updateAllergy(i, 'items', e.target.value)} />
                {allergyRows.length > 1 && (
                  <button type="button" onClick={() => setAllergyRows(r => r.filter((_, idx) => idx !== i))}
                    className="p-2 text-surface-400 hover:text-danger-500 transition-colors mt-0.5">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-surface-500 mt-1.5">e.g. Person: "James" — Allergies: "Lactose, Gluten"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Dietary restrictions" value={form.dietaryRestrictions} onChange={e => set('dietaryRestrictions', e.target.value)} placeholder="Vegan, Halal, Kosher..." hint="Comma-separated" />
          <Input label="Intolerances" value={form.intolerances} onChange={e => set('intolerances', e.target.value)} placeholder="Gluten (mild), Lactose..." hint="Comma-separated" />
        </div>

        <div className="flex gap-3 pt-2 border-t border-surface-200">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth>Add Client</Button>
        </div>
      </form>
    </Modal>
  )
}
