import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/cooperative', '/admin']
const authRoutes = ['/auth/login', '/auth/register']
const roleRoutes: Record<string, string[]> = {
  investisseur: ['/dashboard'],
  cooperative: ['/cooperative'],
  admin: ['/admin', '/dashboard', '/cooperative'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do not remove this call
  const { data: { user } } = await supabase.auth.getUser()
  const role = request.cookies.get('afund_role')?.value

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && user) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'cooperative') return NextResponse.redirect(new URL('/cooperative/dashboard', request.url))
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user && role) {
    const allowed = roleRoutes[role] || []
    const hasAccess = allowed.some(r => pathname.startsWith(r))
    if (isProtected && !hasAccess) {
      if (role === 'cooperative') return NextResponse.redirect(new URL('/cooperative/dashboard', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cooperative/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
}
