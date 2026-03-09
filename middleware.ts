import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith('/admin/dashboard')
  const isLoginPage = request.nextUrl.pathname === '/admin'

  const token =
    request.cookies.get('sb-gysddrbfhwxzrhamzjgg-auth-token')?.value ||
    request.cookies.get('sb-access-token')?.value

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
}
