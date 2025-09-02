'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, TrendingUp, Users, FileText, Calendar } from "lucide-react"

// Mock data for charts
const attendanceByType = [
  { name: "Inicial", value: 145, color: "#0891b2" },
  { name: "Retorno", value: 89, color: "#f59e0b" },
  { name: "Encaminhamento", value: 67, color: "#dc2626" },
  { name: "Acompanhamento", value: 123, color: "#4b5563" },
]

const servicesByType = [
  { name: "BPC", count: 89 },
  { name: "Cadastro Único", count: 67 },
  { name: "AME", count: 45 },
  { name: "CPTEA", count: 34 },
  { name: "CRAS/CREAS", count: 56 },
  { name: "Saúde/INSS", count: 78 },
]

const monthlyTrend = [
  { month: "Jan", atendimentos: 120, aprovados: 89 },
  { month: "Fev", atendimentos: 135, aprovados: 98 },
  { month: "Mar", atendimentos: 148, aprovados: 112 },
  { month: "Abr", atendimentos: 162, aprovados: 125 },
  { month: "Mai", atendimentos: 178, aprovados: 134 },
  { month: "Jun", atendimentos: 195, aprovados: 152 },
]

const ageGroups = [
  { group: "0-17", count: 45 },
  { group: "18-29", count: 78 },
  { group: "30-49", count: 123 },
  { group: "50-64", count: 89 },
  { group: "65+", count: 67 },
]

const bpcStatus = [
  { status: "Deferido", count: 156, color: "#10b981" },
  { status: "Indeferido", count: 45, color: "#dc2626" },
  { status: "Pendente", count: 89, color: "#f59e0b" },
  { status: "Em Revisão", count: 23, color: "#6366f1" },
]

export default function RelatoriosPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [relatoriosData, setRelatoriosData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [selectedYear, setSelectedYear] = useState('2024')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchRelatorios()
    }
  }, [isAuthenticated, selectedYear])

  const fetchRelatorios = async () => {
    try {
      const response = await fetch(`/api/relatorios?ano=${selectedYear}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRelatoriosData(data.data)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error)
    } finally {
      setLoadingData(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loadingData) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando relatórios...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Relatórios e Estatísticas</h1>
                <p className="text-muted-foreground">Análise de dados e indicadores de desempenho</p>
              </div>
            <div className="flex items-center gap-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,248</div>
              <p className="text-xs text-muted-foreground">+15% em relação ao período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">892</div>
              <p className="text-xs text-muted-foreground">+8% novos usuários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">76.8%</div>
              <p className="text-xs text-muted-foreground">+3.2% de melhoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BPC Ativos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">313</div>
              <p className="text-xs text-muted-foreground">89 aguardando análise</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos por Tipo</CardTitle>
              <CardDescription>Distribuição dos tipos de atendimento realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceByType}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Services by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Solicitados</CardTitle>
              <CardDescription>Ranking dos serviços e benefícios</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Evolução dos atendimentos e aprovações ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="atendimentos" stroke="#0891b2" strokeWidth={2} name="Atendimentos" />
                <Line type="monotone" dataKey="aprovados" stroke="#10b981" strokeWidth={2} name="Aprovados" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Demographics and BPC Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil Etário dos Usuários</CardTitle>
              <CardDescription>Distribuição por faixa etária</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* BPC Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos BPC</CardTitle>
              <CardDescription>Situação atual dos benefícios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bpcStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{item.count}</span>
                      <Badge variant="outline">
                        {((item.count / bpcStatus.reduce((acc, curr) => acc + curr.count, 0)) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores Detalhados</CardTitle>
            <CardDescription>Métricas importantes para extração de relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Atendimentos</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total de atendimentos:</span>
                    <span className="font-medium">1,248</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média diária:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo médio:</span>
                    <span className="font-medium">45 min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Encaminhamentos</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total realizados:</span>
                    <span className="font-medium">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Para CRAS/CREAS:</span>
                    <span className="font-medium">178</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Para Saúde/INSS:</span>
                    <span className="font-medium">234</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Perfil dos Usuários</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sexo feminino:</span>
                    <span className="font-medium">58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sexo masculino:</span>
                    <span className="font-medium">41%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outros:</span>
                    <span className="font-medium">1%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AuthenticatedLayout>
  )
}
