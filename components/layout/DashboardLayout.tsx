'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, Wallet, Receipt, MessageSquare,
  Bell, User, Settings, ShieldCheck, Sprout, PiggyBank, FileText,
  Users, Menu, X, ChevronRight, LogOut, BarChart3, ClipboardCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MobileNav from './MobileNav'
import { createClient } from '@/lib/supabase/client'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, TrendingUp, Wallet, Receipt, MessageSquare,
  Bell, User, Settings, ShieldCheck, Sprout, PiggyBank, FileText,
  Users, BarChart3, ClipboardCheck,
}

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  title: string
  subtitle?: string
}

const handleLogout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  document.cookie = 'afund_role=; path=/; max-age=0'
  window.location.href = '/auth/login'
}

export default function DashboardLayout({ children, navItems, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-primary-500">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <Sprout className="w-6 h-6 text-white" />
          <span className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
            A-FUND
          </span>
        </Link>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-white font-semibold text-sm">{title}</p>
          {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const isActive =
            pathname === item.href ||
            (item.href.length > 10 && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-white flex flex-col shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600 transition-colors hidden sm:block">
              Accueil
            </Link>
            <ChevronRight className="w-3 h-3 hidden sm:block" />
            <span className="text-gray-800 font-medium truncate max-w-40 sm:max-w-none">{title}</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation Mobile */}
      <MobileNav navItems={navItems} onLogout={handleLogout} />

    </div>
  )
}