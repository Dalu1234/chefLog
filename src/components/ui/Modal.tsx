import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const WIDTHS: Record<string, string> = {
  sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl'
}

export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string
  children: ReactNode; size?: string
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: 'rgba(0,0,0,0.30)' }}
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white rounded-2xl w-full flex flex-col max-h-[92vh] animate-fade-in',
        'shadow-modal border border-surface-200',
        WIDTHS[size]
      )}>
        <div className="flex items-start justify-between px-6 py-5 border-b border-surface-200">
          <div>
            <h2 className="text-base font-semibold text-surface-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-100 transition-colors text-surface-400 hover:text-surface-700 -mt-0.5 -mr-0.5"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
