import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dados mockados dos atendimentos (em produção, usar banco de dados)
let atendimentos = [
  {
    id: '1',
    userId: '1',
    userName: 'Maria Silva Santos',
    userCpf: '123.456.789-00',
    dataAtendimento: '2024-01-15',
    tipoAtendimento: 'Inicial',
    formaAtendimento: 'Presencial',
    formaAtendimentoOutros: '',
    tecnicoResponsavel: 'Ana Paula Silva',
    demandaApresentada: 'Solicitação de BPC para pessoa com deficiência',
    servicoBeneficio: ['BPC – Benefício de Prestação Continuada'],
    servicoBeneficioOutros: '',
    encaminhamentosRealizados: 'INSS para avaliação médica',
    observacoesTecnico: 'Usuário apresentou toda documentação necessária',
    parecerSocial: 'Favorável ao benefício, atende aos critérios estabelecidos',
    resultado: 'APROVADO',
    dataCriacao: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    userName: 'João Carlos Oliveira',
    userCpf: '987.654.321-00',
    dataAtendimento: '2024-01-10',
    tipoAtendimento: 'Retorno',
    formaAtendimento: 'Telefônico',
    formaAtendimentoOutros: '',
    tecnicoResponsavel: 'Carlos Roberto Santos',
    demandaApresentada: 'Acompanhamento de processo de Cadastro Único',
    servicoBeneficio: ['Cadastro Único / Atualização'],
    servicoBeneficioOutros: '',
    encaminhamentosRealizados: 'CRAS para acompanhamento familiar',
    observacoesTecnico: 'Processo em andamento, aguardando documentação complementar',
    parecerSocial: 'Em análise',
    resultado: 'PENDENTE',
    dataCriacao: '2024-01-10T14:15:00Z'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Ana Paula Costa',
    userCpf: '456.789.123-00',
    dataAtendimento: '2024-01-08',
    tipoAtendimento: 'Inicial',
    formaAtendimento: 'Presencial',
    formaAtendimentoOutros: '',
    tecnicoResponsavel: 'Maria José Lima',
    demandaApresentada: 'Solicitação de auxílio municipal AME',
    servicoBeneficio: ['Auxílio Municipal – AME'],
    servicoBeneficioOutros: '',
    encaminhamentosRealizados: 'Secretaria de Assistência Social',
    observacoesTecnico: 'Família em situação de vulnerabilidade social',
    parecerSocial: 'Favorável, atende aos critérios do programa',
    resultado: 'APROVADO',
    dataCriacao: '2024-01-08T09:45:00Z'
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

// GET - Listar atendimentos
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
    const userId = searchParams.get('userId')
    const tipoAtendimento = searchParams.get('tipoAtendimento')
    const resultado = searchParams.get('resultado')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredAtendimentos = atendimentos

    // Filtrar por usuário
    if (userId) {
      filteredAtendimentos = filteredAtendimentos.filter(atendimento =>
        atendimento.userId === userId
      )
    }

    // Filtrar por tipo de atendimento
    if (tipoAtendimento) {
      filteredAtendimentos = filteredAtendimentos.filter(atendimento =>
        atendimento.tipoAtendimento === tipoAtendimento
      )
    }

    // Filtrar por resultado
    if (resultado) {
      filteredAtendimentos = filteredAtendimentos.filter(atendimento =>
        atendimento.resultado === resultado
      )
    }

    // Filtrar por data
    if (dataInicio) {
      filteredAtendimentos = filteredAtendimentos.filter(atendimento =>
        atendimento.dataAtendimento >= dataInicio
      )
    }

    if (dataFim) {
      filteredAtendimentos = filteredAtendimentos.filter(atendimento =>
        atendimento.dataAtendimento <= dataFim
      )
    }

    // Ordenar por data mais recente
    filteredAtendimentos.sort((a, b) => 
      new Date(b.dataAtendimento).getTime() - new Date(a.dataAtendimento).getTime()
    )

    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAtendimentos = filteredAtendimentos.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedAtendimentos,
      pagination: {
        page,
        limit,
        total: filteredAtendimentos.length,
        totalPages: Math.ceil(filteredAtendimentos.length / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo atendimento
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
      userId,
      userName,
      userCpf,
      dataAtendimento,
      tipoAtendimento,
      formaAtendimento,
      formaAtendimentoOutros,
      tecnicoResponsavel,
      demandaApresentada,
      servicoBeneficio,
      servicoBeneficioOutros,
      encaminhamentosRealizados,
      observacoesTecnico,
      parecerSocial,
      resultado
    } = body

    // Validações básicas
    if (!userId || !userName || !dataAtendimento || !tipoAtendimento || !formaAtendimento) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, userName, dataAtendimento, tipoAtendimento, formaAtendimento' },
        { status: 400 }
      )
    }

    // Criar novo atendimento
    const novoAtendimento = {
      id: String(atendimentos.length + 1),
      userId,
      userName,
      userCpf: userCpf || '',
      dataAtendimento,
      tipoAtendimento,
      formaAtendimento,
      formaAtendimentoOutros: formaAtendimentoOutros || '',
      tecnicoResponsavel: tecnicoResponsavel || user.name,
      demandaApresentada: demandaApresentada || '',
      servicoBeneficio: servicoBeneficio || [],
      servicoBeneficioOutros: servicoBeneficioOutros || '',
      encaminhamentosRealizados: encaminhamentosRealizados || '',
      observacoesTecnico: observacoesTecnico || '',
      parecerSocial: parecerSocial || '',
      resultado: resultado || 'PENDENTE',
      dataCriacao: new Date().toISOString()
    }

    atendimentos.push(novoAtendimento)

    return NextResponse.json({
      success: true,
      data: novoAtendimento,
      message: 'Atendimento registrado com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}