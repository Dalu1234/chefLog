import Badge from '../ui/Badge'
import { paymentStatusLabel } from '../../lib/utils'

export default function PaymentBadge({ status }) {
  const { label, variant } = paymentStatusLabel(status)
  return <Badge variant={variant}>{label}</Badge>
}
