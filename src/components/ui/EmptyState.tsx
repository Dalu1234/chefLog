import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export default function EmptyState({ icon, title, description, action, className }: {
  icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-surface-200 flex items-center justify-center text-surface-500 mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-surface-700">{title}</p>
      {description && <p className="text-xs text-surface-500 mt-1.5 max-w-[220px] leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
