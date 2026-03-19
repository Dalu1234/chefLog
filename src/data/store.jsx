// In-memory store with seed data. Replace with API calls when backend is ready.
import { createContext, useContext, useState } from 'react'

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const SEED_CLIENTS = [
  {
    id: 'c1',
    name: 'Amara & James Osei',
    email: 'amara.osei@email.com',
    phone: '+44 7700 900123',
    address: '14 Kensington Gardens, London W8',
    type: 'retainer', // 'one-off' | 'retainer'
    retainerAmount: 3200,
    retainerFrequency: 'monthly',
    active: true,
    allergies: [
      { person: 'Amara', items: ['Tree nuts', 'Shellfish'] },
      { person: 'James', items: ['Lactose'] },
    ],
    dietaryRestrictions: ['Halal'],
    intolerances: ['Gluten (mild)'],
    notes: [
      { id: 'n1', text: 'Prefer West African inspired menus. James loves jollof rice.', createdAt: '2025-11-10' },
      { id: 'n2', text: 'Sent welcome gift basket Dec 2025.', createdAt: '2025-12-01' },
    ],
    createdAt: '2025-09-15',
  },
  {
    id: 'c2',
    name: 'Sofia Marchetti',
    email: 'sofia.m@outlook.com',
    phone: '+44 7911 123456',
    address: '8 Chelsea Embankment, London SW3',
    type: 'one-off',
    active: true,
    allergies: [
      { person: 'Sofia', items: ['Peanuts'] },
    ],
    dietaryRestrictions: ['Vegetarian'],
    intolerances: [],
    notes: [
      { id: 'n3', text: 'Loves Italian classics. Prefers light starters.', createdAt: '2026-01-05' },
    ],
    createdAt: '2026-01-05',
  },
  {
    id: 'c3',
    name: 'The Henderson Family',
    email: 'tom.henderson@gmail.com',
    phone: '+44 7800 555999',
    address: '22 Richmond Hill, Surrey TW10',
    type: 'retainer',
    retainerAmount: 4500,
    retainerFrequency: 'monthly',
    active: true,
    allergies: [
      { person: 'Tom', items: [] },
      { person: 'Claire', items: ['Eggs'] },
      { person: 'Lily (age 8)', items: ['Peanuts', 'Tree nuts'] },
      { person: 'Ben (age 5)', items: [] },
    ],
    dietaryRestrictions: [],
    intolerances: ['Tom: Lactose (mild)'],
    notes: [
      { id: 'n4', text: 'Kids prefer simple meals. Claire enjoys seafood.', createdAt: '2025-10-20' },
    ],
    createdAt: '2025-10-01',
  },
  {
    id: 'c4',
    name: 'Priya Kapoor',
    email: 'priya.kapoor@kapoorhomes.co.uk',
    phone: '+44 7722 334455',
    address: '5 Mayfair Square, London W1',
    type: 'one-off',
    active: true,
    allergies: [
      { person: 'Priya', items: ['Shellfish'] },
    ],
    dietaryRestrictions: ['Vegan'],
    intolerances: [],
    notes: [],
    createdAt: '2026-02-14',
  },
]

export const SEED_BOOKINGS = [
  {
    id: 'b1',
    clientId: 'c1',
    date: '2026-03-20',
    time: '19:00',
    location: '14 Kensington Gardens, London W8',
    guests: 6,
    status: 'upcoming',
    paymentStatus: 'deposit_paid',
    totalAmount: 1800,
    depositAmount: 600,
    serviceType: 'Dinner Party',
    menuNotes: '3-course West African fusion. Starter: pepper soup. Main: jollof rice with lamb. Dessert: hibiscus panna cotta.',
    guestAllergies: [
      { person: 'Amara', items: ['Tree nuts', 'Shellfish'] },
      { person: 'James', items: ['Lactose'] },
      { person: 'Guest 3 (TBC)', items: [] },
    ],
    notes: 'Client wants candle centrepieces. Confirm dietary with guests by 18 March.',
    createdAt: '2026-03-01',
  },
  {
    id: 'b2',
    clientId: 'c3',
    date: '2026-03-18',
    time: '18:30',
    location: '22 Richmond Hill, Surrey TW10',
    guests: 4,
    status: 'upcoming',
    paymentStatus: 'unpaid',
    totalAmount: 4500,
    depositAmount: 0,
    serviceType: 'Monthly Retainer — March',
    menuNotes: 'Weekly meal prep: Mon, Wed, Fri. Kid-friendly meals for the week.',
    guestAllergies: [
      { person: 'Claire', items: ['Eggs'] },
      { person: 'Lily (age 8)', items: ['Peanuts', 'Tree nuts'] },
    ],
    notes: 'Invoice for March retainer. Due 1st March.',
    createdAt: '2026-03-01',
  },
  {
    id: 'b3',
    clientId: 'c2',
    date: '2026-03-25',
    time: '20:00',
    location: '8 Chelsea Embankment, London SW3',
    guests: 2,
    status: 'upcoming',
    paymentStatus: 'paid',
    totalAmount: 650,
    depositAmount: 650,
    serviceType: 'Romantic Dinner',
    menuNotes: 'Italian 4-course. Peanut-free throughout. Vegetarian.',
    guestAllergies: [
      { person: 'Sofia', items: ['Peanuts'] },
    ],
    notes: '',
    createdAt: '2026-03-10',
  },
  {
    id: 'b4',
    clientId: 'c1',
    date: '2026-02-14',
    time: '19:30',
    location: '14 Kensington Gardens, London W8',
    guests: 2,
    status: 'past',
    paymentStatus: 'paid',
    totalAmount: 1200,
    depositAmount: 400,
    serviceType: "Valentine's Dinner",
    menuNotes: 'Intimate 5-course. Nut-free, shellfish-free, lactose-free options.',
    guestAllergies: [
      { person: 'Amara', items: ['Tree nuts', 'Shellfish'] },
      { person: 'James', items: ['Lactose'] },
    ],
    notes: 'Went very well. Client left 5-star review.',
    createdAt: '2026-01-20',
  },
  {
    id: 'b5',
    clientId: 'c4',
    date: '2026-03-28',
    time: '19:00',
    location: '5 Mayfair Square, London W1',
    guests: 8,
    status: 'upcoming',
    paymentStatus: 'unpaid',
    totalAmount: 2400,
    depositAmount: 0,
    serviceType: 'Private Dinner Party',
    menuNotes: 'Vegan tasting menu. No shellfish in kitchen.',
    guestAllergies: [
      { person: 'Priya', items: ['Shellfish'] },
      { person: 'Guests', items: ['TBC — awaiting confirmation'] },
    ],
    notes: 'Send quote and request deposit by 20 March.',
    createdAt: '2026-03-12',
  },
  {
    id: 'b6',
    clientId: 'c3',
    date: '2026-02-01',
    time: '18:30',
    location: '22 Richmond Hill, Surrey TW10',
    guests: 4,
    status: 'past',
    paymentStatus: 'paid',
    totalAmount: 4500,
    depositAmount: 0,
    serviceType: 'Monthly Retainer — February',
    menuNotes: 'Weekly meal prep for family.',
    guestAllergies: [
      { person: 'Claire', items: ['Eggs'] },
      { person: 'Lily (age 8)', items: ['Peanuts', 'Tree nuts'] },
    ],
    notes: '',
    createdAt: '2026-02-01',
  },
]

export const SEED_PAYMENTS = [
  {
    id: 'p1',
    bookingId: 'b1',
    clientId: 'c1',
    description: 'Dinner Party — 20 Mar 2026',
    totalAmount: 1800,
    amountPaid: 600,
    status: 'partial', // 'paid' | 'unpaid' | 'partial' | 'overdue'
    dueDate: '2026-03-15',
    paidDate: '2026-03-02',
    lineItems: [
      { label: 'Chef service (6 hrs)', amount: 900 },
      { label: 'Ingredients & provisioning', amount: 650 },
      { label: 'Setup & equipment', amount: 250 },
    ],
  },
  {
    id: 'p2',
    bookingId: 'b2',
    clientId: 'c3',
    description: 'Monthly Retainer — March 2026',
    totalAmount: 4500,
    amountPaid: 0,
    status: 'overdue',
    dueDate: '2026-03-01',
    paidDate: null,
    lineItems: [
      { label: 'Monthly retainer (Henderson Family)', amount: 4500 },
    ],
  },
  {
    id: 'p3',
    bookingId: 'b3',
    clientId: 'c2',
    description: 'Romantic Dinner — 25 Mar 2026',
    totalAmount: 650,
    amountPaid: 650,
    status: 'paid',
    dueDate: '2026-03-20',
    paidDate: '2026-03-11',
    lineItems: [
      { label: 'Chef service (4 hrs)', amount: 400 },
      { label: 'Ingredients', amount: 250 },
    ],
  },
  {
    id: 'p4',
    bookingId: 'b5',
    clientId: 'c4',
    description: 'Private Dinner Party — 28 Mar 2026',
    totalAmount: 2400,
    amountPaid: 0,
    status: 'unpaid',
    dueDate: '2026-03-22',
    paidDate: null,
    lineItems: [
      { label: 'Chef service (8 hrs)', amount: 1200 },
      { label: 'Ingredients & vegan provisioning', amount: 900 },
      { label: 'Equipment hire', amount: 300 },
    ],
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

import React from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [clients, setClients] = useState(SEED_CLIENTS)
  const [bookings, setBookings] = useState(SEED_BOOKINGS)
  const [payments, setPayments] = useState(SEED_PAYMENTS)

  // ── Clients ──
  function addClient(client) {
    const newClient = { ...client, id: `c${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], notes: [], allergies: client.allergies || [] }
    setClients(prev => [newClient, ...prev])
    return newClient
  }
  function updateClient(id, updates) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }
  function addClientNote(clientId, text) {
    const note = { id: `n${Date.now()}`, text, createdAt: new Date().toISOString().split('T')[0] }
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes: [note, ...c.notes] } : c))
  }

  // ── Bookings ──
  function addBooking(booking) {
    const newBooking = { ...booking, id: `b${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }
  function updateBooking(id, updates) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  // ── Payments ──
  function addPayment(payment) {
    const newPayment = { ...payment, id: `p${Date.now()}` }
    setPayments(prev => [newPayment, ...prev])
    return newPayment
  }
  function updatePayment(id, updates) {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  // ── Helpers ──
  function getClient(id) { return clients.find(c => c.id === id) }
  function getBooking(id) { return bookings.find(b => b.id === id) }
  function getClientBookings(clientId) { return bookings.filter(b => b.clientId === clientId) }
  function getPaymentForBooking(bookingId) { return payments.find(p => p.bookingId === bookingId) }

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

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
