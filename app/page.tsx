'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Gamepad2, Loader2, LogIn, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Se já tem sessão, vai pro dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    };
    checkUser();
  }, [router, supabase.auth]);

  // Login do ADMIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro de Acesso",
        description: "Credenciais inválidas ou problema de conexão.",
      });
    } else {
      setIsLoginOpen(false);
      router.push('/dashboard');
    }
    setLoading(false);
  };

  // Login do VISITANTE (Automático)
  const handleGuestLogin = async () => {
    setIsGuestLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: 'convidado@loottracker.com',
      password: 'visitante123',
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no Modo Visitante",
        description: "Não foi possível acessar a conta de demonstração.",
      });
    } else {
      router.push('/dashboard');
    }
    setIsGuestLoading(false);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">LootTracker</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mt-2">Gerenciador de Lucros e Despesas</p>
        </div>

        <div className="bg-card/30 border border-border rounded-3xl p-8 backdrop-blur-xl shadow-xl">
          
          {/* BOTÃO ENTRAR (ABRE O POP-UP) */}
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-11 text-base font-semibold" disabled={isGuestLoading}>
                <LogIn className="w-5 h-5 mr-2" /> Entrar no Sistema
              </Button>
            </DialogTrigger>
            <DialogContent className="dark bg-card border-border max-w-[400px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Acesso Restrito</DialogTitle>
                <DialogDescription>
                  Insira suas credenciais de comandante.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail do Comandante</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Chave de Acesso</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Acesso"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* DIVISOR */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            </div>
          </div>

          {/* BOTÃO VISITANTE */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 text-muted-foreground hover:text-foreground border-border/50 bg-background/30 hover:bg-background/80" 
            onClick={handleGuestLogin}
            disabled={loading || isGuestLoading}
          >
            {isGuestLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><User className="w-4 h-4 mr-2" /> Acessar como Visitante</>}
          </Button>

        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          <span>Conexão criptografada via Supabase Auth</span>
        </div>
      </div>
    </div>
  );
}