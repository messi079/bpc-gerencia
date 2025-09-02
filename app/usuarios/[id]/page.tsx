"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Calendar, FileText, Phone, MapPin, Plus } from "lucide-react"
import Link from "next/link"

const mockUser = {
  id: "1",
  nomeCompleto: "Maria Silva Santos",
  cpf: "123.456.789-00",
  idade: 45,
  sexo: "F",
  telefones: "(11) 99999-9999",
  enderecoCompleto: "Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567",
  dataCadastro: "2023-06-15",
  totalAtendimentos: 5,
}

const mockAttendanceHistory = [
  {
    id: "1",
    date: "2024-01-15",
    type: "Inicial",
    service: "BPC – Benefício de Prestação Continuada",
    technician: "Ana Paula Silva",
    status: "PENDENTE",
    demand: "Solicitação de benefício para pessoa com deficiência",
    result: "Documentação em análise",
  },
  {
    id: "2",
    date: "2024-01-08",
    type: "Retorno",
    service: "BPC – Benefício de Prestação Continuada",
    technician: "Ana Paula Silva",
    status: "DEFERIDO",
    demand: "Entrega de documentação complementar",
    result: "Benefício aprovado e liberado",
  },
  {
    id: "3",
    date: "2023-12-20",
    type: "Inicial",
    service: "Cadastro Único / Atualização",
    technician: "Carlos Santos",
    status: "DEFERIDO",
    demand: "Atualização de dados no CadÚnico",
    result: "Cadastro atualizado com sucesso",
  },
  {
    id: "4",
    date: "2023-11-15",
    type: "Acompanhamento",
    service: "CPTEA",
    technician: "Maria Fernanda",
    status: "DEFERIDO",
    demand: "Acompanhamento para emissão de CPTEA",
    result: "Documento emitido",
  },
  {
    id: "5",
    date: "2023-10-10",
    type: "Inicial",
    service: "Auxílio Municipal – AME",
    technician: "João Silva",
    status: "INDEFERIDO",
    demand: "Solicitação de auxílio municipal",
    result: "Não atende aos critérios estabelecidos",
  },
]

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [selectedAttendance, setSelectedAttendance] = useState<string | null>(null)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

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

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/usuarios">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <div>
                <h1 className="text-2xl font-bold text-foreground">Perfil do Usuário</h1>
                <p className="text-muted-foreground">Histórico completo de atendimentos</p>
              </div>
            </div>
            <Link href={`/atendimentos/novo?userId=${params.id}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{mockUser.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{mockUser.cpf}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="font-medium">{mockUser.idade} anos</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sexo</p>
                    <p className="font-medium">
                      {mockUser.sexo === "M" ? "Masculino" : mockUser.sexo === "F" ? "Feminino" : "Outro"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{mockUser.telefones}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium text-sm">{mockUser.enderecoCompleto}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">{new Date(mockUser.dataCadastro).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Atendimentos</p>
                  <Badge variant="outline" className="font-medium">
                    {mockUser.totalAtendimentos} atendimentos
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Histórico de Atendimentos
                </CardTitle>
                <CardDescription>
                  Todos os atendimentos realizados para este usuário ({mockAttendanceHistory.length} registros)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendanceHistory.map((attendance, index) => (
                    <div key={attendance.id} className="relative">
                      {/* Timeline line */}
                      {index < mockAttendanceHistory.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                      )}

                      <div className="flex gap-4">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>

                        {/* Attendance details */}
                        <div className="flex-1 pb-6">
                          <div className="bg-card border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium">{attendance.service}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(attendance.date).toLocaleDateString("pt-BR")} • {attendance.type}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  attendance.status === "DEFERIDO"
                                    ? "default"
                                    : attendance.status === "INDEFERIDO"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  attendance.status === "DEFERIDO"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : ""
                                }
                              >
                                {attendance.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Demanda: </span>
                                <span>{attendance.demand}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Resultado: </span>
                                <span>{attendance.result}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Técnico: </span>
                                <span>{attendance.technician}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </AuthenticatedLayout>
  )
}
