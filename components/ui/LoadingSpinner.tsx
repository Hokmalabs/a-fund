import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'
type Color = 'green' | 'white' | 'gray'

const sizeClasses: Record<Size, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

const colorClasses: Record<Color, string> = {
  green: 'border-green-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray:  'border-gray-400 border-t-transparent',
}

interface LoadingSpinnerProps {
  size?: Size
  color?: Color
  className?: string
}

export default function LoadingSpinner({ size = 'md', color = 'green', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('rounded-full animate-spin', sizeClasses[size], colorClasses[color], className)} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="md" color="green" />
    </div>
  )
}
