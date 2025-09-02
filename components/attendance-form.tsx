"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, User, FileText, Save, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AttendanceData {
  userId: string
  userName: string
  dataAtendimento: string
  tipoAtendimento: string
  formaAtendimento: string
  formaAtendimentoOutros: string
  tecnicoResponsavel: string
  demandaApresentada: string
  servicoBeneficio: string[]
  servicoBeneficioOutros: string
  encaminhamentosRealizados: string
  observacoesTecnico: string
  parecerSocial: string
  resultado: string
}

const servicosBeneficios = [
  "BPC – Benefício de Prestação Continuada",
  "Cadastro Único / Atualização",
  "Auxílio Municipal – AME",
  "CPTEA",
  "Encaminhamento para CRAS / CREAS",
  "Encaminhamento para saúde / INSS / Justiça",
]

interface PrefilledData {
  userId?: string
  userName?: string
  userCpf?: string
}

interface AttendanceFormProps {
  prefilledData?: PrefilledData
}

export function AttendanceForm({ prefilledData }: AttendanceFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(!prefilledData?.userId)
  const [formData, setFormData] = useState<AttendanceData>({
    userId: prefilledData?.userId || "",
    userName: prefilledData?.userName || "",
    dataAtendimento: new Date().toISOString().split("T")[0],
    tipoAtendimento: "",
    formaAtendimento: "",
    formaAtendimentoOutros: "",
    tecnicoResponsavel: "",
    demandaApresentada: "",
    servicoBeneficio: [],
    servicoBeneficioOutros: "",
    encaminhamentosRealizados: "",
    observacoesTecnico: "",
    parecerSocial: "",
    resultado: "PENDENTE",
  })

  const handleInputChange = (field: keyof AttendanceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      servicoBeneficio: checked
        ? [...prev.servicoBeneficio, service]
        : prev.servicoBeneficio.filter((s) => s !== service),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validações básicas
      if (!formData.userId || !formData.userName || !formData.dataAtendimento || !formData.tipoAtendimento || !formData.formaAtendimento) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha usuário, data, tipo e forma de atendimento.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/atendimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Atendimento registrado com sucesso!",
          description: `Atendimento para ${formData.userName} foi salvo e vinculado ao histórico.`,
        })

        // Reset form
        setFormData({
          userId: "",
          userName: "",
          dataAtendimento: new Date().toISOString().split("T")[0],
          tipoAtendimento: "",
          formaAtendimento: "",
          formaAtendimentoOutros: "",
          tecnicoResponsavel: "",
          demandaApresentada: "",
          servicoBeneficio: [],
          servicoBeneficioOutros: "",
          encaminhamentosRealizados: "",
          observacoesTecnico: "",
          parecerSocial: "",
          resultado: "PENDENTE",
        })
      } else {
        toast({
          title: "Erro ao registrar atendimento",
          description: data.error || "Tente novamente ou entre em contato com o suporte.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao registrar atendimento:', error)
      toast({
        title: "Erro ao registrar atendimento",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const mockUsers = [
    { id: "1", name: "Maria Silva Santos", cpf: "123.456.789-00" },
    { id: "2", name: "João Oliveira", cpf: "987.654.321-00" },
    { id: "3", name: "Ana Costa", cpf: "456.789.123-00" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Usuário
          </CardTitle>
          <CardDescription>Selecione o usuário para este atendimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!formData.userId ? (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUserSearch(!showUserSearch)}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar Usuário
              </Button>

              {showUserSearch && (
                <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                  <Label>Usuários disponíveis:</Label>
                  {mockUsers.map((user) => (
                    <div
                      key={user.id.toString()}
                      className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-background"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          userId: user.id,
                          userName: user.name,
                        }))
                        setShowUserSearch(false)
                      }}
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.cpf}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
              <div>
                <p className="font-medium">{formData.userName}</p>
                <p className="text-sm text-muted-foreground">Usuário selecionado</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, userId: "", userName: "" }))}
              >
                Alterar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            2. Dados do Atendimento
          </CardTitle>
          <CardDescription>Informações sobre o atendimento realizado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataAtendimento">Data do atendimento *</Label>
              <Input
                id="dataAtendimento"
                type="date"
                value={formData.dataAtendimento}
                onChange={(e) => handleInputChange("dataAtendimento", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tecnicoResponsavel">Técnico responsável *</Label>
              <Input
                id="tecnicoResponsavel"
                value={formData.tecnicoResponsavel}
                onChange={(e) => handleInputChange("tecnicoResponsavel", e.target.value)}
                placeholder="Nome do técnico"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">Tipo de atendimento *</Label>
              <RadioGroup
                value={formData.tipoAtendimento}
                onValueChange={(value) => handleInputChange("tipoAtendimento", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inicial" id="inicial" />
                  <Label htmlFor="inicial">Inicial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Retorno" id="retorno" />
                  <Label htmlFor="retorno">Retorno</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Encaminhamento" id="encaminhamento" />
                  <Label htmlFor="encaminhamento">Encaminhamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Acompanhamento" id="acompanhamento" />
                  <Label htmlFor="acompanhamento">Acompanhamento</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Forma de atendimento *</Label>
              <RadioGroup
                value={formData.formaAtendimento}
                onValueChange={(value) => handleInputChange("formaAtendimento", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Presencial" id="presencial" />
                  <Label htmlFor="presencial">Presencial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Telefônico" id="telefonico" />
                  <Label htmlFor="telefonico">Telefônico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Domiciliar" id="domiciliar" />
                  <Label htmlFor="domiciliar">Domiciliar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Outros" id="outros" />
                  <Label htmlFor="outros">Outros</Label>
                </div>
              </RadioGroup>

              {formData.formaAtendimento === "Outros" && (
                <Input
                  value={formData.formaAtendimentoOutros}
                  onChange={(e) => handleInputChange("formaAtendimentoOutros", e.target.value)}
                  placeholder="Especifique a forma de atendimento"
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demand and Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            3. Demanda e Serviços
          </CardTitle>
          <CardDescription>Demanda apresentada e serviços relacionados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="demandaApresentada">Demanda apresentada *</Label>
            <Textarea
              id="demandaApresentada"
              value={formData.demandaApresentada}
              onChange={(e) => handleInputChange("demandaApresentada", e.target.value)}
              placeholder="Descrição sucinta da demanda trazida pelo usuário ou identificada pelo serviço"
              rows={4}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-base font-medium">Serviço ou Benefício Relacionado</Label>
            <div className="mt-2 space-y-2">
              {servicosBeneficios.map((servico) => (
                <div key={servico} className="flex items-center space-x-2">
                  <Checkbox
                    id={servico}
                    checked={formData.servicoBeneficio.includes(servico)}
                    onCheckedChange={(checked) => handleServiceChange(servico, checked as boolean)}
                  />
                  <Label htmlFor={servico} className="text-sm">
                    {servico}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <Label htmlFor="servicoBeneficioOutros">Outros serviços</Label>
              <Input
                id="servicoBeneficioOutros"
                value={formData.servicoBeneficioOutros}
                onChange={(e) => handleInputChange("servicoBeneficioOutros", e.target.value)}
                placeholder="Especifique outros serviços"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="encaminhamentosRealizados">Encaminhamentos realizados</Label>
            <Textarea
              id="encaminhamentosRealizados"
              value={formData.encaminhamentosRealizados}
              onChange={(e) => handleInputChange("encaminhamentosRealizados", e.target.value)}
              placeholder="Informar órgãos, serviços ou setores para os quais o usuário foi encaminhado"
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Technical Observations */}
      <Card>
        <CardHeader>
          <CardTitle>6. Observações do Técnico / Parecer Social</CardTitle>
          <CardDescription>Avaliação técnica e parecer profissional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="observacoesTecnico">Observações do técnico</Label>
            <Textarea
              id="observacoesTecnico"
              value={formData.observacoesTecnico}
              onChange={(e) => handleInputChange("observacoesTecnico", e.target.value)}
              placeholder="Observações técnicas sobre o atendimento"
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="parecerSocial">Parecer social</Label>
            <Textarea
              id="parecerSocial"
              value={formData.parecerSocial}
              onChange={(e) => handleInputChange("parecerSocial", e.target.value)}
              placeholder="Parecer técnico social"
              rows={4}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>7. Resultados</CardTitle>
          <CardDescription>Resultado do atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={formData.resultado} onValueChange={(value) => handleInputChange("resultado", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DEFERIDO" id="deferido" />
              <Label htmlFor="deferido">Deferido</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INDEFERIDO" id="indeferido" />
              <Label htmlFor="indeferido">Indeferido</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PENDENTE" id="pendente" />
              <Label htmlFor="pendente">Pendente</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !formData.userId}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Registrar Atendimento
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
