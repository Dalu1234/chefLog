import { cn } from '../../lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const BASE = [
  'w-full bg-white border border-surface-300 rounded-xl text-sm text-surface-800',
  'placeholder:text-surface-500 transition-all duration-150',
  'focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
  'px-4 py-2.5',
].join(' ')

function Wrap({ label, error, hint, children }: {
  label?: string; error?: string; hint?: string; children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-semibold uppercase tracking-wide text-surface-600">{label}</label>}
      {children}
      {hint && !error && <p className="text-[11px] text-surface-500">{hint}</p>}
      {error && <p className="text-[11px] text-danger-500 font-medium">{error}</p>}
    </div>
  )
}

export function Input({ label, error, hint, className, ...props }:
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: string }) {
  return (
    <Wrap label={label} error={error} hint={hint}>
      <input className={cn(BASE, error && 'border-danger-400 focus:ring-danger-100', className)} {...props} />
    </Wrap>
  )
}

export function Textarea({ label, error, hint, className, ...props }:
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; hint?: string }) {
  return (
    <Wrap label={label} error={error} hint={hint}>
      <textarea className={cn(BASE, 'resize-none', error && 'border-danger-400 focus:ring-danger-100', className)}
        rows={props.rows ?? 3} {...props} />
    </Wrap>
  )
}

export function Select({ label, error, hint, children, className, ...props }:
  SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <Wrap label={label} error={error} hint={hint}>
      <select className={cn(BASE, error && 'border-danger-400 focus:ring-danger-100', className)} {...props}>
        {children}
      </select>
    </Wrap>
  )
}
