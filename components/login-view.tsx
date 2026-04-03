'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; 
import { Shield, User, Loader2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// --- MUDANÇA AQUI: Definimos a "lista de convidados" (Props) para o TypeScript ---
interface LoginViewProps {
  onLogin?: (mode: "admin" | "guest") => void;
}

export function LoginView({ onLogin }: LoginViewProps) { // Destruturamos o onLogin aqui
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- LOGIN ADMINISTRADOR ---
  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Redirecionando para o painel...",
      });

      // Avisa o componente pai que o admin logou
      if (onLogin) onLogin("admin");

      router.push("/dashboard");
      router.refresh(); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha no login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIN CONVIDADO ---
  const handleGuestAccess = async () => {
    setIsGuestLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'convidado@loottracker.com',
        password: 'guest123',
      });

      if (error) throw error;

      // Avisa o componente pai que o convidado logou
      if (onLogin) onLogin("guest");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Verifica as tuas chaves do Supabase no .env.local",
      });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">LootTracker</h1>
          <p className="text-muted-foreground mt-2 text-sm">Gerenciador de Despesas e Lucros</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => setIsAdminModalOpen(true)}
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            <Shield className="w-5 h-5 mr-2" />
            Admin Access
          </Button>

          <Button
            onClick={handleGuestAccess}
            disabled={isGuestLoading}
            variant="outline"
            className="w-full h-14 text-base font-semibold"
          >
            {isGuestLoading ? <Loader2 className="animate-spin" /> : <><User className="w-5 h-5 mr-2" /> Guest Access</>}
          </Button>
        </div>
      </div>

      <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
        <DialogContent className="dark bg-card border-border">
          <DialogHeader>
            <DialogTitle>Acesso Administrativo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}