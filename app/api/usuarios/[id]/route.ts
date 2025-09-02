import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dados mockados dos usuários (em produção, usar banco de dados)
// Importar ou referenciar a mesma lista de usuários
let usuarios = [
  {
    id: '1',
    nomeCompleto: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1978-05-15',
    idade: 45,
    sexo: 'F',
    telefones: '(11) 99999-9999',
    enderecoCompleto: 'Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567',
    responsavelLegalNome: '',
    responsavelLegalCpf: '',
    dataCadastro: '2023-06-15',
    totalAtendimentos: 5,
    ultimoAtendimento: '2024-01-15'
  },
  {
    id: '2',
    nomeCompleto: 'João Carlos Oliveira',
    cpf: '987.654.321-00',
    dataNascimento: '1985-12-03',
    idade: 38,
    sexo: 'M',
    telefones: '(11) 88888-8888',
    enderecoCompleto: 'Av. Principal, 456 - Jardim América - São Paulo/SP - CEP: 05678-901',
    responsavelLegalNome: '',
    responsavelLegalCpf: '',
    dataCadastro: '2023-08-22',
    totalAtendimentos: 3,
    ultimoAtendimento: '2024-01-10'
  },
  {
    id: '3',
    nomeCompleto: 'Ana Paula Costa',
    cpf: '456.789.123-00',
    dataNascimento: '1992-09-18',
    idade: 31,
    sexo: 'F',
    telefones: '(11) 77777-7777',
    enderecoCompleto: 'Rua da Paz, 789 - Vila Nova - São Paulo/SP - CEP: 09876-543',
    responsavelLegalNome: '',
    responsavelLegalCpf: '',
    dataCadastro: '2023-11-05',
    totalAtendimentos: 2,
    ultimoAtendimento: '2024-01-08'
  }
]

// Função para verificar autenticação
function verifyAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString())
    if (userData.exp && Date.now() > userData.exp) {
      return null
    }
    return userData
  } catch {
    return null
  }
}

// GET - Buscar usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  try {
    const { id } = params
    const usuario = usuarios.find(u => u.id === id)

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: usuario
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  try {
    const { id } = params
    const body = await request.json()
    
    const usuarioIndex = usuarios.findIndex(u => u.id === id)
    if (usuarioIndex === -1) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se CPF já existe em outro usuário
    if (body.cpf && body.cpf !== usuarios[usuarioIndex].cpf) {
      const cpfExists = usuarios.some(usuario => usuario.cpf === body.cpf && usuario.id !== id)
      if (cpfExists) {
        return NextResponse.json(
          { error: 'CPF já cadastrado para outro usuário' },
          { status: 409 }
        )
      }
    }

    // Atualizar usuário
    usuarios[usuarioIndex] = {
      ...usuarios[usuarioIndex],
      ...body,
      id // Manter o ID original
    }

    return NextResponse.json({
      success: true,
      data: usuarios[usuarioIndex],
      message: 'Usuário atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  try {
    const { id } = params
    const usuarioIndex = usuarios.findIndex(u => u.id === id)
    
    if (usuarioIndex === -1) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Remover usuário
    const usuarioRemovido = usuarios.splice(usuarioIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: usuarioRemovido,
      message: 'Usuário removido com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}