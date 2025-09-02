import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dados mockados dos usuários (em produção, usar banco de dados)
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

// GET - Listar usuários
export async function GET(request: NextRequest) {
  const user = verifyAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const cpf = searchParams.get('cpf')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredUsuarios = usuarios

    // Filtrar por busca de nome
    if (search) {
      filteredUsuarios = filteredUsuarios.filter(usuario =>
        usuario.nomeCompleto.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtrar por CPF
    if (cpf) {
      filteredUsuarios = filteredUsuarios.filter(usuario =>
        usuario.cpf.includes(cpf)
      )
    }

    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsuarios = filteredUsuarios.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedUsuarios,
      pagination: {
        page,
        limit,
        total: filteredUsuarios.length,
        totalPages: Math.ceil(filteredUsuarios.length / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  const user = verifyAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const {
      nomeCompleto,
      cpf,
      dataNascimento,
      idade,
      sexo,
      telefones,
      enderecoCompleto,
      responsavelLegalNome,
      responsavelLegalCpf
    } = body

    // Validações básicas
    if (!nomeCompleto || !cpf || !dataNascimento || !sexo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome completo, CPF, data de nascimento e sexo' },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe
    const cpfExists = usuarios.some(usuario => usuario.cpf === cpf)
    if (cpfExists) {
      return NextResponse.json(
        { error: 'CPF já cadastrado no sistema' },
        { status: 409 }
      )
    }

    // Criar novo usuário
    const novoUsuario = {
      id: String(usuarios.length + 1),
      nomeCompleto,
      cpf,
      dataNascimento,
      idade: parseInt(idade) || 0,
      sexo,
      telefones: telefones || '',
      enderecoCompleto: enderecoCompleto || '',
      responsavelLegalNome: responsavelLegalNome || '',
      responsavelLegalCpf: responsavelLegalCpf || '',
      dataCadastro: new Date().toISOString().split('T')[0],
      totalAtendimentos: 0,
      ultimoAtendimento: null
    }

    usuarios.push(novoUsuario)

    return NextResponse.json({
      success: true,
      data: novoUsuario,
      message: 'Usuário cadastrado com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}