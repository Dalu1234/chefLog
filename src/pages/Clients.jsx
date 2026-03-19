import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, AlertTriangle, ChevronRight } from 'lucide-react'
import { useApp } from '../data/store'
import { clientTypeLabel } from '../lib/utils'
import { Card } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import NewClientModal from '../components/modals/NewClientModal'

export default function Clients() {
  const { clients } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'retainer' | 'one-off'
  const [showNew, setShowNew] = useState(false)

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.type === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clients.length} client{clients.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={15} /> New Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 self-start">
          {['all', 'retainer', 'one-off'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f === 'all' ? 'All' : f === 'retainer' ? 'Retainers' : 'One-off'}
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <Card>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No clients found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(client => {
              const { label, variant } = clientTypeLabel(client.type)
              const allergyCount = client.allergies?.filter(a => a.items?.length > 0).length ?? 0
              const allAllergyItems = client.allergies?.flatMap(a => a.items ?? []) ?? []
              return (
                <div
                  key={client.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors gap-4"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        <Badge variant={variant}>{label}</Badge>
                        {client.type === 'retainer' && client.retainerAmount && (
                          <span className="text-xs text-gray-400">£{client.retainerAmount.toLocaleString()}/mo</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-gray-400 truncate">{client.email}</p>
                        {allergyCount > 0 && (
                          <span className="flex items-center gap-1 text-xs text-orange-600">
                            <AlertTriangle size={11} />
                            {allAllergyItems.slice(0, 2).join(', ')}
                            {allAllergyItems.length > 2 && ` +${allAllergyItems.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <NewClientModal open={showNew} onClose={() => setShowNew(false)} />
    </div>
  )
}
