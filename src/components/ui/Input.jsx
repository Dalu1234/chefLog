import clsx from 'clsx'

export function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <input
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none transition-colors',
          'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
          'placeholder:text-gray-400',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <textarea
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none transition-colors resize-none',
          'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
          'placeholder:text-gray-400',
          error && 'border-red-400',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <select
        className={clsx(
          'w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none transition-colors',
          'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
