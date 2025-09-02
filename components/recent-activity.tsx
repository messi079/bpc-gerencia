import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  name: string
  service: string
  time: string
  status: "pending" | "approved" | "denied"
}

const activities: ActivityItem[] = [
  {
    name: "Maria Silva Santos",
    service: "Atendimento inicial - BPC",
    time: "Hoje, 14:30",
    status: "pending",
  },
  {
    name: "João Oliveira",
    service: "Retorno - Cadastro Único",
    time: "Hoje, 13:15",
    status: "approved",
  },
  {
    name: "Ana Costa",
    service: "Acompanhamento - CPTEA",
    time: "Hoje, 11:00",
    status: "denied",
  },
  {
    name: "Carlos Ferreira",
    service: "Encaminhamento - CRAS",
    time: "Ontem, 16:45",
    status: "approved",
  },
]

function getStatusBadge(status: ActivityItem["status"]) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pendente</Badge>
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Deferido</Badge>
    case "denied":
      return <Badge variant="destructive">Indeferido</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimos atendimentos e atualizações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{activity.service}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              {getStatusBadge(activity.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
