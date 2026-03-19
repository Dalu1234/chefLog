import { useState } from 'react'
import { Plus, Trash2, Send } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input } from '../ui/Input'
import { formatCurrency } from '../../lib/utils'

interface LineItemRow { label: string; amount: string }

export default function QuoteModal({
  open,
  onClose,
  onSend,
  clientName,
  initialLines,
}: {
  open: boolean
  onClose: () => void
  onSend: (lines: { label: string; amount: number }[]) => void
  clientName?: string
  initialLines?: { label: string; amount: number }[]
}) {
  const [lines, setLines] = useState<LineItemRow[]>(
    initialLines?.length
      ? initialLines.map(l => ({ label: l.label, amount: String(l.amount) }))
      : [
          { label: 'Chef service', amount: '' },
          { label: 'Ingredients & sourcing', amount: '' },
        ]
  )

  const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0)

  function updateLine(i: number, field: keyof LineItemRow, value: string) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const filtered = lines.filter(l => l.label.trim() && Number(l.amount) > 0)
    onSend(filtered.map(l => ({ label: l.label, amount: Number(l.amount) })))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Send Quote" subtitle={clientName ? `For ${clientName}` : undefined}>
      <form onSubmit={handleSend} className="flex flex-col gap-5">
        <p className="text-sm text-surface-500">
          Add line items below. The total will be shown on the quote sent to your client.
        </p>

        <div className="flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="flex-1">
                <Input placeholder="Service or item description" value={line.label} onChange={e => updateLine(i, 'label', e.target.value)} />
              </div>
              <div className="w-28 flex-shrink-0">
                <Input placeholder="Amount" type="number" value={line.amount} onChange={e => updateLine(i, 'amount', e.target.value)} />
              </div>
              {lines.length > 1 && (
                <button type="button" onClick={() => setLines(prev => prev.filter((_, idx) => idx !== i))}
                  className="p-2 text-surface-400 hover:text-danger-500 transition-colors mt-0.5">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button"
          onClick={() => setLines(prev => [...prev, { label: '', amount: '' }])}
          className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 font-medium self-start">
          <Plus size={12} /> Add line item
        </button>

        <div className="flex items-center justify-between bg-surface-100 rounded-xl border border-surface-200 px-4 py-3">
          <p className="text-sm font-medium text-surface-600">Total</p>
          <p className="text-xl font-semibold text-surface-800">{formatCurrency(total)}</p>
        </div>

        <div className="flex gap-3 pt-2 border-t border-surface-200">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="submit" fullWidth disabled={total === 0}>
            <Send size={13} /> Send Quote
          </Button>
        </div>
      </form>
    </Modal>
  )
}
