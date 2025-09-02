"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, User, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

const mockUsuarios = [
  {
    id: "1",
    nomeCompleto: "Maria Silva Santos",
    cpf: "123.456.789-00",
    idade: 45,
    sexo: "F",
    telefones: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    ultimoAtendimento: "2024-01-15",
    totalAtendimentos: 5,
  },
  {
    id: "2",
    nomeCompleto: "João Oliveira",
    cpf: "987.654.321-00",
    idade: 32,
    sexo: "M",
    telefones: "(11) 88888-8888",
    endereco: "Av. Paulista, 456 - São Paulo/SP",
    ultimoAtendimento: "2024-01-14",
    totalAtendimentos: 3,
  },
  {
    id: "3",
    nomeCompleto: "Ana Costa",
    cpf: "456.789.123-00",
    idade: 28,
    sexo: "F",
    telefones: "(11) 77777-7777",
    endereco: "Rua da Consolação, 789 - São Paulo/SP",
    ultimoAtendimento: "2024-01-13",
    totalAtendimentos: 8,
  },
  {
    id: "4",
    nomeCompleto: "Carlos Ferreira",
    cpf: "321.654.987-00",
    idade: 55,
    sexo: "M",
    telefones: "(11) 66666-6666",
    endereco: "Rua Augusta, 321 - São Paulo/SP",
    ultimoAtendimento: "2024-01-12",
    totalAtendimentos: 2,
  },
]

export default function UsuariosPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sexoFilter, setSexoFilter] = useState("Todos")
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsuarios()
    }
  }, [isAuthenticated])

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsuarios(data.data)
          setFilteredUsuarios(data.data)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoadingData(false)
    }
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
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  const handleSearch = () => {
    let results = usuarios.filter(
      (usuario) =>
        usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.cpf.includes(searchTerm) ||
        usuario.telefones.includes(searchTerm),
    )

    if (sexoFilter !== "Todos") {
      results = results.filter((usuario) => usuario.sexo === sexoFilter)
    }

    setFilteredUsuarios(results)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSexoFilter("Todos")
    setFilteredUsuarios(usuarios)
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600">Visualize e gerencie todos os usuários cadastrados</p>
          </div>
          <Link href="/usuarios/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </Link>
        </div>
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar por nome, CPF ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={sexoFilter} onValueChange={setSexoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>
            <CardDescription>{filteredUsuarios.length} usuário(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{usuario.nomeCompleto}</p>
                      <p className="text-sm text-muted-foreground">{usuario.cpf}</p>
                    </div>
                    <div>
                      <p className="font-medium">{usuario.idade} anos</p>
                      <p className="text-sm text-muted-foreground">
                        {usuario.sexo === "M" ? "Masculino" : usuario.sexo === "F" ? "Feminino" : "Outro"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{usuario.telefones}</p>
                      <p className="text-sm text-muted-foreground">Contato</p>
                    </div>
                    <div>
                      <p className="font-medium">{new Date(usuario.ultimoAtendimento).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-muted-foreground">Último atendimento</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {usuario.totalAtendimentos} atendimentos
                      </Badge>
                      <p className="text-sm text-muted-foreground">Histórico</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/atendimentos/novo?userId=${usuario.id}&userName=${encodeURIComponent(usuario.nomeCompleto)}&userCpf=${encodeURIComponent(usuario.cpf)}`}>
                      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/usuarios/${usuario.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado com os critérios de busca.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
