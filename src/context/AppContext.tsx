import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Client, Booking, Payment, AppContextType } from '../types'
import { MOCK_CLIENTS, MOCK_BOOKINGS, MOCK_PAYMENTS } from '../data/mockData'

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS)
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS)

  function addClient(data: Omit<Client, 'id' | 'createdAt' | 'notes'>): Client {
    const client: Client = {
      ...data,
      id: `c${Date.now()}`,
      notes: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setClients(prev => [client, ...prev])
    return client
  }

  function updateClient(id: string, updates: Partial<Client>) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  function addClientNote(clientId: string, text: string) {
    const note = { id: `n${Date.now()}`, text, createdAt: new Date().toISOString().split('T')[0] }
    setClients(prev => prev.map(c =>
      c.id === clientId ? { ...c, notes: [note, ...c.notes] } : c
    ))
  }

  function addBooking(data: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const booking: Booking = {
      ...data,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setBookings(prev => [booking, ...prev])
    return booking
  }

  function updateBooking(id: string, updates: Partial<Booking>) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  function addPayment(data: Omit<Payment, 'id' | 'createdAt'>): Payment {
    const payment: Payment = {
      ...data,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setPayments(prev => [payment, ...prev])
    return payment
  }

  function updatePayment(id: string, updates: Partial<Payment>) {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  function getClient(id: string) { return clients.find(c => c.id === id) }
  function getBooking(id: string) { return bookings.find(b => b.id === id) }
  function getClientBookings(clientId: string) { return bookings.filter(b => b.clientId === clientId) }
  function getPaymentForBooking(bookingId: string) { return payments.find(p => p.bookingId === bookingId) }

  return (
    <AppContext.Provider value={{
      clients, bookings, payments,
      addClient, updateClient, addClientNote,
      addBooking, updateBooking,
      addPayment, updatePayment,
      getClient, getBooking, getClientBookings, getPaymentForBooking,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
