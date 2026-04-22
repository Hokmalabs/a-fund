'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, Wallet, Bell, User,
  Sprout, FileText, Users, BarChart3, ShieldCheck, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, TrendingUp, Wallet, Bell, User,
  Sprout, FileText, Users, BarChart3, ShieldCheck,
}

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface MobileNavProps {
  navItems: NavItem[]
  onLogout: () => void | Promise<void>
}

export default function MobileNav({ navItems, onLogout }: MobileNavProps) {
  const pathname = usePathname()

  // Max 4 items pour laisser place au bouton déconnexion
  const visibleItems = navItems.slice(0, 4)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
      <div className="flex items-stretch">
        {visibleItems.map(item => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const isActive =
            pathname === item.href ||
            (item.href.length > 10 && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 px-1 gap-1 transition-all relative',
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {/* Indicateur actif */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-500 rounded-full" />
              )}

              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>

              <span className={cn(
                'text-xs leading-none',
                isActive ? 'font-semibold text-green-600' : 'font-normal'
              )}>
                {item.label.split(' ')[0]}
              </span>
            </Link>
          )
        })}

        {/* Bouton déconnexion */}
        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 gap-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} strokeWidth={1.8} />
          <span className="text-xs leading-none">Quitter</span>
        </button>
      </div>

      {/* Safe area iPhone */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }} className="bg-white" />
    </nav>
  )
}