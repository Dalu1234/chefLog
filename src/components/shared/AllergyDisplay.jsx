import { AlertTriangle } from 'lucide-react'
import Badge from '../ui/Badge'

export default function AllergyDisplay({ allergies = [], compact = false }) {
  const withAllergies = allergies.filter(a => a.items?.length > 0)

  if (withAllergies.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No allergies recorded</p>
    )
  }

  if (compact) {
    const allItems = withAllergies.flatMap(a => a.items)
    return (
      <div className="flex flex-wrap gap-1">
        {allItems.map((item, i) => (
          <Badge key={i} variant="red">
            <AlertTriangle size={10} />
            {item}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {withAllergies.map((entry, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-600 min-w-[80px]">{entry.person}:</span>
          <div className="flex flex-wrap gap-1">
            {entry.items.map((item, j) => (
              <Badge key={j} variant="red">
                <AlertTriangle size={10} />
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
