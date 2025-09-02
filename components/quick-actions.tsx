import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CalendarDays, Users, Search } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/usuarios/novo" className="block">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </Link>
        <Link href="/atendimentos/novo" className="block">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <CalendarDays className="h-4 w-4 mr-2" />
            Novo Atendimento
          </Button>
        </Link>
        <Link href="/usuarios" className="block">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Ver Usuários
          </Button>
        </Link>
        <Link href="/buscar" className="block">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Busca Avançada
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
