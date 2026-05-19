import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Track visitor
  const response = NextResponse.next()
  
  // Add visitor tracking header
  response.headers.set('x-path', request.nextUrl.pathname)
  
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}