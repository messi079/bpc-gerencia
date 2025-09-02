import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    try {
      // Decodificar token simples (em produção, usar biblioteca JWT)
      const userData = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Verificar se o token não expirou
      if (userData.exp && Date.now() > userData.exp) {
        cookieStore.delete('auth-token')
        return NextResponse.json(
          { error: 'Token expirado' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userData.id,
          username: userData.username,
          name: userData.name,
          role: userData.role
        }
      })
    } catch (decodeError) {
      cookieStore.delete('auth-token')
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}