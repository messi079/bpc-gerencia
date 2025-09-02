"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { AttendanceForm } from "@/components/attendance-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function NovoAtendimentoContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const userName = searchParams.get('userName')
  const userCpf = searchParams.get('userCpf')
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

  const prefilledData = userId ? {
    userId,
    userName: userName || '',
    userCpf: userCpf || ''
  } : undefined

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={userId ? "/buscar" : "/"}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Novo Atendimento</h1>
              <p className="text-muted-foreground">
                {userName ? `Registrar atendimento para ${userName}` : 'Registrar novo atendimento social'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AttendanceForm prefilledData={prefilledData} />
        </div>
      </main>
    </div>
    </AuthenticatedLayout>
  )
}

export default function NovoAtendimentoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovoAtendimentoContent />
    </Suspense>
  )
}
