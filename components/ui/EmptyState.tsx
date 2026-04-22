import { ReactNode } from 'react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className ?? ''}`}>
      {icon && (
        <div className="text-gray-300 mb-4">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href} className="btn-primary text-sm px-5 py-2.5">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn-primary text-sm px-5 py-2.5">
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
