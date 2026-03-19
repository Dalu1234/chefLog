import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, MapPin, AlertTriangle, Plus,
  CalendarDays, Edit2, ChevronRight
} from 'lucide-react'
import { useApp } from '../data/store'
import {
  formatDate, formatCurrency, clientTypeLabel,
  paymentStatusLabel, bookingStatusLabel
} from '../lib/utils'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentBadge from '../components/shared/PaymentBadge'
import AllergyDisplay from '../components/shared/AllergyDisplay'
import Modal from '../components/ui/Modal'
import { Textarea } from '../components/ui/Input'
import NewBookingModal from '../components/modals/NewBookingModal'

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getClient, getClientBookings, addClientNote } = useApp()
  const client = getClient(id)

  const [tab, setTab] = useState('overview') // 'overview' | 'bookings' | 'notes'
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)

  if (!client) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to clients
        </button>
        <p className="text-gray-400">Client not found.</p>
      </div>
    )
  }

  const bookings = getClientBookings(id).sort((a, b) => b.date.localeCompare(a.date))
  const { label: typeLabel, variant: typeVariant } = clientTypeLabel(client.type)
  const allergyPersonCount = client.allergies?.filter(a => a.items?.length > 0).length ?? 0

  function handleAddNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return
    addClientNote(id, noteText.trim())
    setNoteText('')
    setShowNoteForm(false)
  }

  const TABS = ['overview', 'bookings', 'notes']

  return (
    <div className="flex flex-col gap-6">
      {/* Back + header */}
      <div>
        <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Clients
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">{client.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
                <Badge variant={typeVariant}>{typeLabel}</Badge>
                {client.type === 'retainer' && client.retainerAmount && (
                  <Badge variant="purple">£{client.retainerAmount.toLocaleString()}/{client.retainerFrequency}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-0.5">Client since {formatDate(client.createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowNewBooking(true)}>
              <Plus size={14} /> New Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Allergy alert banner */}
      {allergyPersonCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">Allergy alert — {allergyPersonCount} person{allergyPersonCount > 1 ? 's' : ''}</p>
            <div className="mt-1">
              <AllergyDisplay allergies={client.allergies} />
            </div>
            {(client.dietaryRestrictions?.length > 0 || client.intolerances?.length > 0) && (
              <p className="text-xs text-orange-700 mt-2">
                {client.dietaryRestrictions?.length > 0 && <span>Dietary: {client.dietaryRestrictions.join(', ')} </span>}
                {client.intolerances?.length > 0 && <span>· Intolerances: {client.intolerances.join(', ')}</span>}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              tab === t
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
            {t === 'bookings' && <span className="ml-1.5 text-xs text-gray-400">({bookings.length})</span>}
            {t === 'notes' && <span className="ml-1.5 text-xs text-gray-400">({client.notes?.length ?? 0})</span>}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-gray-900">Contact info</h3></CardHeader>
            <CardBody className="flex flex-col gap-3">
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${client.email}`} className="text-sm text-gray-700 hover:text-gray-900">{client.email}</a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${client.phone}`} className="text-sm text-gray-700 hover:text-gray-900">{client.phone}</a>
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{client.address}</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-gray-900">Health & dietary</h3></CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Allergies</p>
                <AllergyDisplay allergies={client.allergies} />
              </div>
              {client.dietaryRestrictions?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Dietary restrictions</p>
                  <div className="flex flex-wrap gap-1">
                    {client.dietaryRestrictions.map((r, i) => (
                      <Badge key={i} variant="blue">{r}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {client.intolerances?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Intolerances</p>
                  <div className="flex flex-wrap gap-1">
                    {client.intolerances.map((r, i) => (
                      <Badge key={i} variant="yellow">{r}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {client.type === 'retainer' && (
            <Card className="md:col-span-2">
              <CardHeader><h3 className="text-sm font-semibold text-gray-900">Retainer details</h3></CardHeader>
              <CardBody className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500">Monthly amount</p>
                  <p className="text-lg font-semibold text-gray-900 mt-0.5">{formatCurrency(client.retainerAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5 capitalize">{client.retainerFrequency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total bookings</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{bookings.length}</p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowNewBooking(true)} size="sm">
              <Plus size={14} /> New Booking
            </Button>
          </div>
          <Card>
            {bookings.length === 0 ? (
              <CardBody><p className="text-sm text-gray-400 text-center py-6">No bookings yet</p></CardBody>
            ) : (
              <div className="divide-y divide-gray-50">
                {bookings.map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.serviceType}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(booking.date)} · {booking.guests} guests</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <PaymentBadge status={booking.paymentStatus} />
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(booking.totalAmount)}</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
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
          {!showNoteForm ? (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowNoteForm(true)}>
                <Plus size={14} /> Add Note
              </Button>
            </div>
          ) : (
            <Card>
              <CardBody>
                <form onSubmit={handleAddNote} className="flex flex-col gap-3">
                  <Textarea
                    label="New note"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a note about this client…"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowNoteForm(false)}>Cancel</Button>
                    <Button type="submit" size="sm">Save Note</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
          {(client.notes?.length ?? 0) === 0 ? (
            <Card>
              <CardBody><p className="text-sm text-gray-400 text-center py-6">No notes yet</p></CardBody>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {client.notes.map(note => (
                <Card key={note.id}>
                  <CardBody>
                    <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(note.createdAt)}</p>
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
