import { cn } from '../../lib/utils'
import type { ElementType } from 'react'

type Accent = 'brand' | 'emerald' | 'red' | 'amber' | 'coral' | 'muted'

const ICON_STYLES: Record<Accent, { bg: string; text: string }> = {
  brand:   { bg: 'bg-brand-50',   text: 'text-brand-500'   },
  emerald: { bg: 'bg-success-50', text: 'text-success-600' },
  red:     { bg: 'bg-danger-50',  text: 'text-danger-500'  },
  amber:   { bg: 'bg-warning-50', text: 'text-warning-500' },
  coral:   { bg: 'bg-coral-50',   text: 'text-coral-500'   },
  muted:   { bg: 'bg-surface-200', text: 'text-surface-500' },
}

export default function StatCard({ label, value, subtext, icon: Icon, accent = 'muted', className }: {
  label: string
  value: string | number
  subtext?: string
  icon?: ElementType
  accent?: Accent
  className?: string
}) {
  const style = ICON_STYLES[accent]
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-surface-200/80 shadow-card px-5 pt-5 pb-4',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-surface-500">{label}</p>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', style.bg)}>
            <Icon size={15} className={style.text} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="text-[28px] font-bold text-surface-800 tracking-tight leading-none">{value}</p>
      {subtext && <p className="text-xs text-surface-500 mt-2 font-medium">{subtext}</p>}
    </div>
  )
}
