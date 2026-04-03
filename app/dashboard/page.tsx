'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  LogOut, TrendingUp, TrendingDown, Wallet, Loader2, Gamepad2, Fuel, Wrench, ShieldAlert,
  CalendarDays, ArrowUpRight, ArrowDownRight, History, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isAdmin = userEmail === 'bryand.720@gmail.com';

  // Estados dos formulários
  const [gasAmount, setGasAmount] = useState("");
  const [gasDesc, setGasDesc] = useState("");
  const [isGasLoading, setIsGasLoading] = useState(false);

  const [manAmount, setManAmount] = useState("");
  const [manDesc, setManDesc] = useState("");
  const [isManLoading, setIsManLoading] = useState(false);

  const [lucroAmount, setLucroAmount] = useState("");
  const [lucroDesc, setLucroDesc] = useState("");
  const [isLucroLoading, setIsLucroLoading] = useState(false);

  // Estados do Modal de Exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // --- FUNÇÕES ---
  const handleTransaction = async (
    type: 'income' | 'expense', 
    category: string, 
    amountStr: string, 
    description: string, 
    setLoadingState: (s: boolean) => void,
    resetForm: () => void
  ) => {
    if (!amountStr || !isAdmin) return;
    setLoadingState(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('transactions').insert([{ 
      type,
      category,
      amount: parseFloat(amountStr), 
      description,
      user_id: user?.id
    }]);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Sucesso", description: `${category} registrado!` });
      resetForm();
      fetchData();
    }
    setLoadingState(false);
  };

  // 1. Abre o modal e guarda o ID que será apagado
  const handleDeleteClick = (id: string) => {
    if (!isAdmin) return;
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // 2. Executa a exclusão após confirmar no modal
  const confirmDelete = async () => {
    if (!idToDelete || !isAdmin) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', idToDelete);

    if (error) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: error.message });
    } else {
      toast({ title: "Excluído", description: "Registro removido com sucesso." });
      fetchData();
    }
    setIsDeleteDialogOpen(false);
    setIdToDelete(null);
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (!error) setData(records || []);
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUserEmail(session.user.email || null);
        fetchData();
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const totalIncome = data.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = data.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-10 border-b border-border/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LootTracker</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Dashboard de Comandante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </header>

        {/* RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <CardData title="Total Loot (Entradas)" value={totalIncome} icon={<TrendingUp className="text-emerald-400" />} color="border-emerald-500/20" />
          <CardData title="Despesas Totais" value={totalExpenses} icon={<TrendingDown className="text-rose-400" />} color="border-rose-500/20" />
          <CardData title="Lucro Líquido" value={netProfit} icon={<Wallet className="text-primary" />} color="border-primary/20" isMain />
        </div>

        {/* ÁREA DE INSERÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Form Gasolina */}
          <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Fuel className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Gasolina</h3>
            </div>
            <div className="space-y-4">
              <Input type="number" step="0.01" placeholder="Valor" value={gasAmount} onChange={(e) => setGasAmount(e.target.value)} disabled={!isAdmin} />
              <Input placeholder="Descrição" value={gasDesc} onChange={(e) => setGasDesc(e.target.value)} disabled={!isAdmin} />
              <Button 
                className="w-full bg-card hover:bg-muted border border-border text-foreground" 
                disabled={isGasLoading || !isAdmin}
                onClick={() => handleTransaction('expense', 'Gasolina', gasAmount, gasDesc, setIsGasLoading, () => { setGasAmount(''); setGasDesc(''); })}
              >
                {isGasLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar"}
              </Button>
            </div>
          </div>

          {/* Form Manutenção */}
          <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold text-lg">Manutenção</h3>
            </div>
            <div className="space-y-4">
              <Input type="number" step="0.01" placeholder="Valor" value={manAmount} onChange={(e) => setManAmount(e.target.value)} disabled={!isAdmin} />
              <Input placeholder="Descrição" value={manDesc} onChange={(e) => setManDesc(e.target.value)} disabled={!isAdmin} />
              <Button 
                className="w-full bg-card hover:bg-muted border border-border text-foreground"
                disabled={isManLoading || !isAdmin}
                onClick={() => handleTransaction('expense', 'Manutenção', manAmount, manDesc, setIsManLoading, () => { setManAmount(''); setManDesc(''); })}
              >
                {isManLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar"}
              </Button>
            </div>
          </div>

          {/* Form Lucros */}
          <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-lg">Lucros</h3>
            </div>
            <div className="space-y-4">
              <Input type="number" step="0.01" placeholder="Valor" value={lucroAmount} onChange={(e) => setLucroAmount(e.target.value)} disabled={!isAdmin} />
              <Input placeholder="Descrição" value={lucroDesc} onChange={(e) => setLucroDesc(e.target.value)} disabled={!isAdmin} />
              <Button 
                className="w-full bg-card hover:bg-muted border border-border text-foreground"
                disabled={isLucroLoading || !isAdmin}
                onClick={() => handleTransaction('income', 'Lucro Diário', lucroAmount, lucroDesc, setIsLucroLoading, () => { setLucroAmount(''); setLucroDesc(''); })}
              >
                {isLucroLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar"}
              </Button>
            </div>
          </div>
        </div>

        {/* AVISO VISITANTE */}
        {!isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-center gap-3 mb-10 text-center">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-primary font-medium tracking-wide">
              Modo visitante: somente visualização por segurança. Integração direta com dados reais.
            </p>
          </div>
        )}

        {/* HISTÓRICO COM LIXEIRA */}
        <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm mt-10">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Histórico de Transações</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary/50" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum registro encontrado.</div>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.category}</p>
                      <p className="text-xs text-muted-foreground">{item.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center text-xs text-muted-foreground gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDateTime(item.date)}
                    </div>
                    <div className={`font-bold text-sm md:text-base w-24 text-right ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>

                    {/* Botão de Excluir - Chama a função correta agora */}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão Estilizado */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark bg-card border-border max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500">
              <Trash2 className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-4 text-muted-foreground">
              Tem certeza que deseja apagar este registro? Esta ação não pode ser desfeita e afetará seus cálculos de lucro.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={confirmDelete}
            >
              Sim, Apagar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardData({ title, value, icon, color, isMain = false }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${color} bg-card/30 backdrop-blur-md relative overflow-hidden group hover:bg-card/50 transition-all duration-300`}>
      {isMain && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />}
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-background/50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}