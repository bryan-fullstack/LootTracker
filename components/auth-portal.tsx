"use client"

import { useState, type FormEvent } from "react"
import { Mail, Lock, Shield, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthPortal() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simula delay de requisição
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // TODO: Integração com Supabase
    // import { createClient } from '@supabase/supabase-js'
    // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    //
    // if (isLogin) {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   })
    // } else {
    //   const { data, error } = await supabase.auth.signUp({
    //     email,
    //     password,
    //   })
    // }

    console.log(isLogin ? "Login com:" : "Cadastro com:", { email, password })
    setLoading(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 border-2 border-primary/50 bg-card/95 backdrop-blur-sm shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <CardHeader className="text-center pb-2">
          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            <h1 className="text-3xl font-bold tracking-wide text-foreground">
              O Portal de Acesso
            </h1>
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            {isLogin ? "Bem-vindo de volta, aventureiro" : "Registre sua lenda"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Banner */}
          <Alert className="border-secondary/50 bg-secondary/10">
            <Shield className="h-5 w-5 text-secondary" />
            <AlertDescription className="text-foreground/90 ml-2">
              <span className="font-bold text-secondary">Area do Viajante:</span>{" "}
              Sinta-se a vontade para usar dados ficticios (ex: heroi@teste.com).
              O login serve apenas para salvar sua progressao e XP neste portfolio!
            </AlertDescription>
          </Alert>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Pergaminho Magico (E-mail)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="heroi@reino.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Senha Secreta
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Conjurando magia...
                </span>
              ) : isLogin ? (
                "Entrar no Reino"
              ) : (
                "Iniciar Jornada"
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2 border-t border-border">
            <p className="text-muted-foreground text-sm mb-2">
              {isLogin ? "Novo por aqui?" : "Ja possui uma ficha?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:text-secondary font-bold transition-colors duration-300 underline underline-offset-4 decoration-primary/50 hover:decoration-secondary"
            >
              {isLogin ? "Criar novo Heroi" : "Ja tenho uma Ficha"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
