"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, User, MapPin, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  idade: string
  sexo: string
  enderecoCompleto: string
  telefones: string
  responsavelLegalNome: string
  responsavelLegalCpf: string
}

export function UserRegistrationForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    idade: "",
    sexo: "",
    enderecoCompleto: "",
    telefones: "",
    responsavelLegalNome: "",
    responsavelLegalCpf: "",
  })

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-calculate age when birth date changes
    if (field === "dataNascimento" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData((prev) => ({ ...prev, idade: String(age - 1) }))
      } else {
        setFormData((prev) => ({ ...prev, idade: String(age) }))
      }
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCPFChange = (field: keyof UserData, value: string) => {
    const formatted = formatCPF(value)
    setFormData((prev) => ({ ...prev, [field]: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validações básicas
      if (!formData.nomeCompleto || !formData.cpf || !formData.dataNascimento) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha nome completo, CPF e data de nascimento.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          dataCadastro: new Date().toISOString().split('T')[0]
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Usuário cadastrado com sucesso!",
          description: `${formData.nomeCompleto} foi adicionado ao sistema.`,
        })

        // Reset form
        setFormData({
          nomeCompleto: "",
          cpf: "",
          dataNascimento: "",
          idade: "",
          sexo: "",
          enderecoCompleto: "",
          telefones: "",
          responsavelLegalNome: "",
          responsavelLegalCpf: "",
        })
      } else {
        toast({
          title: "Erro ao cadastrar usuário",
          description: data.error || "Tente novamente ou entre em contato com o suporte.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      toast({
        title: "Erro ao cadastrar usuário",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            1. Identificação do Usuário
          </CardTitle>
          <CardDescription>Dados pessoais básicos do usuário dos serviços municipais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nomeCompleto">Nome completo *</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                placeholder="Digite o nome completo"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleCPFChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dataNascimento">Data de nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                value={formData.idade}
                onChange={(e) => handleInputChange("idade", e.target.value)}
                placeholder="Calculada automaticamente"
                readOnly
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="sexo">Sexo *</Label>
              <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Informações de Contato
          </CardTitle>
          <CardDescription>Endereço e telefones para contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="enderecoCompleto">Endereço completo</Label>
            <Textarea
              id="enderecoCompleto"
              value={formData.enderecoCompleto}
              onChange={(e) => handleInputChange("enderecoCompleto", e.target.value)}
              placeholder="Rua, número, bairro, cidade, CEP"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="telefones">Telefone(s)</Label>
            <Input
              id="telefones"
              value={formData.telefones}
              onChange={(e) => handleInputChange("telefones", e.target.value)}
              placeholder="(11) 99999-9999, (11) 3333-3333"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Responsável Legal
          </CardTitle>
          <CardDescription>Informações do responsável legal (se aplicável)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsavelLegalNome">Nome do responsável legal</Label>
              <Input
                id="responsavelLegalNome"
                value={formData.responsavelLegalNome}
                onChange={(e) => handleInputChange("responsavelLegalNome", e.target.value)}
                placeholder="Nome completo do responsável"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="responsavelLegalCpf">CPF do responsável legal</Label>
              <Input
                id="responsavelLegalCpf"
                value={formData.responsavelLegalCpf}
                onChange={(e) => handleCPFChange("responsavelLegalCpf", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Cadastrar Usuário
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
