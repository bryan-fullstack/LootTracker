'use client';

import { useState, useEffect } from 'react';
import { UserProfile, AcquiredSkill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadingState } from '@/components/loading-state';
import { EmptySkillsState } from '@/components/empty-skills-state';
import { SkillCard } from '@/components/skill-card';
import { 
  UserCircle, 
  CalendarDays, 
  Zap,
  Brain,
  Flame,
  Shield
} from 'lucide-react';

export function CharacterSheet() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<AcquiredSkill[] | null>(null);

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      // Dados de exemplo - em produção viriam do Supabase
      const mockProfile: UserProfile = {
        email: 'adventurer@taverna.dev',
        created_at: new Date('2024-01-15').toISOString(),
        level: 5,
        current_xp: 2450,
        xp_to_next_level: 3000,
      };

      const mockSkills: AcquiredSkill[] = [
        { id: '1', name: 'React', icon_name: 'Zap', xp_points: 450 },
        { id: '2', name: 'TypeScript', icon_name: 'Code', xp_points: 380 },
        { id: '3', name: 'Node.js', icon_name: 'Server', xp_points: 420 },
        { id: '4', name: 'PostgreSQL', icon_name: 'Database', xp_points: 400 },
        { id: '5', name: 'Next.js', icon_name: 'Layout', xp_points: 460 },
        { id: '6', name: 'Tailwind CSS', icon_name: 'Palette', xp_points: 340 },
      ];

      setProfile(mockProfile);
      setSkills(mockSkills);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!profile || !skills) {
    return <LoadingState />;
  }

  const xpPercentage = (profile.current_xp / profile.xp_to_next_level) * 100;

  // Calcular atributos baseado em total de XP
  const totalXp = profile.current_xp + skills.reduce((sum, s) => sum + s.xp_points, 0);
  const logicaPercentage = Math.min(100, (totalXp / 5000) * 100);
  const agilidadePercentage = Math.min(100, ((totalXp * 0.85) / 5000) * 100);
  const resilienciaPercentage = Math.min(100, ((totalXp * 0.7) / 5000) * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="dark min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho - Card do Usuário */}
        <Card className="bg-card/30 border border-border/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/50">
                <UserCircle className="h-16 w-16 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {profile.email.split('@')[0].charAt(0).toUpperCase() + profile.email.split('@')[0].slice(1)}
                </h1>
                <p className="text-foreground/80 font-mono mb-3">
                  {profile.email}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Membro desde: {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Status - Nível e XP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/30 border border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Nível & Experiência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-3xl font-bold text-primary">
                  Nível {profile.level}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Investigador
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="text-primary font-mono">
                    {profile.current_xp} / {profile.xp_to_next_level} XP
                  </span>
                </div>
                <Progress 
                  value={xpPercentage} 
                  className="h-3 bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Atributos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Lógica (Back-end)</span>
                  <span className="text-accent font-mono text-xs">
                    {logicaPercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={logicaPercentage} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Agilidade (Front-end)</span>
                  <span className="text-accent font-mono text-xs">
                    {agilidadePercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={agilidadePercentage} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Resiliência (Security)</span>
                  <span className="text-accent font-mono text-xs">
                    {resilienciaPercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={resilienciaPercentage} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventário de Habilidades */}
        <Card className="bg-card/30 border border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Habilidades Adquiridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <EmptySkillsState />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
