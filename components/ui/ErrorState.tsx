import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({
  title = 'Une erreur est survenue',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className ?? ''}`}>
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        {title}
      </h3>
      {message && (
        <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary text-sm px-5 py-2.5"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
