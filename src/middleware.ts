// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, decodeJwt } from 'jose'
import { TokenPayload } from '@/types/types'

const ROUTES = {
  PUBLIC: ['/login'],
  DASHBOARD: '/admin',
  ADMIN: '/admin/products',
  USER: '/',
} as const

const ROLE_ACCESS: Record<string, string[]> = {
  [ROUTES.ADMIN]: ['admin', 'manager'],
  [ROUTES.USER]: ['user', 'admin', 'manager'],
  [ROUTES.DASHBOARD]: ['user', 'admin', 'manager'],
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET 
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle Public Routes
  // if (isPublicRoute(pathname)) {
  //   const token = getToken(request)

  //   if (token && await isValidToken(token)) {
  //     const decoded = decodeToken(token)
  //     if (decoded?.role) {
  //       const redirectTo = request.nextUrl.searchParams.get('redirect')
  //       if (redirectTo) {
  //         return NextResponse.redirect(new URL(redirectTo, request.url))
  //       }
  //       return NextResponse.redirect(
  //         new URL(getDefaultDashboard(decoded.role), request.url)
  //       )
  //     }
  //   }

  //   return NextResponse.next()
  // }

  // 2. Handle Protected Routes
  // if (isProtectedRoute(pathname)) {
  //   const token = getToken(request)
  //   if (!token) {
  //     return redirectToLogin(request)
  //   }
  //   if (!await isValidToken(token)) {
  //     return redirectToLogin(request, true)
  //   }

  //   const userRole = getUserRole(token)

  //   if (!hasAccess(pathname, userRole)) {
  //     return redirectToDashboard(request, userRole)
  //   }

  //   const response = NextResponse.next()
  //   response.headers.set('X-User-Role', userRole)
  //   response.headers.set('X-Content-Type-Options', 'nosniff')
  //   response.headers.set('X-Frame-Options', 'DENY')
    
  //   return response
  // }

  return NextResponse.next()
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isPublicRoute(pathname: string): boolean {
  return ROUTES.PUBLIC.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(ROUTES.DASHBOARD)
}

function getToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('tk')?.value
  return cookieToken || null
}

function decodeToken(token: string): TokenPayload | null {
  try {
    return decodeJwt(token) as TokenPayload  
  } catch {
    return null
  }
}

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecretKey())  
    return true
  } catch(error: any) {
    console.log(error)
    return false
  }
}

function getUserRole(token: string): string {
  try {
    const decoded = decodeToken(token)
    return decoded?.role || 'user'
  } catch {
    return 'user'
  }
}

function hasAccess(pathname: string, userRole: string): boolean {
  if (pathname.startsWith(ROUTES.ADMIN)) {
    return ROLE_ACCESS[ROUTES.ADMIN].includes(userRole)
  }

  if (pathname.startsWith(ROUTES.USER)) {
    return ROLE_ACCESS[ROUTES.USER].includes(userRole)
  }

  return ROLE_ACCESS[ROUTES.DASHBOARD].includes(userRole)
}

function getDefaultDashboard(role: string): string {
  if (role === 'admin' || role === 'manager') {
    return ROUTES.ADMIN
  }
  return ROUTES.USER
}

function redirectToLogin(request: NextRequest, expired = false): NextResponse {
  const loginUrl = new URL('/login', request.url)
  
  if (expired) {
    loginUrl.searchParams.set('expired', 'true')
  }
  
  const currentPath = request.nextUrl.pathname
  if (!currentPath.startsWith('/login')) {
    loginUrl.searchParams.set('redirect', currentPath)
  }
  
  console.log(loginUrl) 
  
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete('tk')
  
  return response
}

function redirectToDashboard(request: NextRequest, userRole: string): NextResponse {
  console.warn(` Unauthorized access to ${request.nextUrl.pathname} by ${userRole}`)
  
  const dashboardUrl = new URL(getDefaultDashboard(userRole), request.url)
  dashboardUrl.searchParams.set('unauthorized', 'true')
  
  return NextResponse.redirect(dashboardUrl)
}

// ============================================
// MATCHER
// ============================================
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}