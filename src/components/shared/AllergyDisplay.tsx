import type { AllergyEntry } from '../../types'
import { cn } from '../../lib/utils'

export function AllergyChip({ item }: { item: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-danger-50 text-danger-700 border border-danger-100">
      {item}
    </span>
  )
}

export function AllergyDisplay({ allergies, compact, className }: {
  allergies: AllergyEntry[]; compact?: boolean; className?: string
}) {
  const withAllergies = allergies.filter(a => a.items.length > 0)
  if (withAllergies.length === 0) return compact ? null : <p className="text-sm text-surface-500">No allergies recorded</p>

  if (compact) {
    const all = withAllergies.flatMap(a => a.items)
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {all.slice(0, 3).map((item, i) => <AllergyChip key={i} item={item} />)}
        {all.length > 3 && <span className="text-xs text-surface-500 self-center">+{all.length - 3}</span>}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {withAllergies.map((entry, i) => (
        <div key={i}>
          <p className="text-xs font-medium text-surface-600 mb-1.5">{entry.person}</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.items.map((item, j) => <AllergyChip key={j} item={item} />)}
          </div>
          {entry.notes && <p className="text-xs text-surface-500 mt-1">{entry.notes}</p>}
        </div>
      ))}
    </div>
  )
}

export function AllergyAlertBanner({ allergies }: { allergies: AllergyEntry[] }) {
  const withAllergies = allergies.filter(a => a.items.length > 0)
  if (withAllergies.length === 0) return null

  return (
    <div className="bg-danger-50 border border-danger-100 rounded-2xl px-5 py-4">
      <p className="text-sm font-semibold text-danger-700 mb-3">
        Allergy alert — {withAllergies.length} person{withAllergies.length !== 1 ? 's' : ''}
      </p>
      <AllergyDisplay allergies={allergies} />
    </div>
  )
}
