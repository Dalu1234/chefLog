import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, ChevronRight, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDateShort } from '../lib/utils'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { ClientTypeBadge } from '../components/shared/StatusBadge'
import NewClientModal from '../components/modals/NewClientModal'
import type { Client } from '../types'

type Filter = 'all' | 'retainer' | 'one-off'

function ClientRow({ client }: { client: Client }) {
  const navigate = useNavigate()
  const { bookings } = useApp()
  const nextBooking = bookings
    .filter(b => b.clientId === client.id && b.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div
      onClick={() => navigate(`/clients/${client.id}`)}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-100 cursor-pointer transition-colors"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #7C6BF0 0%, #A193FF 100%)' }}>
        {client.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[13px] font-semibold text-surface-800 truncate">{client.name}</p>
          <ClientTypeBadge type={client.type} />
        </div>
        <div className="flex items-center gap-3">
          {nextBooking
            ? <span className="text-[11px] font-medium text-surface-500">Next: {formatDateShort(nextBooking.date)}</span>
            : <span className="text-[11px] font-medium text-surface-400">No upcoming</span>
          }
          {client.type === 'retainer' && client.retainerAmount && (
            <span className="text-[11px] font-medium text-surface-500">{formatCurrency(client.retainerAmount)}/mo</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {(client.outstandingBalance ?? 0) > 0 && (
          <span className="text-[11px] font-semibold text-danger-600 bg-danger-50 px-2.5 py-0.5 rounded-lg tabular-nums">
            {formatCurrency(client.outstandingBalance!)} owed
          </span>
        )}
        <ChevronRight size={14} className="text-surface-400" />
      </div>
    </div>
  )
}

export default function Clients() {
  const { clients } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = clients.filter(c =>
    (filter === 'all' || c.type === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] text-surface-500 mt-0.5">{clients.length} total clients</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)}><Plus size={13} /> Add client</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" strokeWidth={2} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-300 rounded-xl text-[13px] placeholder:text-surface-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
        <div className="flex bg-white border border-surface-200 rounded-xl overflow-hidden self-start">
          {(['all', 'retainer', 'one-off'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[12px] font-semibold transition-all ${
                filter === f
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
              }`}>
              {f === 'one-off' ? 'One-off' : f === 'retainer' ? 'Retainer' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={18} />}
            title="No clients found"
            action={!search && <Button size="sm" onClick={() => setShowNew(true)}><Plus size={13} /> Add client</Button>}
          />
        ) : (
          <div className="divide-y divide-surface-100">
            {filtered.map(c => <ClientRow key={c.id} client={c} />)}
          </div>
        )}
      </Card>

      <NewClientModal open={showNew} onClose={() => setShowNew(false)} />
    </div>
  )
}
