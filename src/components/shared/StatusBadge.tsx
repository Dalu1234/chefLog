import Badge from '../ui/Badge'
import { PAYMENT_STATUS_CONFIG, BOOKING_STATUS_CONFIG, CLIENT_TYPE_CONFIG } from '../../lib/utils'
import type { PaymentStatus, BookingStatus, ClientType } from '../../types'

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = PAYMENT_STATUS_CONFIG[status]
  return <Badge variant={variant as any}>{label}</Badge>
}

export function PaymentStripe({ status }: { status: PaymentStatus }) {
  const { stripe } = PAYMENT_STATUS_CONFIG[status]
  return <div className={`absolute right-0 inset-y-0 w-[3px] ${stripe}`} />
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  const { label, variant } = BOOKING_STATUS_CONFIG[status]
  return <Badge variant={variant as any}>{label}</Badge>
}

export function ClientTypeBadge({ type }: { type: ClientType }) {
  const { label, variant } = CLIENT_TYPE_CONFIG[type]
  return <Badge variant={variant as any}>{label}</Badge>
}

export function DietaryBadge({ item }: { item: string }) {
  return <Badge variant="default">{item}</Badge>
}
