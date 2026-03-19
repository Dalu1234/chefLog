// ─── Core Entity Types ─────────────────────────────────────────────────────

export type ClientType = 'retainer' | 'one-off'

export type BookingStatus = 'upcoming' | 'past' | 'cancelled'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'

export interface AllergyEntry {
  person: string
  items: string[]
  notes?: string
}

export interface ClientNote {
  id: string
  text: string
  createdAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  householdSize?: number
  type: ClientType
  retainerAmount?: number
  retainerFrequency?: 'weekly' | 'monthly'
  active: boolean
  allergies: AllergyEntry[]
  dietaryRestrictions: string[]
  intolerances: string[]
  notes: ClientNote[]
  outstandingBalance?: number
  createdAt: string
}

export interface LineItem {
  label: string
  amount: number
}

export interface Booking {
  id: string
  clientId: string
  serviceType: string
  date: string
  time: string
  location: string
  guestCount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  depositAmount: number
  guestAllergies: AllergyEntry[]
  menuNotes: string
  internalNotes: string
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  clientId: string
  description: string
  totalAmount: number
  amountPaid: number
  status: PaymentStatus
  dueDate: string
  paidDate: string | null
  lineItems: LineItem[]
  createdAt: string
}

// ─── App Context Types ──────────────────────────────────────────────────────

export interface AppState {
  clients: Client[]
  bookings: Booking[]
  payments: Payment[]
}

export interface AppActions {
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'notes'>) => Client
  updateClient: (id: string, updates: Partial<Client>) => void
  addClientNote: (clientId: string, text: string) => void
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking
  updateBooking: (id: string, updates: Partial<Booking>) => void
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Payment
  updatePayment: (id: string, updates: Partial<Payment>) => void
  getClient: (id: string) => Client | undefined
  getBooking: (id: string) => Booking | undefined
  getClientBookings: (clientId: string) => Booking[]
  getPaymentForBooking: (bookingId: string) => Payment | undefined
}

export type AppContextType = AppState & AppActions
