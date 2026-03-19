import { format, parseISO, differenceInDays, isToday, isTomorrow } from 'date-fns'
import type { PaymentStatus, BookingStatus, ClientType } from '../types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'd MMM yyyy') } catch { return dateStr }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'd MMM') } catch { return dateStr }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(amount ?? 0)
}

export function daysUntil(dateStr: string): number | null {
  try { return differenceInDays(parseISO(dateStr), new Date()) } catch { return null }
}

export function relativeDateLabel(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    if (isToday(d)) return 'Today'
    if (isTomorrow(d)) return 'Tomorrow'
    const days = differenceInDays(d, new Date())
    if (days > 0 && days <= 6) return `In ${days} days`
    return formatDateShort(dateStr)
  } catch { return dateStr }
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function todayFormatted(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy')
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: string; stripe: string }> = {
  paid:    { label: 'Paid',    variant: 'emerald', stripe: 'bg-success-400' },
  partial: { label: 'Deposit', variant: 'amber',   stripe: 'bg-warning-400' },
  unpaid:  { label: 'Unpaid',  variant: 'default', stripe: 'bg-surface-300' },
  overdue: { label: 'Overdue', variant: 'red',     stripe: 'bg-danger-400'  },
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; variant: string }> = {
  upcoming:  { label: 'Upcoming',  variant: 'indigo'  },
  past:      { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'red'     },
}

export const CLIENT_TYPE_CONFIG: Record<ClientType, { label: string; variant: string }> = {
  retainer:  { label: 'Retainer', variant: 'indigo'  },
  'one-off': { label: 'One-off',  variant: 'default' },
}
