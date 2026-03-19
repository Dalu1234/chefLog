import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Plus, ChevronRight, Users, CalendarDays, FileText, CreditCard } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatCurrency } from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { PaymentBadge, PaymentStripe, ClientTypeBadge, DietaryBadge } from '../components/shared/StatusBadge'
import { AllergyAlertBanner, AllergyDisplay } from '../components/shared/AllergyDisplay'
import NewBookingModal from '../components/modals/NewBookingModal'
import { Textarea } from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'

type Tab = 'overview' | 'bookings' | 'notes'

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClient, getClientBookings, addClientNote } = useApp()

  const client = getClient(id!)
  const [tab, setTab] = useState<Tab>('overview')
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)

  if (!client) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800">
          <ArrowLeft size={14} /> Back to clients
        </button>
        <p className="text-surface-500">Client not found.</p>
      </div>
    )
  }

  const bookings = getClientBookings(id!).sort((a, b) => b.date.localeCompare(a.date))
  const allergyPersonCount = client.allergies.filter(a => a.items.length > 0).length

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteText.trim()) return
    addClientNote(id!, noteText.trim())
    setNoteText('')
    setShowNoteForm(false)
  }

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming')

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate('/clients')}
        className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 font-semibold transition-colors w-fit">
        <ArrowLeft size={13} strokeWidth={2.5} /> Clients
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-bold text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C6BF0 0%, #A193FF 100%)' }}>
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-xl font-semibold text-surface-800 tracking-tight">{client.name}</h1>
              <ClientTypeBadge type={client.type} />
              {client.type === 'retainer' && client.retainerAmount && (
                <Badge variant="amber">{formatCurrency(client.retainerAmount)}/{client.retainerFrequency}</Badge>
              )}
            </div>
            <p className="text-[11px] text-surface-500 font-medium">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowNewBooking(true)}>
          <Plus size={13} /> New Booking
        </Button>
      </div>

      {allergyPersonCount > 0 && <AllergyAlertBanner allergies={client.allergies} />}

      {/* Tabs */}
      <div className="flex bg-white border border-surface-200 rounded-xl overflow-hidden self-start">
        {(['overview', 'bookings', 'notes'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-[12px] font-semibold capitalize transition-all ${
              tab === t
                ? 'bg-brand-50 text-brand-600'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
            }`}
          >
            {t}
            {t === 'bookings' && (
              <span className="ml-1.5 text-[11px] opacity-60">({bookings.length})</span>
            )}
            {t === 'notes' && (
              <span className="ml-1.5 text-[11px] opacity-60">({client.notes.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><h3 className="text-[13px] font-semibold text-surface-800">Contact Info</h3></CardHeader>
            <CardBody className="flex flex-col gap-4">
              {client.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-surface-200 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                    <Mail size={13} className="text-surface-500 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <span className="text-[13px] text-surface-700 group-hover:text-brand-600 transition-colors">{client.email}</span>
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-surface-200 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                    <Phone size={13} className="text-surface-500 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <span className="text-[13px] text-surface-700 group-hover:text-brand-600 transition-colors">{client.phone}</span>
                </a>
              )}
              {client.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={13} className="text-surface-500" />
                  </div>
                  <span className="text-[13px] text-surface-700 leading-relaxed">{client.address}</span>
                </div>
              )}
              {client.householdSize && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-200 flex items-center justify-center flex-shrink-0">
                    <Users size={13} className="text-surface-500" />
                  </div>
                  <span className="text-[13px] text-surface-700">{client.householdSize} people in household</span>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="text-[13px] font-semibold text-surface-800">Dietary & Health</h3></CardHeader>
            <CardBody className="flex flex-col gap-4">
              {allergyPersonCount > 0 ? (
                <div>
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-2.5">Allergies</p>
                  <AllergyDisplay allergies={client.allergies} />
                </div>
              ) : (
                <p className="text-[13px] text-surface-500">No allergies recorded</p>
              )}
              {client.dietaryRestrictions.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-2">Dietary restrictions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {client.dietaryRestrictions.map((r, i) => <DietaryBadge key={i} item={r} />)}
                  </div>
                </div>
              )}
              {client.intolerances.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-2">Intolerances</p>
                  <div className="flex flex-wrap gap-1.5">
                    {client.intolerances.map((r, i) => <Badge key={i} variant="default">{r}</Badge>)}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {client.type === 'retainer' && client.retainerAmount && (
            <Card accent="brand" className="md:col-span-2">
              <CardBody>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.12em] mb-1.5">Retainer</p>
                    <p className="text-[28px] font-bold text-surface-800 tracking-tight tabular-nums">
                      {formatCurrency(client.retainerAmount)}
                      <span className="text-[13px] font-normal text-surface-500 ml-1.5">/{client.retainerFrequency}</span>
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[11px] text-surface-500 font-medium">Total bookings</p>
                      <p className="text-[22px] font-bold text-surface-800 mt-0.5 tabular-nums">{bookings.length}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-surface-500 font-medium">Outstanding</p>
                      <p className={`text-[22px] font-bold mt-0.5 tabular-nums ${(client.outstandingBalance ?? 0) > 0 ? 'text-danger-600' : 'text-surface-400'}`}>
                        {formatCurrency(client.outstandingBalance ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {upcomingBookings.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-surface-800">Upcoming</h3>
                  <button onClick={() => setTab('bookings')} className="text-[11px] text-brand-500 hover:text-brand-700 font-medium transition-colors">View all</button>
                </div>
              </CardHeader>
              <div className="divide-y divide-surface-100">
                {upcomingBookings.slice(0, 3).map(b => (
                  <div key={b.id}
                    className="relative overflow-hidden px-5 py-3 flex items-center justify-between hover:bg-surface-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/bookings/${b.id}`)}>
                    <div>
                      <p className="text-[13px] font-semibold text-surface-800">{b.serviceType}</p>
                      <p className="text-[11px] text-surface-500 font-medium">{formatDate(b.date)} · {b.guestCount} guests</p>
                    </div>
                    <PaymentStripe status={b.paymentStatus} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowNewBooking(true)}><Plus size={13} /> New Booking</Button>
          </div>
          <Card>
            {bookings.length === 0 ? (
              <EmptyState
                icon={<CalendarDays size={18} />}
                title="No bookings yet"
                description="Create the first booking for this client."
                action={<Button size="sm" onClick={() => setShowNewBooking(true)}><Plus size={13} /> New Booking</Button>}
              />
            ) : (
              <div className="divide-y divide-surface-100">
                {bookings.map(booking => (
                  <div key={booking.id}
                    className="relative overflow-hidden flex items-center justify-between px-5 py-3.5 hover:bg-surface-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/bookings/${booking.id}`)}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-surface-200">
                        <span className="text-[12px] font-bold leading-none text-surface-800">
                          {new Date(booking.date).getDate()}
                        </span>
                        <span className="text-[8px] font-bold uppercase leading-none mt-0.5 tracking-widest text-surface-500">
                          {new Date(booking.date).toLocaleDateString('en', { month: 'short' })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-surface-800 truncate">{booking.serviceType}</p>
                        <p className="text-[11px] text-surface-500 font-medium">{booking.guestCount} guests · {formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0 pr-3">
                      <ChevronRight size={14} className="text-surface-400" />
                    </div>
                    <PaymentStripe status={booking.paymentStatus} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Notes tab */}
      {tab === 'notes' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            {!showNoteForm && (
              <Button size="sm" onClick={() => setShowNoteForm(true)}><Plus size={13} /> Add Note</Button>
            )}
          </div>
          {showNoteForm && (
            <Card>
              <CardBody>
                <form onSubmit={handleAddNote} className="flex flex-col gap-3">
                  <Textarea
                    label="New note"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a preference, instruction, or memory about this client..."
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowNoteForm(false)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={!noteText.trim()}>Save Note</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
          {client.notes.length === 0 && !showNoteForm ? (
            <Card>
              <EmptyState
                icon={<FileText size={18} />}
                title="No notes yet"
                description="Jot down preferences, past menus, or special instructions."
                action={<Button size="sm" onClick={() => setShowNoteForm(true)}><Plus size={13} /> Add Note</Button>}
              />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {client.notes.map(note => (
                <Card key={note.id}>
                  <CardBody>
                    <p className="text-[13px] text-surface-700 leading-relaxed">{note.text}</p>
                    <p className="text-[11px] text-surface-500 font-medium mt-3">{formatDate(note.createdAt)}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} preselectedClientId={id} />
    </div>
  )
}
