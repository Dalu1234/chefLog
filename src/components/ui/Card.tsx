import { cn } from '../../lib/utils'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  accent?: 'brand' | 'red' | 'coral' | 'green'
}

export function Card({ children, hover, accent, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl overflow-hidden',
        'border border-surface-200/80 shadow-card',
        hover && 'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-[1px]',
        accent === 'brand' && 'border-l-[3px] border-l-brand-500',
        accent === 'red'   && 'border-l-[3px] border-l-danger-500',
        accent === 'coral' && 'border-l-[3px] border-l-coral-500',
        accent === 'green' && 'border-l-[3px] border-l-success-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4 border-b border-surface-200/60', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-3.5 bg-surface-100 border-t border-surface-200/60', className)}>
      {children}
    </div>
  )
}
