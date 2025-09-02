"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, CalendarIcon, User, FileText, Eye, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from 'next/navigation'

// Mock data
const mockUsers = [
  {
    id: "1",
    nomeCompleto: "Maria Silva Santos",
    cpf: "123.456.789-00",
    idade: 45,
    sexo: "F",
    telefones: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
  },
  {
    id: "2",
    nomeCompleto: "João Oliveira",
    cpf: "987.654.321-00",
    idade: 32,
    sexo: "M",
    telefones: "(11) 88888-8888",
    endereco: "Av. Paulista, 456 - São Paulo/SP",
  },
  {
    id: "3",
    nomeCompleto: "Ana Costa",
    cpf: "456.789.123-00",
    idade: 28,
    sexo: "F",
    telefones: "(11) 77777-7777",
    endereco: "Rua da Consolação, 789 - São Paulo/SP",
  },
]

const mockAttendances = [
  {
    id: "1",
    userName: "Maria Silva Santos",
    userCpf: "123.456.789-00",
    date: "2024-01-15",
    type: "Inicial",
    service: "BPC – Benefício de Prestação Continuada",
    technician: "Ana Paula Silva",
    status: "PENDENTE",
  },
  {
    id: "2",
    userName: "João Oliveira",
    userCpf: "987.654.321-00",
    date: "2024-01-15",
    type: "Retorno",
    service: "Cadastro Único / Atualização",
    technician: "Carlos Santos",
    status: "DEFERIDO",
  },
  {
    id: "3",
    userName: "Ana Costa",
    userCpf: "456.789.123-00",
    date: "2024-01-14",
    type: "Acompanhamento",
    service: "CPTEA",
    technician: "Maria Fernanda",
    status: "INDEFERIDO",
  },
]

export default function BuscarPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cpfSearch, setCpfSearch] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    sexo: "Todos",
    tipoAtendimento: "Todos",
    status: "Todos",
    tecnico: "Todos",
    servico: "Todos",
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
  })

  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [filteredAttendances, setFilteredAttendances] = useState(mockAttendances)

  const handleSearch = () => {
    // Filter users
    let userResults = mockUsers.filter(
      (user) =>
        user.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(cpfSearch.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')) ||
        user.cpf.includes(searchTerm) ||
        user.telefones.includes(searchTerm),
    )

    if (selectedFilters.sexo !== "Todos") {
      userResults = userResults.filter((user) => user.sexo === selectedFilters.sexo)
    }

    setFilteredUsers(userResults)

    // Filter attendances
    let attendanceResults = mockAttendances.filter(
      (attendance) =>
        attendance.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.userCpf.includes(searchTerm) ||
        attendance.technician.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedFilters.tipoAtendimento !== "Todos") {
      attendanceResults = attendanceResults.filter((attendance) => attendance.type === selectedFilters.tipoAtendimento)
    }

    if (selectedFilters.status !== "Todos") {
      attendanceResults = attendanceResults.filter((attendance) => attendance.status === selectedFilters.status)
    }

    if (selectedFilters.servico !== "Todos") {
      attendanceResults = attendanceResults.filter((attendance) => attendance.service.includes(selectedFilters.servico))
    }

    setFilteredAttendances(attendanceResults)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCpfSearch("")
    setSelectedFilters({
      sexo: "Todos",
      tipoAtendimento: "Todos",
      status: "Todos",
      tecnico: "Todos",
      servico: "Todos",
      dataInicio: null,
      dataFim: null,
    })
    setFilteredUsers(mockUsers)
    setFilteredAttendances(mockAttendances)
  }

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value)
    setCpfSearch(formatted)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

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

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Busca Avançada</h1>
          <p className="text-gray-600">Encontre usuários e atendimentos rapidamente</p>
        </div>
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca e Filtros
            </CardTitle>
            <CardDescription>Use os filtros abaixo para refinar sua busca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Search */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar por nome ou telefone</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite o nome ou telefone..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="cpf-search">Buscar por CPF</Label>
                  <Input
                    id="cpf-search"
                    value={cpfSearch}
                    onChange={handleCpfChange}
                    placeholder="Digite o CPF (000.000.000-00)..."
                    className="mt-1"
                    maxLength={14}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Sexo</Label>
                <Select
                  value={selectedFilters.sexo}
                  onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, sexo: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Atendimento</Label>
                <Select
                  value={selectedFilters.tipoAtendimento}
                  onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, tipoAtendimento: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Inicial">Inicial</SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                    <SelectItem value="Encaminhamento">Encaminhamento</SelectItem>
                    <SelectItem value="Acompanhamento">Acompanhamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedFilters.status}
                  onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="DEFERIDO">Deferido</SelectItem>
                    <SelectItem value="INDEFERIDO">Indeferido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Serviço</Label>
                <Select
                  value={selectedFilters.servico}
                  onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, servico: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="BPC">BPC</SelectItem>
                    <SelectItem value="Cadastro Único">Cadastro Único</SelectItem>
                    <SelectItem value="AME">AME</SelectItem>
                    <SelectItem value="CPTEA">CPTEA</SelectItem>
                    <SelectItem value="CRAS">CRAS/CREAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Data Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedFilters.dataInicio
                        ? format(selectedFilters.dataInicio, "PPP", { locale: ptBR })
                        : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedFilters.dataInicio}
                      onSelect={(date) => setSelectedFilters((prev) => ({ ...prev, dataInicio: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Data Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedFilters.dataFim
                        ? format(selectedFilters.dataFim, "PPP", { locale: ptBR })
                        : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedFilters.dataFim}
                      onSelect={(date) => setSelectedFilters((prev) => ({ ...prev, dataFim: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Usuários ({filteredUsers.length})
            </TabsTrigger>
            <TabsTrigger value="atendimentos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Atendimentos ({filteredAttendances.length})
            </TabsTrigger>
          </TabsList>

          {/* Users Results */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Resultados - Usuários</CardTitle>
                <CardDescription>{filteredUsers.length} usuário(s) encontrado(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-medium">{user.nomeCompleto}</p>
                          <p className="text-sm text-muted-foreground">{user.cpf}</p>
                        </div>
                        <div>
                          <p className="font-medium">{user.idade} anos</p>
                          <p className="text-sm text-muted-foreground">
                            {user.sexo === "M" ? "Masculino" : user.sexo === "F" ? "Feminino" : "Outro"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{user.telefones}</p>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.endereco}</p>
                          <p className="text-sm text-muted-foreground">Endereço</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/usuarios/${user.id}`}>
                          <Button variant="outline" size="sm" title="Ver perfil">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" title="Editar usuário">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Link href={`/atendimentos/novo?userId=${user.id}&userName=${encodeURIComponent(user.nomeCompleto)}&userCpf=${encodeURIComponent(user.cpf)}`}>
                          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" title="Novo Atendimento">
                            <Plus className="h-4 w-4 mr-1" />
                            Novo Atendimento
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado com os critérios de busca.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendances Results */}
          <TabsContent value="atendimentos">
            <Card>
              <CardHeader>
                <CardTitle>Resultados - Atendimentos</CardTitle>
                <CardDescription>{filteredAttendances.length} atendimento(s) encontrado(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAttendances.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="font-medium">{attendance.userName}</p>
                          <p className="text-sm text-muted-foreground">{attendance.userCpf}</p>
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
                  {filteredAttendances.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum atendimento encontrado com os critérios de busca.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
