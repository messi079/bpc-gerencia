import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface LoginRequest {
  username: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { username, password } = body

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username e password são obrigatórios' },
        { status: 400 }
      )
    }

    // Autenticação simples (em produção, usar hash de senha e banco de dados)
    if (username === 'admin' && password === 'admin123') {
      // Criar token JWT simples (em produção, usar biblioteca JWT)
      const token = Buffer.from(JSON.stringify({
        id: '1',
        username: 'admin',
        name: 'Administrador',
        role: 'admin',
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      })).toString('base64')

      // Definir cookie httpOnly
      const cookieStore = cookies()
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 horas
      })

      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          username: 'admin',
          name: 'Administrador',
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}