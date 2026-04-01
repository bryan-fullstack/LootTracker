"use client"

import { useState, type FormEvent } from "react"
import {
  Fuel,
  Wrench,
  TrendingUp,
  Gamepad2,
  LogOut,
  User,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface DashboardProps {
  isGuestMode: boolean
  onLogout: () => void
}

interface ExpenseFormProps {
  title: string
  description: string
  icon: React.ReactNode
  iconColor: string
  borderColor: string
  glowColor: string
  amountPlaceholder: string
  descriptionPlaceholder: string
  submitLabel: string
  isDisabled: boolean
  onSubmit: (amount: number, description: string) => void
}

function ExpenseCard({
  title,
  description,
  icon,
  iconColor,
  borderColor,
  glowColor,
  amountPlaceholder,
  descriptionPlaceholder,
  submitLabel,
  isDisabled,
  onSubmit,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [desc, setDesc] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSubmit(parseFloat(amount), desc)
    setAmount("")
    setDesc("")
    setIsLoading(false)
  }

  return (
    <Card
      className={`bg-card border-border ${
        isDisabled ? "opacity-60" : ""
      } transition-all duration-300 ${
        !isDisabled ? `hover:border-[${borderColor}]/50 hover:shadow-[0_0_30px_${glowColor}]` : ""
      }`}
      style={{
        boxShadow: isDisabled ? undefined : `0 0 20px ${glowColor}`,
        borderColor: isDisabled ? undefined : `${borderColor}30`,
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <span style={{ color: iconColor }}>{icon}</span>
          </div>
          <div>
            <CardTitle className="text-foreground text-lg">{title}</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor={`${title}-amount`}
              className="text-foreground text-sm"
            >
              Valor (R$)
            </Label>
            <Input
              id={`${title}-amount`}
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={amountPlaceholder}
              disabled={isDisabled}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`${title}-desc`}
              className="text-foreground text-sm"
            >
              Descricao
            </Label>
            <Input
              id={`${title}-desc`}
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={descriptionPlaceholder}
              disabled={isDisabled}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={isDisabled || isLoading}
            className="w-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isDisabled ? "#262626" : iconColor,
              color: isDisabled ? "#737373" : "#0b0b0b",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </form>

        {isDisabled && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Modo visualizacao apenas
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function Dashboard({ isGuestMode, onLogout }: DashboardProps) {
  const { toast } = useToast()

  const handleExpenseSubmit = (
    type: string,
    amount: number,
    description: string
  ) => {
    // TODO: Wire up to your backend/database
    toast({
      title: "Registro Salvo",
      description: `${type}: R$ ${amount.toFixed(2)}${
        description ? ` - ${description}` : ""
      }`,
    })
  }

  return (
    <div className="dark min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LootTracker</h1>
          </div>

          <div className="flex items-center gap-4">
            {isGuestMode && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30">
                <User className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary font-medium">
                  Guest Mode
                </span>
              </div>
            )}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Dashboard Financeiro
          </h2>
          <p className="text-muted-foreground mt-1">
            {isGuestMode
              ? "Visualizacao do painel - editar requer acesso administrativo"
              : "Gerencie suas despesas e lucros diarios"}
          </p>
        </div>

        {/* Guest Mode Banner */}
        {isGuestMode && (
          <div className="mb-6 p-4 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-sm text-secondary">
              <strong>Modo Convidado:</strong> Voce esta visualizando o
              dashboard em modo somente leitura. Para editar os dados, faca
              login como administrador.
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ExpenseCard
            title="Despesas com Gasolina"
            description="Registre gastos com combustivel"
            icon={<Fuel className="w-5 h-5" />}
            iconColor="#f59e0b"
            borderColor="#f59e0b"
            glowColor="rgba(245, 158, 11, 0.1)"
            amountPlaceholder="Ex: 150.00"
            descriptionPlaceholder="Ex: Tanque cheio"
            submitLabel="Registrar Despesa"
            isDisabled={isGuestMode}
            onSubmit={(amount, desc) =>
              handleExpenseSubmit("Gasolina", amount, desc)
            }
          />

          <ExpenseCard
            title="Despesas com Manutencao"
            description="Registre gastos com reparos"
            icon={<Wrench className="w-5 h-5" />}
            iconColor="#ef4444"
            borderColor="#ef4444"
            glowColor="rgba(239, 68, 68, 0.1)"
            amountPlaceholder="Ex: 350.00"
            descriptionPlaceholder="Ex: Troca de oleo"
            submitLabel="Registrar Despesa"
            isDisabled={isGuestMode}
            onSubmit={(amount, desc) =>
              handleExpenseSubmit("Manutencao", amount, desc)
            }
          />

          <ExpenseCard
            title="Lucros Diarios"
            description="Registre seus ganhos do dia"
            icon={<TrendingUp className="w-5 h-5" />}
            iconColor="#22c55e"
            borderColor="#22c55e"
            glowColor="rgba(34, 197, 94, 0.1)"
            amountPlaceholder="Ex: 500.00"
            descriptionPlaceholder="Ex: Corridas do dia"
            submitLabel="Registrar Lucro"
            isDisabled={isGuestMode}
            onSubmit={(amount, desc) =>
              handleExpenseSubmit("Lucro", amount, desc)
            }
          />
        </div>
      </main>
    </div>
  )
}
