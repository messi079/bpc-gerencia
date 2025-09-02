import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Páginas que não precisam de autenticação
  const publicPaths = ['/login']
  
  // Verificar se a rota atual é pública
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Se for uma rota pública, permitir acesso
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Verificar se há token de autenticação nos cookies ou headers
  const token = request.cookies.get('authToken')?.value ||
                request.headers.get('authorization')
  
  // Se não há token e não é uma rota pública, redirecionar para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Se há token, permitir acesso
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}