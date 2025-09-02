import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Dados mockados (em produção, usar banco de dados)
const usuarios = [
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

const atendimentos = [
  {
    id: '1',
    userId: '1',
    userName: 'Maria Silva Santos',
    userCpf: '123.456.789-00',
    dataAtendimento: '2024-01-15',
    tipoAtendimento: 'Inicial',
    formaAtendimento: 'Presencial',
    tecnicoResponsavel: 'Ana Paula Silva',
    demandaApresentada: 'Solicitação de BPC para pessoa com deficiência',
    servicoBeneficio: ['BPC – Benefício de Prestação Continuada'],
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
    tecnicoResponsavel: 'Carlos Roberto Santos',
    demandaApresentada: 'Acompanhamento de processo de Cadastro Único',
    servicoBeneficio: ['Cadastro Único / Atualização'],
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
    tecnicoResponsavel: 'Maria José Lima',
    demandaApresentada: 'Solicitação de auxílio municipal AME',
    servicoBeneficio: ['Auxílio Municipal – AME'],
    resultado: 'APROVADO',
    dataCriacao: '2024-01-08T09:45:00Z'
  },
  {
    id: '4',
    userId: '1',
    userName: 'Maria Silva Santos',
    userCpf: '123.456.789-00',
    dataAtendimento: '2023-12-20',
    tipoAtendimento: 'Retorno',
    formaAtendimento: 'Presencial',
    tecnicoResponsavel: 'Ana Paula Silva',
    demandaApresentada: 'Acompanhamento de processo BPC',
    servicoBeneficio: ['BPC – Benefício de Prestação Continuada'],
    resultado: 'APROVADO',
    dataCriacao: '2023-12-20T15:20:00Z'
  },
  {
    id: '5',
    userId: '2',
    userName: 'João Carlos Oliveira',
    userCpf: '987.654.321-00',
    dataAtendimento: '2023-11-15',
    tipoAtendimento: 'Inicial',
    formaAtendimento: 'Presencial',
    tecnicoResponsavel: 'Carlos Roberto Santos',
    demandaApresentada: 'Cadastro Único',
    servicoBeneficio: ['Cadastro Único / Atualização'],
    resultado: 'APROVADO',
    dataCriacao: '2023-11-15T11:10:00Z'
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

// GET - Obter relatórios e estatísticas
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
    const tipo = searchParams.get('tipo') || 'geral'
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    // Filtrar atendimentos por período se especificado
    let atendimentosFiltrados = atendimentos
    if (dataInicio) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        a.dataAtendimento >= dataInicio
      )
    }
    if (dataFim) {
      atendimentosFiltrados = atendimentosFiltrados.filter(a => 
        a.dataAtendimento <= dataFim
      )
    }

    switch (tipo) {
      case 'geral':
        return NextResponse.json({
          success: true,
          data: {
            totalUsuarios: usuarios.length,
            totalAtendimentos: atendimentosFiltrados.length,
            atendimentosAprovados: atendimentosFiltrados.filter(a => a.resultado === 'APROVADO').length,
            atendimentosPendentes: atendimentosFiltrados.filter(a => a.resultado === 'PENDENTE').length,
            atendimentosNegados: atendimentosFiltrados.filter(a => a.resultado === 'NEGADO').length,
            usuariosPorSexo: {
              masculino: usuarios.filter(u => u.sexo === 'M').length,
              feminino: usuarios.filter(u => u.sexo === 'F').length
            },
            atendimentosPorTipo: {
              inicial: atendimentosFiltrados.filter(a => a.tipoAtendimento === 'Inicial').length,
              retorno: atendimentosFiltrados.filter(a => a.tipoAtendimento === 'Retorno').length
            },
            atendimentosPorForma: {
              presencial: atendimentosFiltrados.filter(a => a.formaAtendimento === 'Presencial').length,
              telefonico: atendimentosFiltrados.filter(a => a.formaAtendimento === 'Telefônico').length,
              videoconferencia: atendimentosFiltrados.filter(a => a.formaAtendimento === 'Videoconferência').length
            }
          }
        })

      case 'mensal':
        // Agrupar atendimentos por mês
        const atendimentosPorMes = atendimentosFiltrados.reduce((acc, atendimento) => {
          const mes = atendimento.dataAtendimento.substring(0, 7) // YYYY-MM
          acc[mes] = (acc[mes] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          success: true,
          data: {
            atendimentosPorMes,
            totalPeriodo: atendimentosFiltrados.length
          }
        })

      case 'servicos':
        // Agrupar por tipo de serviço/benefício
        const servicosBeneficios = atendimentosFiltrados.reduce((acc, atendimento) => {
          atendimento.servicoBeneficio.forEach(servico => {
            acc[servico] = (acc[servico] || 0) + 1
          })
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          success: true,
          data: {
            servicosBeneficios,
            totalAtendimentos: atendimentosFiltrados.length
          }
        })

      case 'tecnicos':
        // Agrupar por técnico responsável
        const atendimentosPorTecnico = atendimentosFiltrados.reduce((acc, atendimento) => {
          const tecnico = atendimento.tecnicoResponsavel
          acc[tecnico] = (acc[tecnico] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          success: true,
          data: {
            atendimentosPorTecnico,
            totalAtendimentos: atendimentosFiltrados.length
          }
        })

      case 'demografico':
        // Análise demográfica dos usuários
        const faixasEtarias = usuarios.reduce((acc, usuario) => {
          const idade = usuario.idade
          let faixa = ''
          if (idade < 18) faixa = '0-17'
          else if (idade < 30) faixa = '18-29'
          else if (idade < 45) faixa = '30-44'
          else if (idade < 60) faixa = '45-59'
          else faixa = '60+'
          
          acc[faixa] = (acc[faixa] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          success: true,
          data: {
            faixasEtarias,
            totalUsuarios: usuarios.length,
            idadeMedia: usuarios.reduce((sum, u) => sum + u.idade, 0) / usuarios.length
          }
        })

      default:
        return NextResponse.json(
          { error: 'Tipo de relatório não reconhecido' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}