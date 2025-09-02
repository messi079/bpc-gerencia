import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dados mockados dos atendimentos (em produção, usar banco de dados)
// Importar ou referenciar a mesma lista de atendimentos
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

// GET - Buscar atendimento por ID
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
    const atendimento = atendimentos.find(a => a.id === id)

    if (!atendimento) {
      return NextResponse.json(
        { error: 'Atendimento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: atendimento
    })
  } catch (error) {
    console.error('Erro ao buscar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar atendimento
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
    
    const atendimentoIndex = atendimentos.findIndex(a => a.id === id)
    if (atendimentoIndex === -1) {
      return NextResponse.json(
        { error: 'Atendimento não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar atendimento
    atendimentos[atendimentoIndex] = {
      ...atendimentos[atendimentoIndex],
      ...body,
      id // Manter o ID original
    }

    return NextResponse.json({
      success: true,
      data: atendimentos[atendimentoIndex],
      message: 'Atendimento atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar atendimento
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
    const atendimentoIndex = atendimentos.findIndex(a => a.id === id)
    
    if (atendimentoIndex === -1) {
      return NextResponse.json(
        { error: 'Atendimento não encontrado' },
        { status: 404 }
      )
    }

    // Remover atendimento
    const atendimentoRemovido = atendimentos.splice(atendimentoIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: atendimentoRemovido,
      message: 'Atendimento removido com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}