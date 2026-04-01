"use client"

import { useState, type FormEvent } from "react"
import { Shield, User, Mail, Lock, Loader2, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface LoginViewProps {
  onLogin: (mode: "admin" | "guest") => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simula delay de autenticacao
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // TODO: Wire up your auth logic here
    // For now, always show the error toast as requested
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "You do not have permission to access here. Please log in as a Guest.",
    })

    setIsLoading(false)
    setIsAdminModalOpen(false)
    setEmail("")
    setPassword("")
  }

  const handleGuestAccess = () => {
    onLogin("guest")
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            LootTracker
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gerenciador de Despesas e Lucros Diarios
          </p>
        </div>

        {/* Access Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => setIsAdminModalOpen(true)}
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.25)] transition-all duration-300"
          >
            <Shield className="w-5 h-5 mr-2" />
            Admin Access
          </Button>

          <Button
            onClick={handleGuestAccess}
            variant="outline"
            className="w-full h-14 text-base font-semibold border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all duration-300"
          >
            <User className="w-5 h-5 mr-2" />
            Guest Access
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-muted-foreground text-xs mt-8">
          Acesse como convidado para visualizar o dashboard
        </p>
      </div>

      {/* Admin Login Modal */}
      <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
        <DialogContent className="dark bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              Acesso Administrativo
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Insira suas credenciais para acessar o painel de administracao
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdminSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@loottracker.com"
                  required
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
