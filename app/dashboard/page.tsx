'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  LogOut, TrendingUp, TrendingDown, Wallet, Loader2, Gamepad2, Fuel, Wrench, ShieldAlert,
  CalendarDays, ArrowUpRight, ArrowDownRight, History, Trash2, Filter, LineChart as ChartIcon, RefreshCw
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
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
  const [timeFilter, setTimeFilter] = useState<'hoje' | '7d' | '30d' | 'all'>('all');

  const router = useRouter();
  const { toast } = useToast();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isAdmin = userEmail === 'bryand.720@gmail.com';

  const [gasAmount, setGasAmount] = useState("");
  const [gasDesc, setGasDesc] = useState("");
  const [isGasLoading, setIsGasLoading] = useState(false);
  const [manAmount, setManAmount] = useState("");
  const [manDesc, setManDesc] = useState("");
  const [isManLoading, setIsManLoading] = useState(false);
  const [lucroAmount, setLucroAmount] = useState("");
  const [lucroDesc, setLucroDesc] = useState("");
  const [isLucroLoading, setIsLucroLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true }); // Gráfico precisa de ordem crescente

    if (!error) setData(records || []);
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/');
      else {
        setUserEmail(session.user.email || null);
        fetchData();
      }
    };
    checkUser();
  }, []);

  // --- LÓGICA DE FILTRO ---
  const filteredData = useMemo(() => {
    if (timeFilter === 'all') return data;
    const limitDate = new Date();
    if (timeFilter === 'hoje') limitDate.setHours(0, 0, 0, 0);
    else if (timeFilter === '7d') limitDate.setDate(limitDate.getDate() - 7);
    else if (timeFilter === '30d') limitDate.setDate(limitDate.getDate() - 30);
    return data.filter(item => new Date(item.date) >= limitDate);
  }, [data, timeFilter]);

  // --- PREPARAÇÃO DOS DADOS PARA O GRÁFICO ---
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: any } = {};
    
    filteredData.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (!dailyData[date]) {
        dailyData[date] = { date, lucro: 0, despesa: 0 };
      }
      if (item.type === 'income') dailyData[date].lucro += item.amount;
      else dailyData[date].despesa += item.amount;
    });

    return Object.values(dailyData);
  }, [filteredData]);

  // Cálculos
  const totalIncome = filteredData.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = filteredData.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Funções de Transação e Delete
  const handleTransaction = async (type: 'income' | 'expense', category: string, amountStr: string, description: string, setLoadingState: (s: boolean) => void, resetForm: () => void) => {
    if (!amountStr || !isAdmin) return;
    setLoadingState(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('transactions').insert([{ type, category, amount: parseFloat(amountStr), description, user_id: user?.id }]);
    if (error) toast({ variant: "destructive", title: "Erro", description: error.message });
    else { toast({ title: "Sucesso", description: "Registrado!" }); resetForm(); fetchData(); }
    setLoadingState(false);
  };

  const handleDeleteClick = (id: string) => { if (isAdmin) { setIdToDelete(id); setIsDeleteDialogOpen(true); } };
  const confirmDelete = async () => {
    if (!idToDelete || !isAdmin) return;
    const { error } = await supabase.from('transactions').delete().eq('id', idToDelete);
    if (!error) { toast({ title: "Excluído" }); fetchData(); }
    setIsDeleteDialogOpen(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER RESPONSIVO */}
        <header className="flex items-center justify-between mb-10 border-b border-border/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-primary" /></div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">LootTracker</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">Dashboard de Comandante</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="px-2 md:px-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 md:mr-2" />}
              <span className="hidden md:inline">Atualizar</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 md:px-3 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </header>

        {/* ÁREA DE INSERÇÃO COM BOTÕES COLORIDOS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
  
  {/* Card Gasolina */}
  <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-6">
      <Fuel className="w-5 h-5 text-amber-500" />
      <h3 className="font-semibold text-lg">Gasolina</h3>
    </div>
    <div className="space-y-4">
      <Input type="number" step="0.01" placeholder="R$ 0,00" value={gasAmount} onChange={(e) => setGasAmount(e.target.value)} disabled={!isAdmin} />
      <Input placeholder="Descrição" value={gasDesc} onChange={(e) => setGasDesc(e.target.value)} disabled={!isAdmin} />
      <Button 
        className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300" 
        disabled={isGasLoading || !isAdmin}
        onClick={() => handleTransaction('expense', 'Gasolina', gasAmount, gasDesc, setIsGasLoading, () => { setGasAmount(''); setGasDesc(''); })}
      >
        {isGasLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar Despesa"}
      </Button>
    </div>
  </div>

  {/* Card Manutenção */}
  <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-6">
      <Wrench className="w-5 h-5 text-rose-500" />
      <h3 className="font-semibold text-lg">Manutenção</h3>
    </div>
    <div className="space-y-4">
      <Input type="number" step="0.01" placeholder="R$ 0,00" value={manAmount} onChange={(e) => setManAmount(e.target.value)} disabled={!isAdmin} />
      <Input placeholder="Descrição" value={manDesc} onChange={(e) => setManDesc(e.target.value)} disabled={!isAdmin} />
      <Button 
        className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all duration-300"
        disabled={isManLoading || !isAdmin}
        onClick={() => handleTransaction('expense', 'Manutenção', manAmount, manDesc, setIsManLoading, () => { setManAmount(''); setManDesc(''); })}
      >
        {isManLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar Despesa"}
      </Button>
    </div>
  </div>

  {/* Card Lucros */}
  <div className="bg-card/30 border border-border rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-6">
      <TrendingUp className="w-5 h-5 text-emerald-500" />
      <h3 className="font-semibold text-lg">Lucros Diários</h3>
    </div>
    <div className="space-y-4">
      <Input type="number" step="0.01" placeholder="R$ 0,00" value={lucroAmount} onChange={(e) => setLucroAmount(e.target.value)} disabled={!isAdmin} />
      <Input placeholder="Descrição" value={lucroDesc} onChange={(e) => setLucroDesc(e.target.value)} disabled={!isAdmin} />
      <Button 
        className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300"
        disabled={isLucroLoading || !isAdmin}
        onClick={() => handleTransaction('income', 'Lucro Diário', lucroAmount, lucroDesc, setIsLucroLoading, () => { setLucroAmount(''); setLucroDesc(''); })}
      >
        {isLucroLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Registrar Lucro"}
      </Button>
    </div>
  </div>
</div>

        {!isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-center gap-3 mb-10"><ShieldAlert className="w-5 h-5 text-primary shrink-0" /><p className="text-sm text-primary">Modo visitante: somente visualização por segurança.</p></div>
        )}

        {/* ÁREA DE ANÁLISE */}
        <div className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3"><Filter className="w-5 h-5 text-primary" /><h2 className="text-xl font-bold">Análise de Desempenho</h2></div>
          <div className="flex p-1 bg-card/50 border border-border rounded-lg backdrop-blur-sm w-full md:w-auto overflow-x-auto">
            {['hoje', '7d', '30d', 'all'].map((f) => (
              <Button key={f} size="sm" variant={timeFilter === f ? 'default' : 'ghost'} onClick={() => setTimeFilter(f as any)} className="flex-1 md:flex-none">
                {f === 'all' ? 'Tudo' : f.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <CardData title="Total Loot" value={totalIncome} icon={<TrendingUp className="text-emerald-400" />} color="border-emerald-500/20" />
          <CardData title="Despesas" value={totalExpenses} icon={<TrendingDown className="text-rose-400" />} color="border-rose-500/20" />
          <CardData title="Lucro Líquido" value={netProfit} icon={<Wallet className="text-primary" />} color="border-primary/20" isMain />
        </div>

        {/* --- GRÁFICO DE PERFORMANCE --- */}
        <div className="bg-card/30 border border-border rounded-2xl p-4 md:p-6 backdrop-blur-sm mb-10">
          <div className="flex items-center gap-3 mb-8">
            <ChartIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-base md:text-lg text-muted-foreground">Tendência de Lucros vs Despesas</h3>
          </div>
          
          <div className="h-[250px] md:h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="lucro" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLucro)" />
                  <Area type="monotone" dataKey="despesa" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesa)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm text-center px-4">
                Sem dados suficientes para gerar o gráfico neste período.
              </div>
            )}
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="bg-card/30 border border-border rounded-2xl p-4 md:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6"><History className="w-5 h-5 text-muted-foreground" /><h3 className="font-semibold text-muted-foreground">Histórico do Período</h3></div>
          <div className="space-y-3">
            {filteredData.slice().reverse().map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {item.type === 'income' ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  <div><p className="font-medium text-sm">{item.category}</p><p className="text-xs text-muted-foreground truncate max-w-[100px] md:max-w-xs">{item.description}</p></div>
                </div>
                <div className="flex items-center gap-2 md:gap-8">
                  <div className="hidden md:block text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString('pt-BR')}</div>
                  <div className={`font-bold text-sm md:text-base ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>R$ {item.amount.toLocaleString('pt-BR')}</div>
                  {isAdmin && <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id)} className="h-8 w-8 hover:text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark bg-card border-border max-w-[90vw] md:max-w-[400px]">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-rose-500"><Trash2 className="w-5 h-5" />Confirmar Exclusão</DialogTitle><DialogDescription className="pt-4">Apagar este registro? A ação é permanente.</DialogDescription></DialogHeader>
          <div className="flex justify-end gap-3 mt-4"><Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button><Button variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={confirmDelete}>Sim, Apagar</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardData({ title, value, icon, color, isMain = false }: any) {
  return (
    <div className={`p-5 md:p-6 rounded-2xl border ${color} bg-card/30 backdrop-blur-md relative overflow-hidden group hover:bg-card/50 transition-all duration-300`}>
      {isMain && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />}
      <div className="flex justify-between items-start mb-4"><p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p><div className="p-2 bg-background/50 rounded-lg">{icon}</div></div>
      <div className="flex items-baseline gap-1"><span className="text-xl md:text-2xl font-bold">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
    </div>
  );
}