import { cn } from '../../lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'coral'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
  secondary: 'bg-white text-surface-700 border border-surface-300 hover:bg-surface-100 hover:border-surface-400 shadow-sm',
  ghost:     'text-surface-600 hover:bg-surface-200 hover:text-surface-800',
  danger:    'bg-danger-600 text-white hover:bg-danger-700 shadow-sm',
  coral:     'bg-coral-500 text-white hover:bg-coral-600 shadow-sm',
}

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  fullWidth, className, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; size?: Size; children: ReactNode; fullWidth?: boolean
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-200 focus:ring-offset-1',
        'disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
        VARIANTS[variant], SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
