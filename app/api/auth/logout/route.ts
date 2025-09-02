import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Remover o cookie de autenticação
    cookieStore.delete('auth-token')

    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}