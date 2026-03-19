import { format, parseISO, isAfter, isBefore, isToday, differenceInDays } from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'd MMM yyyy') } catch { return dateStr }
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'd MMM') } catch { return dateStr }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(amount ?? 0)
}

export function paymentStatusLabel(status) {
  const map = {
    paid:      { label: 'Paid',           variant: 'green'  },
    unpaid:    { label: 'Unpaid',         variant: 'yellow' },
    partial:   { label: 'Deposit paid',   variant: 'blue'   },
    overdue:   { label: 'Overdue',        variant: 'red'    },
  }
  return map[status] ?? { label: status, variant: 'gray' }
}

export function bookingStatusLabel(status) {
  const map = {
    upcoming:  { label: 'Upcoming',   variant: 'blue'   },
    past:      { label: 'Completed',  variant: 'gray'   },
    cancelled: { label: 'Cancelled',  variant: 'red'    },
  }
  return map[status] ?? { label: status, variant: 'gray' }
}

export function clientTypeLabel(type) {
  return type === 'retainer'
    ? { label: 'Retainer', variant: 'purple' }
    : { label: 'One-off',  variant: 'gray'   }
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  try { return isBefore(parseISO(dueDate), new Date()) } catch { return false }
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  try { return differenceInDays(parseISO(dateStr), new Date()) } catch { return null }
}
