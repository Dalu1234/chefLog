import { cn } from '../../lib/utils'

type BadgeVariant =
  | 'default' | 'gray' | 'warm'
  | 'green' | 'emerald' | 'forest' | 'sage'
  | 'red' | 'terra'
  | 'indigo' | 'blue' | 'violet'
  | 'amber' | 'yellow' | 'mustard'
  | 'brand'

const V: Record<string, string> = {
  default: 'bg-surface-200 text-surface-600',
  gray:    'bg-surface-200 text-surface-600',
  warm:    'bg-surface-200 text-surface-600',

  green:   'bg-success-50 text-success-700 ring-1 ring-success-100',
  emerald: 'bg-success-50 text-success-700 ring-1 ring-success-100',
  forest:  'bg-success-50 text-success-700 ring-1 ring-success-100',
  sage:    'bg-success-50 text-success-600',

  red:     'bg-danger-50 text-danger-600 ring-1 ring-danger-100',
  terra:   'bg-danger-50 text-danger-600 ring-1 ring-danger-100',

  indigo:  'bg-brand-50 text-brand-600 ring-1 ring-brand-100',
  brand:   'bg-brand-50 text-brand-600 ring-1 ring-brand-100',
  blue:    'bg-brand-50 text-brand-600',
  violet:  'bg-brand-50 text-brand-600',

  amber:   'bg-warning-50 text-warning-700 ring-1 ring-warning-100',
  yellow:  'bg-warning-50 text-warning-700',
  mustard: 'bg-warning-50 text-warning-700',
}

export default function Badge({ children, variant = 'default', className }: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold',
      V[variant] ?? V.default,
      className
    )}>
      {children}
    </span>
  )
}
