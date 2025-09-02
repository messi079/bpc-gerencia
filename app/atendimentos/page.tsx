'use client'

import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const mockAttendances = [
  {
    id: "1",
    userName: "Maria Silva Santos",
    date: "2024-01-15",
    type: "Inicial",
    service: "BPC – Benefício de Prestação Continuada",
    technician: "Ana Paula Silva",
    status: "PENDENTE",
  },
  {
    id: "2",
    userName: "João Oliveira",
    date: "2024-01-15",
    type: "Retorno",
    service: "Cadastro Único / Atualização",
    technician: "Carlos Santos",
    status: "DEFERIDO",
  },
  {
    id: "3",
    userName: "Ana Costa",
    date: "2024-01-15",
    type: "Acompanhamento",
    service: "CPTEA",
    technician: "Maria Fernanda",
    status: "INDEFERIDO",
  },
]

export default function AtendimentosPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [atendimentos, setAtendimentos] = useState([])
  const [filteredAtendimentos, setFilteredAtendimentos] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [tipoFilter, setTipoFilter] = useState('Todos')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAtendimentos()
    }
  }, [isAuthenticated])

  const fetchAtendimentos = async () => {
    try {
      const response = await fetch('/api/atendimentos', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAtendimentos(data.data)
          setFilteredAtendimentos(data.data)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSearch = () => {
    let results = atendimentos.filter(
      (atendimento) =>
        atendimento.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        atendimento.userCpf?.includes(searchTerm) ||
        atendimento.tecnicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'Todos') {
      results = results.filter((atendimento) => atendimento.resultado === statusFilter)
    }

    if (tipoFilter !== 'Todos') {
      results = results.filter((atendimento) => atendimento.tipoAtendimento === tipoFilter)
    }

    setFilteredAtendimentos(results)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('Todos')
    setTipoFilter('Todos')
    setFilteredAtendimentos(atendimentos)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando atendimentos...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Atendimentos</h1>
            <p className="text-gray-600">Visualize e gerencie todos os atendimentos</p>
          </div>
          <Link href="/atendimentos/novo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Atendimento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input placeholder="Buscar por usuário..." />
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inicial">Inicial</SelectItem>
                    <SelectItem value="retorno">Retorno</SelectItem>
                    <SelectItem value="encaminhamento">Encaminhamento</SelectItem>
                    <SelectItem value="acompanhamento">Acompanhamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="deferido">Deferido</SelectItem>
                    <SelectItem value="indeferido">Indeferido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Atendimentos</CardTitle>
            <CardDescription>{mockAttendances.length} atendimentos encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAttendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{attendance.userName}</p>
                      <p className="text-sm text-muted-foreground">Usuário</p>
                    </div>
                    <div>
                      <p className="font-medium">{new Date(attendance.date).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-muted-foreground">Data</p>
                    </div>
                    <div>
                      <p className="font-medium">{attendance.type}</p>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{attendance.service}</p>
                      <p className="text-sm text-muted-foreground">Serviço</p>
                    </div>
                    <div>
                      <Badge
                        variant={
                          attendance.status === "DEFERIDO"
                            ? "default"
                            : attendance.status === "INDEFERIDO"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          attendance.status === "DEFERIDO" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                        }
                      >
                        {attendance.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{attendance.technician}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
