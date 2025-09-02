import { Button } from "@/components/ui/button"
import { Plus, Filter, BarChart3 } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sistema de Atendimento Social</h1>
            <p className="text-muted-foreground">Gestão de prontuários e benefícios sociais</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/buscar">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Busca Avançada
              </Button>
            </Link>
            <Link href="/relatorios">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </Link>
            <Link href="/atendimentos/novo">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Atendimento
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
